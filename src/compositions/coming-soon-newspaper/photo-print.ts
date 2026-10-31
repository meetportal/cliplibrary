import { converter } from 'culori';
import type { Box, Context } from '../elevator-newspaper/page-type';

type Ink = { ink: string; paper: string };

type PhotoLook = {
  focus: number;
  zoom: number;
  contrast: number;
  brightness: number;
  grain: number;
  seed: number;
};

const toRgb = converter('rgb');

const rgb = (color: string): [number, number, number] => {
  const parsed = toRgb(color);
  return parsed === undefined ? [0, 0, 0] : [parsed.r * 255, parsed.g * 255, parsed.b * 255];
};

const noise = (seed: number) => {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296 - 0.5;
  };
};

export const printedPhoto = (
  context: Context,
  image: CanvasImageSource | null,
  box: Box,
  { ink, paper }: Ink,
  look: PhotoLook,
) => {
  const width = Math.round(box.width);
  const height = Math.round(box.height);
  const art = document.createElement('canvas');
  art.width = width;
  art.height = height;
  const photo = art.getContext('2d', { willReadFrequently: true });
  if (photo === null) {
    return;
  }
  if (image === null) {
    photo.fillStyle = '#9a9a9a';
    photo.fillRect(0, 0, width, height);
  } else {
    const source = image as { width: number; height: number };
    const scale = Math.max(width / source.width, height / source.height) * look.zoom;
    const drawnWidth = source.width * scale;
    const drawnHeight = source.height * scale;
    photo.filter = `grayscale(1) brightness(${look.brightness}) contrast(${look.contrast})`;
    photo.drawImage(
      image,
      (width - drawnWidth) / 2,
      (height - drawnHeight) * look.focus,
      drawnWidth,
      drawnHeight,
    );
    photo.filter = 'none';
  }
  const pixels = photo.getImageData(0, 0, width, height);
  const data = pixels.data;
  const dark = rgb(ink);
  const light = rgb(paper);
  const random = noise(look.seed);
  const amount = look.grain * 0.5;
  for (let index = 0; index < data.length; index += 4) {
    const luma =
      ((data[index] ?? 0) * 0.299 +
        (data[index + 1] ?? 0) * 0.587 +
        (data[index + 2] ?? 0) * 0.114) /
      255;
    const level = Math.min(1, Math.max(0, luma + random() * amount));
    data[index] = dark[0] + (light[0] - dark[0]) * level;
    data[index + 1] = dark[1] + (light[1] - dark[1]) * level;
    data[index + 2] = dark[2] + (light[2] - dark[2]) * level;
    data[index + 3] = 255;
  }
  photo.putImageData(pixels, 0, 0);
  context.drawImage(art, box.x, box.y, box.width, box.height);
};
