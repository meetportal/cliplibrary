import { Easing } from 'remotion';
import type { BrandRevealProps } from '@/schemas';
import { ramp } from '../../kit/motion';

export const settle = Easing.bezier(0.22, 0.9, 0.3, 1);
const draw = Easing.bezier(0.42, 0, 0.32, 1);

const EYEBROW_FRAMES = 14;
const RING_LEAD = 4;
const LETTER_LEAD = 8;
export const LETTER_FRAMES = 14;
const LETTER_SPAN = 30;
const TAGLINE_FRAMES = 18;
const CLOSE_AT = 0.97;

export type Timeline = {
  eyebrowStart: number;
  eyebrowEnd: number;
  ringStart: number;
  ringEnd: number;
  letterStart: number;
  letterGap: number;
  taglineStart: number;
  taglineEnd: number;
};

export const buildTimeline = (
  timing: BrandRevealProps['timing'],
  letters: number,
  stretch: number,
): Timeline => {
  const eyebrowStart = timing.start;
  const ringStart = eyebrowStart + RING_LEAD;
  const ringEnd = ringStart + Math.round(timing.drawFrames * stretch);
  const letterStart = ringStart + LETTER_LEAD;
  const letterGap =
    letters > 1 ? Math.min(timing.letterFrames, LETTER_SPAN / (letters - 1)) : timing.letterFrames;
  const lastLetter = letterStart + Math.max(0, letters - 1) * letterGap;
  const taglineStart = Math.round(lastLetter + timing.taglineDelay);
  return {
    eyebrowStart,
    eyebrowEnd: eyebrowStart + EYEBROW_FRAMES,
    ringStart,
    ringEnd,
    letterStart,
    letterGap,
    taglineStart,
    taglineEnd: taglineStart + TAGLINE_FRAMES,
  };
};

export const drawProgress = (frame: number, line: Timeline) =>
  ramp(frame, line.ringStart, line.ringEnd, draw);

export const ringClosed = (progress: number) => progress >= CLOSE_AT;

export const ringDash = (progress: number) => Math.min(1, progress / CLOSE_AT);

export const plateIn = (frame: number, line: Timeline) => {
  const span = line.ringEnd - line.ringStart;
  const from = line.ringStart + span * 0.35;
  return {
    opacity: ramp(frame, from, line.ringEnd + 4, Easing.inOut(Easing.quad)),
    scale: 0.9 + 0.1 * ramp(frame, from, line.ringEnd + 6, settle),
  };
};
