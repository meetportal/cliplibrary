import { type CSSProperties, useLayoutEffect, useRef } from 'react';
import type { Face } from './fonts';
import { SHEET } from './mesh';

const RESOLUTION = 3;
const OVERFLOW = 0.45;

export type LineStyle = {
  face: Face;
  size: number;
  leading: number;
  tracking: number;
  color: string;
};

export const CanvasLine = ({
  text,
  look,
  style,
}: {
  text: string;
  look: LineStyle;
  style: CSSProperties;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const boxHeight = look.size * look.leading;
  const pad = look.size * OVERFLOW;
  const height = boxHeight + pad * 2;
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    canvas.width = Math.ceil(SHEET.width * RESOLUTION);
    canvas.height = Math.ceil(height * RESOLUTION);
    context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
    context.clearRect(0, 0, SHEET.width, height);
    context.font = `${look.face.weight} ${look.size}px "${look.face.family}"`;
    context.letterSpacing = `${look.tracking * look.size}px`;
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    context.fillStyle = look.color;
    const metrics = context.measureText(text);
    const visible = metrics.width - look.tracking * look.size;
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    const baseline = pad + (boxHeight - ascent - descent) / 2 + ascent;
    context.fillText(text, (SHEET.width - visible) / 2, baseline);
  });
  return (
    <div style={{ position: 'absolute', left: 0, width: SHEET.width, height: boxHeight, ...style }}>
      <canvas
        ref={ref}
        aria-label={text}
        style={{ position: 'absolute', left: 0, top: -pad, width: SHEET.width, height }}
      />
    </div>
  );
};
