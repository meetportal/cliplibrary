import { Easing } from 'remotion';
import type { AppIconRevealProps } from '@/schemas';
import { ramp } from '../../kit/motion';

const smooth = Easing.bezier(0.65, 0, 0.35, 1);
const turn = Easing.bezier(0.3, 0, 0.7, 1);
const glide = Easing.bezier(0.4, 0, 0.6, 1);

const ENTER_FRAMES = 18;
const ENTER_SCALE = 0.92;
const TYPE_SPAN = 36;
const LETTER_FADE = 6;
const LETTER_RISE_FRAMES = 8;
const LETTER_RISE = 0.16;
const SHINE_LEAD = 14;
const SHINE_FRAMES = 20;
const DRIFT_PERIOD = 72;
const DRIFT_PHASE = 0.6;
const DRIFT_X = 1;
const EXIT_SHRINK = 0.06;
const WIDE_SLOWDOWN = 0.75;

export type Timeline = {
  flipStart: number;
  flipEnd: number;
  typeStart: number;
  letterGap: number;
  typeEnd: number;
  shineStart: number;
  exitStart: number;
  exitEnd: number;
};

export const buildTimeline = (
  timing: AppIconRevealProps['timing'],
  letters: number,
  duration: number,
  widthRatio: number,
): Timeline => {
  const flipFrames =
    2 * Math.round((timing.flipFrames * Math.max(1, widthRatio) ** WIDE_SLOWDOWN) / 2);
  const flipStart = timing.flipStart;
  const flipEnd = flipStart + flipFrames;
  const typeStart = flipStart + flipFrames / 2 + timing.typeDelay;
  const letterGap =
    letters > 1 ? Math.min(timing.letterFrames, TYPE_SPAN / (letters - 1)) : timing.letterFrames;
  const typeEnd = typeStart + Math.max(0, letters - 1) * letterGap + LETTER_FADE;
  return {
    flipStart,
    flipEnd,
    typeStart,
    letterGap,
    typeEnd,
    shineStart: Math.max(0, flipStart - SHINE_LEAD),
    exitStart: duration - timing.exitFrames,
    exitEnd: duration,
  };
};

export const entrance = (frame: number) =>
  ENTER_SCALE + (1 - ENTER_SCALE) * ramp(frame, 0, ENTER_FRAMES, smooth);

export const flipAngle = (frame: number, line: Timeline) =>
  Math.PI * ramp(frame, line.flipStart, line.flipEnd, turn);

export const shineProgress = (frame: number, line: Timeline) =>
  ramp(frame, line.shineStart, line.shineStart + SHINE_FRAMES, glide);

export const driftOffset = (frame: number, amount: number) => {
  const phase = (2 * Math.PI * frame) / DRIFT_PERIOD + DRIFT_PHASE;
  return { x: amount * DRIFT_X * Math.sin(phase), y: -amount * Math.cos(phase) };
};

export const letterState = (frame: number, start: number, size: number) => {
  const shown = ramp(frame, start, start + LETTER_FADE, Easing.out(Easing.quad));
  const rise = Math.round(
    size *
      LETTER_RISE *
      (1 - ramp(frame, start, start + LETTER_RISE_FRAMES, Easing.out(Easing.cubic))),
  );
  return { shown, rise };
};

export const exitProgress = (frame: number, line: Timeline) =>
  line.exitEnd > line.exitStart ? ramp(frame, line.exitStart, line.exitEnd - 1, smooth) : 0;

export const exitScale = (progress: number) => 1 - EXIT_SHRINK * progress * progress;
