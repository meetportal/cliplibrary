import { Easing, interpolate } from 'remotion';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

export const smooth = Easing.bezier(0.65, 0, 0.35, 1);

export const linear = (t: number) => t;

export const tween = (
  frame: number,
  range: readonly [number, number],
  output: readonly [number, number],
  easing: (t: number) => number,
): number =>
  range[1] <= range[0]
    ? frame >= range[1]
      ? output[1]
      : output[0]
    : interpolate(frame, [range[0], range[1]], [output[0], output[1]], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      });

export const TAU = Math.PI * 2;
