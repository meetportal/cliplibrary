import { Easing } from 'remotion';
import type { PillFanProps } from '@/schemas';
import { pixelTween } from '../../brand/dot-ring-logo-reveal/pixel-tween';
import { clamp01, ramp } from '../../kit/motion';

const SWING = Easing.bezier(0.33, 0, 0.2, 1);
export const SETTLE = Easing.bezier(0.25, 0.8, 0.35, 1);
const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);
const FADE_IN = Easing.bezier(0.4, 0, 0.6, 1);
const LAND = Easing.out(Easing.quad);

const CLEAR_EXTRA = 1.4;
const CLEAR_TAIL = 6;
const END_HOLD = 24;
const GLIDE_DELAY = 2;
const GLIDE_FRAMES = 30;
const GLIDE = Easing.bezier(0.45, 0, 0.2, 1);

type Step = { start: number; swing: number; window: number; last: boolean };

export type Timeline = {
  steps: Step[];
  drift: number;
  intro: number;
  clear: { start: number; frames: number } | null;
};

export const buildTimeline = (props: PillFanProps, duration: number): Timeline => {
  const { timing } = props;
  const count = props.words.length - 1;
  const latestLanding = duration - END_HOLD;
  const room = Math.max(1, latestLanding - timing.swing - timing.firstSwap);
  const interval = count > 1 ? Math.min(timing.interval, room / (count - 1)) : timing.interval;
  const swing = Math.min(timing.swing, Math.max(6, interval * 0.9));
  const intro = Math.min(timing.intro, timing.firstSwap);
  const steps: Step[] = [
    { start: 0, swing: intro, window: timing.firstSwap, last: count === 0 },
    ...Array.from({ length: count }, (_, index) => ({
      start: timing.firstSwap + index * interval,
      swing,
      window: interval,
      last: index === count - 1,
    })),
  ];
  const lastStep = steps.at(-1);
  const lastLanding = lastStep === undefined ? intro : lastStep.start + lastStep.swing;
  return {
    steps,
    drift: timing.drift,
    intro,
    clear:
      props.fan.clearAtEnd && lastStep !== undefined
        ? { start: lastStep.start, frames: lastLanding - lastStep.start + CLEAR_TAIL }
        : null,
  };
};

const stepAt = (frame: number, step: Step, drift: number) => {
  const swung = ramp(frame, step.start, step.start + step.swing, SWING);
  const steady = step.last
    ? LAND(clamp01((frame - step.start) / step.swing))
    : clamp01((frame - step.start) / step.window);
  return (1 - drift) * swung + drift * steady;
};

export const progressAt = (frame: number, line: Timeline): number =>
  line.steps.reduce((sum, step) => sum + stepAt(frame, step, line.drift), -1);

export const glideAt = (frame: number, line: Timeline, shift: number): number => {
  if (line.clear === null || shift === 0) {
    return 0;
  }
  const start = line.clear.start + GLIDE_DELAY;
  return pixelTween(frame, [start, start + GLIDE_FRAMES], [0, -shift], GLIDE);
};

export const clearAt = (frame: number, line: Timeline) =>
  line.clear === null
    ? { turn: 0, fade: 0 }
    : {
        turn: ramp(frame, line.clear.start, line.clear.start + line.clear.frames, SWING),
        fade: ramp(frame, line.clear.start, line.clear.start + line.clear.frames * 0.75, SMOOTH),
      };

export type PillPose = {
  angle: number;
  offset: number;
  scale: number;
  opacity: number;
  age: number;
};

export const poseFor = (
  depth: number,
  props: PillFanProps,
  clear: { turn: number; fade: number },
): PillPose | null => {
  const { fan } = props;
  const side = fan.direction === 'up' ? -1 : 1;
  if (depth <= -1 || depth >= fan.trail + 1) {
    return null;
  }
  if (depth < 0) {
    return {
      angle: fan.angle + side * fan.swingIn * depth,
      offset: 0,
      scale: 1,
      opacity: FADE_IN(Math.min(1, (depth + 1) / 0.85)),
      age: 0,
    };
  }
  const spread = depth + (depth > 0 ? clear.turn * CLEAR_EXTRA : 0);
  const leaving = depth > fan.trail ? 1 - (depth - fan.trail) : 1;
  return {
    angle: fan.angle + side * fan.spread * spread,
    offset: spread,
    scale: 1 - fan.shrink * spread,
    opacity: leaving * (1 - clear.fade * Math.min(1, depth * 4)),
    age: depth,
  };
};
