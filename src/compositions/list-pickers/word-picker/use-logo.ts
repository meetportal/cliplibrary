import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

type LogoCrop = { x: number; y: number; width: number; height: number };

export type LogoState = { src: string; aspect: number } | null;

const usable = (value: string) => value.trim() !== '' && !value.includes('{{');

const SAMPLE = 200;

const SOLID = 24;

const WHOLE: LogoCrop = { x: 0, y: 0, width: 1, height: 1 };

const contentBox = (image: HTMLImageElement): LogoCrop => {
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = aspect >= 1 ? SAMPLE : Math.max(1, Math.round(SAMPLE * aspect));
  const height = aspect >= 1 ? Math.max(1, Math.round(SAMPLE / aspect)) : SAMPLE;
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (context === null) {
    return WHOLE;
  }
  context.canvas.width = width;
  context.canvas.height = height;
  context.drawImage(image, 0, 0, width, height);
  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, width, height).data;
  } catch {
    return WHOLE;
  }
  let left = width;
  let right = -1;
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((pixels[(y * width + x) * 4 + 3] ?? 0) > SOLID) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left || bottom < top) {
    return WHOLE;
  }
  const pad = 1;
  const x0 = Math.max(0, left - pad);
  const y0 = Math.max(0, top - pad);
  const x1 = Math.min(width, right + 1 + pad);
  const y1 = Math.min(height, bottom + 1 + pad);
  return { x: x0 / width, y: y0 / height, width: (x1 - x0) / width, height: (y1 - y0) / height };
};

const croppedSource = (image: HTMLImageElement, crop: LogoCrop, src: string): string => {
  if (crop === WHOLE) {
    return src;
  }
  const width = Math.max(1, Math.round(image.naturalWidth * crop.width));
  const height = Math.max(1, Math.round(image.naturalHeight * crop.height));
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return src;
  }
  context.canvas.width = width;
  context.canvas.height = height;
  context.drawImage(
    image,
    image.naturalWidth * crop.x,
    image.naturalHeight * crop.y,
    width,
    height,
    0,
    0,
    width,
    height,
  );
  try {
    return context.canvas.toDataURL('image/png');
  } catch {
    return src;
  }
};

export const useLogo = (value: string): LogoState => {
  const src = usable(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{
    src: string;
    aspect: number | null;
    drawn: string;
  } | null>(null);
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
    const finish = (aspect: number | null, drawn: string) => {
      if (active) {
        setLoaded({ src, aspect, drawn });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => {
      if (image.naturalHeight <= 0) {
        finish(null, src);
        return;
      }
      const crop = contentBox(image);
      finish(
        (image.naturalWidth * crop.width) / (image.naturalHeight * crop.height),
        croppedSource(image, crop, src),
      );
    };
    image.onerror = () => finish(null, src);
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
  if (src === '' || loaded === null || loaded.src !== src || loaded.aspect === null) {
    return null;
  }
  return { src: loaded.drawn, aspect: loaded.aspect };
};
