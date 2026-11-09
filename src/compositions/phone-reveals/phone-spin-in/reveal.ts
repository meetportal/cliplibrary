import { Easing, interpolate } from 'remotion';
import { pixelTween } from './pixel-tween';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

export const tween = (
  frame: number,
  range: readonly [number, number],
  output: readonly [number, number],
  easing: (t: number) => number,
) =>
  interpolate(frame, [range[0], range[1]], [output[0], output[1]], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const FADE_FRAMES = 12;
const MOVE_FRAMES = 34;

export type Reveal = { opacity: number; transform: string };

export const reveal = (frame: number, start: number, axis: 'x' | 'y', distance: number): Reveal => {
  const opacity = tween(frame, [start, start + FADE_FRAMES], [0, 1], Easing.out(Easing.quad));
  const offset = pixelTween(frame, [start, start + MOVE_FRAMES], [distance, 0], settle);
  return {
    opacity,
    transform: axis === 'x' ? `translateX(${offset}px)` : `translateY(${offset}px)`,
  };
};
