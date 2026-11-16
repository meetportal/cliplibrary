import { Easing } from 'remotion';
import type { BrandRevealProps } from '@/schemas';
import { ramp } from '../../kit/motion';

const draw = Easing.bezier(0.42, 0, 0.32, 1);
const rise = Easing.bezier(0.3, 0, 0.2, 1);
const swell = Easing.inOut(Easing.quad);
const push = Easing.bezier(0.5, 0, 0.7, 1);

const RING_LEAD = 10;
const LETTER_LEAD = 4;
const LETTER_FRAMES = 13;
const LETTER_FADE = 9;
const LETTER_SPAN = 30;
const TAGLINE_FRAMES = 20;
const LINE_FADE_SHARE = 0.8;
const CLOSE_AT = 0.97;

export type Timeline = {
  ringStart: number;
  ringEnd: number;
  letterStart: number;
  letterGap: number;
  taglineStart: number;
  taglineEnd: number;
  exitStart: number;
  exitEnd: number;
};

export const buildTimeline = (
  timing: BrandRevealProps['timing'],
  letters: number,
  stretch: number,
  duration: number,
): Timeline => {
  const ringStart = timing.start + RING_LEAD;
  const ringEnd = ringStart + timing.drawFrames * stretch;
  const letterStart = ringStart + LETTER_LEAD;
  const letterGap =
    letters > 1 ? Math.min(timing.letterFrames, LETTER_SPAN / (letters - 1)) : timing.letterFrames;
  const lastLetter = letterStart + Math.max(0, letters - 1) * letterGap;
  const taglineStart = lastLetter + timing.taglineDelay;
  return {
    ringStart,
    ringEnd,
    letterStart,
    letterGap,
    taglineStart,
    taglineEnd: taglineStart + TAGLINE_FRAMES,
    exitStart: duration - timing.exitFrames,
    exitEnd: duration - 1,
  };
};

const stepsLeft = (
  frame: number,
  start: number,
  frames: number,
  distance: number,
  quantum: number,
  easing: (t: number) => number,
) => {
  const total = Math.round(distance / quantum);
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < total; step++) {
    const ideal =
      total *
      (ramp(step, start, start + frames, easing) - ramp(step - 1, start, start + frames, easing));
    travelled = Math.min(total, travelled + Math.max(1, Math.round(ideal)));
  }
  return (total - travelled) * quantum;
};

export const letterIn = (frame: number, start: number, distance: number, quantum: number) => ({
  offset: stepsLeft(frame, start, LETTER_FRAMES, distance, quantum, rise),
  opacity: ramp(frame, start, start + LETTER_FADE, swell),
});

export const lineIn = (
  frame: number,
  start: number,
  end: number,
  distance: number,
  quantum: number,
) => ({
  offset: stepsLeft(frame, start, end - start, distance, quantum, swell),
  opacity: ramp(frame, start, start + (end - start) * LINE_FADE_SHARE, swell),
});

export const drawProgress = (frame: number, line: Timeline) =>
  ramp(frame, line.ringStart, line.ringEnd, draw);

export const ringClosed = (progress: number) => progress >= CLOSE_AT;

export const ringDash = (progress: number) => Math.min(1, progress / CLOSE_AT);

export const strokeGrow = (progress: number) => ramp(progress, 0, 0.4, swell);

export const pushScale = (frame: number, duration: number, amount: number) =>
  1 + amount * ramp(frame, 0, duration - 1, push);

export const exitProgress = (frame: number, line: Timeline) =>
  line.exitEnd > line.exitStart ? ramp(frame, line.exitStart, line.exitEnd, swell) : 0;
