import { Easing, interpolate } from 'remotion';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

export const smooth = Easing.bezier(0.65, 0, 0.35, 1);

export const glide = Easing.bezier(0.45, 0, 0.25, 1);

export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = smooth,
) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const STRIDE = 2;

export const pixelTween = (
  frame: number,
  range: [number, number],
  from: number,
  to: number,
  easing: (t: number) => number = settle,
) => {
  const start = Math.round(from);
  const distance = Math.abs(Math.round(to) - start);
  if (distance === 0 || frame <= range[0]) {
    return start;
  }
  const direction = Math.sign(Math.round(to) - start);
  const at = (step: number) => from + (to - from) * ramp(step, range[0], range[1], easing);
  let travelled = 0;
  for (let step = Math.floor(range[0]) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(at(step) - at(step - 1));
    travelled = Math.min(
      distance,
      travelled + Math.max(STRIDE, Math.round(ideal / STRIDE) * STRIDE),
    );
  }
  return start + direction * travelled;
};

export const ENTRANCE = 20;

export const RISE = 24;

const CLOSE_AT = 0.97;

export const dashOf = (share: number) =>
  share >= CLOSE_AT
    ? { pathLength: undefined, strokeDasharray: undefined }
    : { pathLength: 1, strokeDasharray: `${(share / CLOSE_AT).toFixed(4)} 2` };
