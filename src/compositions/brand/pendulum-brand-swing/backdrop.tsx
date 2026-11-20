import { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import { FRAME } from './swing';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];
const GLOW = { x: 540, y: 640, radius: 820 };
const DITHER = 3;

const ease = (t: number) => t * t * (3 - 2 * t);

const seeded = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const paint = (canvas: HTMLCanvasElement, ratio: number, center: string, edge: string) => {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, FRAME.width, FRAME.height);
  const glow = ctx.createRadialGradient(GLOW.x, GLOW.y, 0, GLOW.x, GLOW.y, GLOW.radius);
  for (const stop of STOPS) {
    glow.addColorStop(stop, mixLab(center, edge, ease(stop)));
  }
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, FRAME.width, FRAME.height);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const random = seeded(7);
  for (let at = 0; at < image.data.length; at += 4) {
    const noise = (random() + random() - 1) * DITHER;
    image.data[at] = (image.data[at] ?? 0) + noise;
    image.data[at + 1] = (image.data[at + 1] ?? 0) + noise;
    image.data[at + 2] = (image.data[at + 2] ?? 0) + noise;
  }
  ctx.putImageData(image, 0, 0);
};

export const Backdrop = ({ center, edge }: { center: string; edge: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useCanvasPixelRatio(1);
  useLayoutEffect(() => {
    if (ref.current !== null) {
      paint(ref.current, ratio, center, edge);
    }
  }, [ratio, center, edge]);
  return (
    <AbsoluteFill>
      <canvas
        ref={ref}
        width={Math.round(FRAME.width * ratio)}
        height={Math.round(FRAME.height * ratio)}
        style={{ width: FRAME.width, height: FRAME.height }}
      />
    </AbsoluteFill>
  );
};
