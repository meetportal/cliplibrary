import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { usableImage } from '../../kit/use-logo-box';

export type TrimmedLogo = { src: string; aspect: number; tone: string | null };

const SAMPLE = 200;
const ALPHA_FLOOR = 10;
const LONGEST = 1200;

const opaqueBounds = (image: HTMLImageElement) => {
  const scale = SAMPLE / Math.max(image.naturalWidth, image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (context === null) {
    return null;
  }
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  const sum = [0, 0, 0, 0];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = (y * width + x) * 4;
      const alpha = data[at + 3] ?? 0;
      if (alpha > ALPHA_FLOOR) {
        const weight = alpha / 255;
        sum[0] = (sum[0] ?? 0) + (data[at] ?? 0) * weight;
        sum[1] = (sum[1] ?? 0) + (data[at + 1] ?? 0) * weight;
        sum[2] = (sum[2] ?? 0) + (data[at + 2] ?? 0) * weight;
        sum[3] = (sum[3] ?? 0) + weight;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < 0) {
    return null;
  }
  const left = Math.max(0, minX - 1);
  const top = Math.max(0, minY - 1);
  const right = Math.min(width, maxX + 2);
  const bottom = Math.min(height, maxY + 2);
  const total = Math.max(1e-6, sum[3] ?? 0);
  const tone = `#${[0, 1, 2]
    .map((channel) =>
      Math.round((sum[channel] ?? 0) / total)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
  return {
    tone,
    x: (left / width) * image.naturalWidth,
    y: (top / height) * image.naturalHeight,
    w: ((right - left) / width) * image.naturalWidth,
    h: ((bottom - top) / height) * image.naturalHeight,
  };
};

const trim = (image: HTMLImageElement, fallback: string): TrimmedLogo => {
  const whole = { src: fallback, aspect: image.naturalWidth / image.naturalHeight, tone: null };
  try {
    const bounds = opaqueBounds(image);
    if (bounds === null) {
      return whole;
    }
    const scale = Math.min(1, LONGEST / Math.max(bounds.w, bounds.h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bounds.w * scale));
    canvas.height = Math.max(1, Math.round(bounds.h * scale));
    const context = canvas.getContext('2d');
    if (context === null) {
      return whole;
    }
    context.drawImage(
      image,
      bounds.x,
      bounds.y,
      bounds.w,
      bounds.h,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    return { src: canvas.toDataURL('image/png'), aspect: bounds.w / bounds.h, tone: bounds.tone };
  } catch {
    return whole;
  }
};

export const useTrimmedLogo = (value: string): TrimmedLogo | null => {
  const source = usableImage(value) ? resolveCustom(value) : '';
  const [loaded, setLoaded] = useState<{ source: string; logo: TrimmedLogo | null } | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    if (source === '') {
      return;
    }
    let active = true;
    const pending = delayRender(`Trimming the logo ${source.slice(0, 80)}`);
    setHandle(pending);
    const image = new Image();
    const finish = (logo: TrimmedLogo | null) => {
      if (active) {
        setLoaded({ source, logo });
      } else {
        continueRender(pending);
      }
    };
    image.onload = () => finish(image.naturalHeight > 0 ? trim(image, source) : null);
    image.onerror = () => finish(null);
    image.src = source;
    return () => {
      active = false;
    };
  }, [source, delayRender, continueRender]);
  useEffect(() => {
    if (loaded !== null && loaded.source === source && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, source, handle, continueRender]);
  return loaded !== null && loaded.source === source ? loaded.logo : null;
};
