import { useMemo } from 'react';
import type { Face } from './fonts';

const RESOLUTION = 2;
const PAD = 0.3;

export type WordImage = { href: string; x: number; y: number; w: number; h: number };

const drawWord = (
  text: string,
  face: Face,
  size: number,
  color: string,
  left: number,
  baseline: number,
): WordImage | null => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null || text.length === 0) {
    return null;
  }
  const font = `${face.weight} ${size}px "${face.family}"`;
  context.font = font;
  const metrics = context.measureText(text);
  const pad = PAD * size;
  const before = Math.max(0, metrics.actualBoundingBoxLeft) + pad;
  const after = Math.max(metrics.width, metrics.actualBoundingBoxRight) + pad;
  const above = Math.max(metrics.fontBoundingBoxAscent, metrics.actualBoundingBoxAscent) + pad;
  const below = Math.max(metrics.fontBoundingBoxDescent, metrics.actualBoundingBoxDescent) + pad;
  const w = before + after;
  const h = above + below;
  canvas.width = Math.ceil(w * RESOLUTION);
  canvas.height = Math.ceil(h * RESOLUTION);
  context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
  context.font = font;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = color;
  context.fillText(text, before, above);
  return {
    href: canvas.toDataURL('image/png'),
    x: left - before,
    y: baseline - above,
    w: canvas.width / RESOLUTION,
    h: canvas.height / RESOLUTION,
  };
};

export const useWordImage = (
  ready: boolean,
  text: string,
  face: Face,
  size: number,
  color: string,
  left: number,
  baseline: number,
) =>
  useMemo(
    () => (ready ? drawWord(text, face, size, color, left, baseline) : null),
    [ready, text, face, size, color, left, baseline],
  );
