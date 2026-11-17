import { useLayoutEffect, useRef } from 'react';
import type { Face } from './fonts';

const RESOLUTION = 3;
const BLEED = 0.4;

export type TextLook = {
  text: string;
  face: Face;
  size: number;
  tracking: number;
  color: string;
  lineHeight: number;
  width: number;
};

const drawText = (canvas: HTMLCanvasElement, look: TextLook, bleed: number) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const line = look.size * look.lineHeight;
  const boxWidth = look.width + bleed * 2;
  const boxHeight = line + bleed * 2;
  const pixelsWide = Math.ceil(boxWidth * RESOLUTION);
  const pixelsHigh = Math.ceil(boxHeight * RESOLUTION);
  if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
    canvas.width = pixelsWide;
    canvas.height = pixelsHigh;
  }
  context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
  context.clearRect(0, 0, boxWidth, boxHeight);
  if (look.text === '') {
    return;
  }
  context.font = `${look.face.weight} ${look.size}px "${look.face.family}"`;
  context.letterSpacing = `${(look.face.tracking + look.tracking) * look.size}px`;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = look.color;
  const metrics = context.measureText(look.text);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  context.fillText(look.text, bleed, bleed + (line - ascent - descent) / 2 + ascent);
};

export const CanvasText = ({ look }: { look: TextLook }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const bleed = look.size * BLEED;
  useLayoutEffect(() => {
    if (ref.current !== null) {
      drawText(ref.current, look, bleed);
    }
  });
  return (
    <canvas
      ref={ref}
      aria-label={look.text}
      style={{
        display: 'block',
        flexShrink: 0,
        width: look.width + bleed * 2,
        height: look.size * look.lineHeight + bleed * 2,
        margin: -bleed,
      }}
    />
  );
};
