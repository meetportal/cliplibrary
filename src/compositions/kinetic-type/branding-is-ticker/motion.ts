import { interpolate } from 'remotion';
import { ramp } from '../../kit/motion';
import { ENTRY_FRAMES, ENTRY_RISE, settle } from './timeline';

const MIN_STEP = 2;

const tween = (frame: number, from: number, to: number, easing: (t: number) => number) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const pixelTween = (
  frame: number,
  [start, end]: readonly [number, number],
  distance: number,
  easing: (t: number) => number,
): number => {
  const total = Math.round(distance);
  if (total === 0 || frame <= start) {
    return 0;
  }
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < total; step++) {
    const ideal = (tween(step, start, end, easing) - tween(step - 1, start, end, easing)) * total;
    travelled = Math.min(
      total,
      travelled + Math.max(MIN_STEP, MIN_STEP * Math.round(ideal / MIN_STEP)),
    );
  }
  return travelled;
};

export const entry = (frame: number, start: number) => ({
  opacity: ramp(frame, start, start + 14),
  offset: ENTRY_RISE - pixelTween(frame, [start, start + ENTRY_FRAMES], ENTRY_RISE, settle),
});
