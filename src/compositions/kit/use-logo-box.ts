import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from './resolve-custom';

export type LogoBox = { x: number; y: number; w: number; h: number; aspect: number };

const SAMPLE = 160;
const ALPHA_FLOOR = 10;

export const usableImage = (value: string) => value.trim() !== '' && !value.includes('{{');

const fullBox = (image: HTMLImageElement): LogoBox => ({
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  aspect: image.naturalWidth / image.naturalHeight,
});

const opaqueBox = (image: HTMLImageElement): LogoBox => {
  const scale = SAMPLE / Math.max(image.naturalWidth, image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return fullBox(image);
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
      return fullBox(image);
    }
    const w = (maxX - minX + 1) / width;
    const h = (maxY - minY + 1) / height;
    return {
      x: minX / width,
      y: minY / height,
      w,
      h,
      aspect: (image.naturalWidth * w) / (image.naturalHeight * h),
    };
  } catch {
    return fullBox(image);
  }
};

export const useLogoBox = (value: string): LogoBox | null => {
  const src = usableImage(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; box: LogoBox | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (src === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Measuring the logo ${src.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const finish = (box: LogoBox | null) => {
      if (active) {
        setLoaded({ src, box });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => finish(image.naturalHeight > 0 ? opaqueBox(image) : null);
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
  return loaded !== null && loaded.src === src ? loaded.box : null;
};
