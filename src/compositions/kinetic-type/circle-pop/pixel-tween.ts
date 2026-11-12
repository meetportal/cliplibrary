import { interpolate } from 'remotion';

export const pixelTween = (
  frame: number,
  range: [number, number],
  from: number,
  to: number,
  easing: (t: number) => number,
) => {
  const tween = (at: number) =>
    interpolate(at, range, [from, to], {
      easing,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const start = Math.round(from);
  const distance = Math.abs(Math.round(to) - start);
  if (distance === 0 || frame <= range[0]) {
    return start;
  }
  const direction = Math.sign(Math.round(to) - start);
  let travelled = 0;
  for (let step = Math.floor(range[0]) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(tween(step) - tween(step - 1));
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(ideal)));
  }
  return start + direction * travelled;
};
