import { useEffect, useLayoutEffect, useRef } from 'react';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import type { Face } from './fonts';

const RESOLUTION = 2;

export type StripRun = { key: number; text: string; x: number };

export type StripBar = { width: number; top: number; height: number };

export const TickerStrip = ({
  runs,
  face,
  size,
  width,
  height,
  textTop,
  slot,
  dim,
  active,
  bar,
}: {
  runs: StripRun[];
  face: Face;
  size: number;
  width: number;
  height: number;
  textTop: number;
  slot: { left: number; width: number };
  dim: string;
  active: string;
  bar: StripBar | null;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useCanvasPixelRatio(RESOLUTION);
  useEffect(() => {
    const canvas = ref.current;
    return () => {
      if (canvas !== null) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    const wide = Math.max(1, Math.round(width * ratio));
    const high = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== wide || canvas.height !== high) {
      canvas.width = wide;
      canvas.height = high;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, wide, high);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.font = `${face.style} ${face.weight} ${size}px "${face.family}"`;
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    const metrics = context.measureText('Hg');
    const ascent = metrics.fontBoundingBoxAscent;
    const baseline = textTop + (size - ascent - metrics.fontBoundingBoxDescent) / 2 + ascent;
    const from = Math.max(0, slot.left);
    const to = Math.min(width, slot.left + slot.width);
    const paint = (fill: string, spans: [number, number][]) => {
      context.save();
      context.beginPath();
      for (const [left, right] of spans) {
        if (right > left) {
          context.rect(left, 0, right - left, height);
        }
      }
      context.clip();
      context.fillStyle = fill;
      for (const run of runs) {
        context.fillText(run.text, run.x, baseline);
      }
      context.restore();
    };
    paint(dim, [
      [0, from],
      [to, width],
    ]);
    paint(active, [[from, to]]);
    if (bar !== null && bar.width > 0) {
      context.fillStyle = active;
      context.beginPath();
      context.roundRect(slot.left, bar.top, bar.width, bar.height, bar.height / 2);
      context.fill();
    }
  });
  return (
    <canvas
      ref={ref}
      aria-label={runs.map((run) => run.text).join(' ')}
      style={{ position: 'absolute', left: 0, top: 0, width, height }}
    />
  );
};
