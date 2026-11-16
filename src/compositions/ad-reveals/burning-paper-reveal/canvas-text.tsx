import { useLayoutEffect, useRef } from 'react';
import type { Face } from './fonts';
import type { Line } from './layout';

const PAD = 0.6;
const MIN_RESOLUTION = 0.5;
const MAX_RESOLUTION = 4;

const resolutionFor = (detail: number) => {
  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.min(MAX_RESOLUTION, Math.max(MIN_RESOLUTION, ratio * detail));
};

export const CanvasText = ({
  line,
  face,
  color,
  detail,
  tilt = 0,
  pivot = 'left bottom',
  tracking = 0,
}: {
  line: Line;
  face: Face;
  color: string;
  detail: number;
  tilt?: number;
  pivot?: string;
  tracking?: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pad = line.size * PAD;
  const width = line.width + pad * 2;
  const height = line.size + pad * 2;
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    const resolution = resolutionFor(detail);
    canvas.width = Math.ceil(width * resolution);
    canvas.height = Math.ceil(height * resolution);
    context.setTransform(resolution, 0, 0, resolution, 0, 0);
    context.clearRect(0, 0, width, height);
    context.font = `${face.weight} ${line.size}px "${face.family}"`;
    context.letterSpacing = `${tracking * line.size}px`;
    context.textBaseline = 'alphabetic';
    context.fillStyle = color;
    const metrics = context.measureText(line.text);
    const ascent = Math.round(metrics.fontBoundingBoxAscent);
    const descent = Math.round(metrics.fontBoundingBoxDescent);
    context.fillText(line.text, pad, pad + (line.size - ascent - descent) / 2 + ascent);
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: line.left,
        top: line.top,
        width: line.width,
        height: line.size,
        transform: tilt === 0 ? undefined : `rotate(${tilt}deg)`,
        transformOrigin: pivot,
      }}
    >
      <canvas
        ref={ref}
        aria-label={line.text}
        style={{ position: 'absolute', left: -pad, top: -pad, width, height }}
      />
    </div>
  );
};
