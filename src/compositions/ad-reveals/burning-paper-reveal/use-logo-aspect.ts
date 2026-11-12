import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

export const usableImage = (value: string) => value.trim() !== '' && !value.includes('{{');

export type LogoBox = { x: number; y: number; w: number; h: number };

export type LogoInfo = { aspect: number; box: LogoBox };

const FULL: LogoBox = { x: 0, y: 0, w: 1, h: 1 };
const SAMPLE = 160;
const ALPHA_FLOOR = 10;

const opaqueBox = (image: HTMLImageElement): LogoBox => {
  const scale = SAMPLE / Math.max(image.naturalWidth, image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return FULL;
  }
  try {
    context.drawImage(image, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((data[(y * width + x) * 4 + 3] ?? 0) > ALPHA_FLOOR) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    if (maxX < 0) {
      return FULL;
    }
    return {
      x: minX / width,
      y: minY / height,
      w: (maxX - minX + 1) / width,
      h: (maxY - minY + 1) / height,
    };
  } catch {
    return FULL;
  }
};

const measure = (image: HTMLImageElement): LogoInfo | null => {
  if (image.naturalHeight <= 0) {
    return null;
  }
  const box = opaqueBox(image);
  return { aspect: (image.naturalWidth * box.w) / (image.naturalHeight * box.h), box };
};

export const useLogoAspect = (value: string): LogoInfo | null => {
  const src = usableImage(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; info: LogoInfo | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Measuring the burning paper logo ${src.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const finish = (info: LogoInfo | null) => {
      if (active) {
        setLoaded({ src, info });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => finish(measure(image));
    image.onerror = () => finish(null);
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, delayRender, continueRender]);
  useEffect(() => {
    if (loaded !== null && loaded.src === src && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, src, handle, continueRender]);
  return loaded !== null && loaded.src === src ? loaded.info : null;
};
