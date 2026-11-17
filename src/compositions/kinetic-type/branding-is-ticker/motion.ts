import { interpolate } from 'remotion';
import { ramp } from '../../kit/motion';
import { ENTRY_FRAMES, ENTRY_RISE, rise } from './timeline';

const DRIFT_SPEED = 0.25;
const DRIFT_RAMP = 40;

export const entry = (frame: number, start: number) => ({
  opacity: ramp(frame, start, start + 14),
  offset:
    ENTRY_RISE *
    (1 -
      interpolate(frame, [start, start + ENTRY_FRAMES], [0, 1], {
        easing: rise,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })),
});

export const drift = (frame: number, start: number) => {
  const elapsed = Math.max(0, frame - start);
  if (elapsed <= DRIFT_RAMP) {
    const x = elapsed / DRIFT_RAMP;
    return DRIFT_SPEED * DRIFT_RAMP * (x ** 3 - x ** 4 / 2);
  }
  return DRIFT_SPEED * (DRIFT_RAMP / 2 + elapsed - DRIFT_RAMP);
};
