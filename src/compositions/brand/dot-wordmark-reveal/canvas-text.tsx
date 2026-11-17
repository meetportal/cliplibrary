import { useLayoutEffect, useRef } from 'react';
import type { Face } from './fonts';

const RESOLUTION = 3;
const BLEED = 0.4;

export type Glyph = {
  text: string;
  face: Face;
  size: number;
  tracking: number;
  color: string;
  lineHeight: number;
  width: number;
};

const draw = (canvas: HTMLCanvasElement, glyph: Glyph, bleed: number) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const boxWidth = glyph.width + bleed * 2;
  const boxHeight = glyph.lineHeight + bleed * 2;
  const wide = Math.ceil(boxWidth * RESOLUTION);
  const high = Math.ceil(boxHeight * RESOLUTION);
  if (canvas.width !== wide || canvas.height !== high) {
    canvas.width = wide;
    canvas.height = high;
  }
  context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
  context.clearRect(0, 0, boxWidth, boxHeight);
  context.font = `${glyph.face.weight} ${glyph.size}px "${glyph.face.family}"`;
  context.letterSpacing = `${glyph.tracking * glyph.size}px`;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = glyph.color;
  const metrics = context.measureText(glyph.text);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  context.fillText(glyph.text, bleed, bleed + (glyph.lineHeight - ascent - descent) / 2 + ascent);
};

export const CanvasText = ({
  glyph,
  left,
  top,
  opacity,
  dx,
  dy,
}: {
  glyph: Glyph;
  left: number;
  top: number;
  opacity: number;
  dx: number;
  dy: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const bleed = Math.ceil(glyph.size * BLEED);
  const { text, face, size, tracking, color, lineHeight, width } = glyph;
  useLayoutEffect(() => {
    if (ref.current !== null) {
      draw(ref.current, { text, face, size, tracking, color, lineHeight, width }, bleed);
    }
  }, [text, face, size, tracking, color, lineHeight, width, bleed]);
  const moved = dx !== 0 || dy !== 0;
  return (
    <canvas
      ref={ref}
      aria-label={text}
      style={{
        position: 'absolute',
        left: left - bleed,
        top: top - bleed,
        width: width + bleed * 2,
        height: lineHeight + bleed * 2,
        opacity,
        transform: moved ? `translate(${dx.toFixed(3)}px, ${dy.toFixed(3)}px)` : undefined,
      }}
    />
  );
};
