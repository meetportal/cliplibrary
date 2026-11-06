import { interpolate } from 'remotion';

const tween = (
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

export const pixelTween = (
  frame: number,
  range: readonly [number, number],
  [from, to]: readonly [number, number],
  easing: (t: number) => number,
): number => {
  const start = Math.round(from);
  const distance = Math.abs(Math.round(to) - start);
  if (distance === 0 || frame <= range[0]) {
    return start;
  }
  const direction = Math.sign(Math.round(to) - start);
  let travelled = 0;
  for (let step = Math.floor(range[0]) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(
      tween(step, range, [from, to], easing) - tween(step - 1, range, [from, to], easing),
    );
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(ideal)));
  }
  return start + direction * travelled;
};
