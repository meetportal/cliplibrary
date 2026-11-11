import { Easing } from 'remotion';
import type { AppIconRevealProps } from '@/schemas';
import { ramp } from '../../kit/motion';

const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const ENTER_FRAMES = 16;
const TYPE_SPAN = 36;
export const LETTER_FADE = 6;
const SHINE_LEAD = 12;
const SHINE_FRAMES = 26;
const glide = Easing.bezier(0.4, 0, 0.6, 1);
const FLOAT_PERIOD = 96;
const FLOAT_RAMP = 24;

export type Timeline = {
  flipStart: number;
  flipEnd: number;
  typeStart: number;
  letterGap: number;
  typeEnd: number;
  shineStart: number;
};

export const buildTimeline = (timing: AppIconRevealProps['timing'], letters: number): Timeline => {
  const flipStart = timing.flipStart;
  const flipEnd = flipStart + timing.flipFrames;
  const typeStart = flipStart + timing.flipFrames / 2 + timing.typeDelay;
  const letterGap =
    letters > 1 ? Math.min(timing.letterFrames, TYPE_SPAN / (letters - 1)) : timing.letterFrames;
  const typeEnd = typeStart + Math.max(0, letters - 1) * letterGap + LETTER_FADE;
  return {
    flipStart,
    flipEnd,
    typeStart,
    letterGap,
    typeEnd,
    shineStart: Math.max(ENTER_FRAMES * 0.6, flipStart - SHINE_LEAD),
  };
};

export const entrance = (frame: number) => ({
  opacity: ramp(frame, 0, ENTER_FRAMES, Easing.out(Easing.quad)),
  scale: 0.86 + 0.14 * ramp(frame, 0, ENTER_FRAMES + 8, settle),
});

export const flipAngle = (frame: number, line: Timeline) =>
  Math.PI * ramp(frame, line.flipStart, line.flipEnd, smooth);

export const shineProgress = (frame: number, line: Timeline) =>
  ramp(frame, line.shineStart, line.shineStart + SHINE_FRAMES, glide);

export const floatOffset = (frame: number, line: Timeline, amount: number) => {
  const since = frame - line.flipEnd;
  if (since <= 0 || amount <= 0) {
    return 0;
  }
  const grow = ramp(frame, line.flipEnd, line.flipEnd + FLOAT_RAMP, smooth);
  return -amount * grow * Math.sin((2 * Math.PI * since) / FLOAT_PERIOD);
};
