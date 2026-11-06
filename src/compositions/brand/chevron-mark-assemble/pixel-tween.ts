import { Easing, interpolate } from 'remotion';

const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

const tween = (frame: number, range: [number, number], from: number, to: number) =>
  interpolate(frame, range, [from, to], {
    easing: settle,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const pixelTween = (frame: number, range: [number, number], from: number, to: number) => {
  const start = Math.round(from);
  const distance = Math.abs(Math.round(to) - start);
  if (distance === 0 || frame <= range[0]) {
    return start;
  }
  const direction = Math.sign(Math.round(to) - start);
  let travelled = 0;
  for (let step = Math.floor(range[0]) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(tween(step, range, from, to) - tween(step - 1, range, from, to));
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(ideal)));
  }
  return start + direction * travelled;
};
