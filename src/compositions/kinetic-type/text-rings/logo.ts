import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

export type LogoFit = {
  src: string;
  aspect: number;
  centerX: number;
  centerY: number;
  reach: number;
  contentAspect: number;
};

const SAMPLE = 160;
const SOLID = 24;

const wholeImage = (src: string, aspect: number): LogoFit => ({
  src,
  aspect,
  centerX: 0.5,
  centerY: 0.5,
  reach: Math.hypot(0.5, 0.5 / aspect),
  contentAspect: aspect,
});

const analyse = (image: HTMLImageElement, src: string): LogoFit => {
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = aspect >= 1 ? SAMPLE : Math.max(1, Math.round(SAMPLE * aspect));
  const height = aspect >= 1 ? Math.max(1, Math.round(SAMPLE / aspect)) : SAMPLE;
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (context === null) {
    return wholeImage(src, aspect);
  }
  context.canvas.width = width;
  context.canvas.height = height;
  context.drawImage(image, 0, 0, width, height);
  let alpha: Uint8ClampedArray;
  try {
    alpha = context.getImageData(0, 0, width, height).data;
  } catch {
    return wholeImage(src, aspect);
  }
  const solid: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((alpha[(y * width + x) * 4 + 3] ?? 0) > SOLID) {
        solid.push([(x + 0.5) / width, ((y + 0.5) / height) * (height / width)]);
      }
    }
  }
  if (solid.length === 0) {
    return wholeImage(src, aspect);
  }
  const xs = solid.map(([x]) => x);
  const ys = solid.map(([, y]) => y);
  const left = Math.min(...xs) - 0.5 / width;
  const right = Math.max(...xs) + 0.5 / width;
  const top = Math.min(...ys) - 0.5 / width;
  const bottom = Math.max(...ys) + 0.5 / width;
  const middleX = (left + right) / 2;
  const middleY = (top + bottom) / 2;
  const reach =
    Math.max(...solid.map(([x, y]) => Math.hypot(x - middleX, y - middleY))) + 0.7 / width;
  return {
    src,
    aspect,
    centerX: middleX,
    centerY: middleY / (height / width),
    reach,
    contentAspect: (right - left) / (bottom - top),
  };
};

const usable = (value: string) => value.trim() !== '' && !value.includes('{{');

export const useLogoFit = (value: string): LogoFit | null => {
  const src = usable(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ src: string; fit: LogoFit | null } | null>(null);
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
    const finish = (fit: LogoFit | null) => {
      if (active) {
        setLoaded({ src, fit });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => finish(image.naturalHeight > 0 ? analyse(image, src) : null);
    image.onerror = () => finish(null);
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, delayRender, continueRender]);
  const settled = loaded !== null && loaded.src === src;
  useEffect(() => {
    if (settled && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [settled, handle, continueRender]);
  return src !== '' && settled ? (loaded?.fit ?? null) : null;
};
