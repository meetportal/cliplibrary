import { mixLab } from '../../kit/lab-color';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];
const CENTER_Y = 0.46;
const REACH_X = 0.72;
const REACH_Y = 0.92;
const DITHER = 3;
const SEED = 0x2f6e2b1;

const smooth = (t: number) => t * t * (3 - 2 * t);

export type BackdropLayer = { key: string; canvas: HTMLCanvasElement };

const paintGlow = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  center: string,
  edge: string,
) => {
  const reachX = width * REACH_X;
  const reachY = height * REACH_Y;
  context.save();
  context.fillStyle = edge;
  context.fillRect(0, 0, width, height);
  context.translate(width / 2, height * CENTER_Y);
  context.scale(1, reachY / reachX);
  const glow = context.createRadialGradient(0, 0, 0, 0, 0, reachX);
  for (const stop of STOPS) {
    glow.addColorStop(stop, mixLab(center, edge, smooth(stop)));
  }
  context.fillStyle = glow;
  const span = reachX * 2;
  context.fillRect(-span, -span, span * 2, span * 2);
  context.restore();
};

const dither = (context: CanvasRenderingContext2D, wide: number, high: number) => {
  const image = context.getImageData(0, 0, wide, high);
  const pixels = image.data;
  let state = SEED;
  for (let at = 0; at < pixels.length; at += 4) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const offset = ((state >>> 8) / 0x1000000 - 0.5) * DITHER;
    pixels[at] = (pixels[at] ?? 0) + offset;
    pixels[at + 1] = (pixels[at + 1] ?? 0) + offset;
    pixels[at + 2] = (pixels[at + 2] ?? 0) + offset;
  }
  context.putImageData(image, 0, 0);
};

export const backdropLayer = (
  size: { width: number; height: number; wide: number; high: number },
  center: string,
  edge: string,
  previous: BackdropLayer | undefined,
): BackdropLayer => {
  const key = JSON.stringify([size, center, edge]);
  if (previous?.key === key) {
    return previous;
  }
  const canvas = previous?.canvas ?? document.createElement('canvas');
  canvas.width = size.wide;
  canvas.height = size.high;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (context !== null) {
    context.setTransform(size.wide / size.width, 0, 0, size.high / size.height, 0, 0);
    paintGlow(context, size.width, size.height, center, edge);
    context.setTransform(1, 0, 0, 1, 0, 0);
    dither(context, size.wide, size.high);
  }
  return { key, canvas };
};
