import { Easing } from 'remotion';
import type { CirclePopProps } from '@/schemas';
import { lerp, ramp } from '../../kit/motion';

const START_SCALE = 0.5;
const OVERSHOOT = 1.08;
const PUSH = 0.08;
const SETTLED_HOLD = 46;
const MIN_EXIT = 8;
export const FLOOD_LOBE_GROWTH = 0.8;
export const RISE_FRAMES = 12;

const inOut = Easing.inOut(Easing.cubic);
const swell = Easing.inOut(Easing.sin);
const popUp = Easing.bezier(0.4, 0, 0.3, 1);
const land = Easing.bezier(0.3, 0, 0.2, 1);
const ring = Easing.out(Easing.cubic);

export type CirclePopBeat = {
  pop: number;
  flood: number;
  grow: number;
  echo: number;
  wobble: number;
  phase: number;
  ripple: number;
  lineIn: number;
  drawIn: number;
  squiggle: number;
  push: number;
  exit: number;
};

export const circlePopTimes = (timing: CirclePopProps['timing'], duration: number) => {
  const popPeak = Math.round(timing.popFrames * 0.55);
  const floodAt = Math.max(timing.floodAt, timing.popFrames + 14);
  const floodEnd = floodAt + timing.floodFrames;
  const lineAt = floodEnd + 2;
  const lineDone = lineAt + 20;
  const exitAt = Math.min(
    duration - MIN_EXIT,
    Math.max(lineDone + SETTLED_HOLD, duration - timing.collapseFrames),
  );
  return { popPeak, floodAt, floodEnd, lineAt, lineDone, exitAt };
};

export const circlePopBeat = (
  frame: number,
  props: CirclePopProps,
  duration: number,
): CirclePopBeat => {
  const { timing, circle } = props;
  const times = circlePopTimes(timing, duration);
  return {
    pop:
      lerp(START_SCALE, OVERSHOOT, ramp(frame, 0, times.popPeak, popUp)) +
      (1 - OVERSHOOT) * ramp(frame, times.popPeak, timing.popFrames, swell),
    flood: ramp(frame, times.floodAt, times.floodEnd, swell),
    grow: ramp(frame, times.floodAt, times.floodEnd + 12, land),
    echo: ramp(frame, times.lineAt - 2, times.lineDone, inOut),
    wobble: ramp(frame, timing.popFrames - 6, timing.popFrames + 10, inOut),
    phase: frame * 0.11 * circle.wobbleSpeed,
    ripple: ramp(frame, 2, 30, ring),
    lineIn: ramp(frame, times.lineAt, times.lineAt + RISE_FRAMES, Easing.inOut(Easing.quad)),
    drawIn: ramp(frame, times.lineAt + 2, times.lineDone - 2, inOut),
    squiggle: frame * 0.27,
    push: 1 + PUSH * ramp(frame, times.floodAt, duration - 1, Easing.in(Easing.sin)),
    exit: ramp(frame, times.exitAt, duration - 1, inOut),
  };
};

const logMix = (from: number, to: number, t: number) =>
  Math.exp(lerp(Math.log(from), Math.log(to), t));

export const circlePopShape = (
  beat: CirclePopBeat,
  base: number,
  cover: number,
  small: number,
) => ({
  radius: logMix(base, cover, beat.flood) * beat.pop,
  textScale: logMix(small, 1, beat.grow) * beat.pop,
  lobeGrowth: beat.flood,
});
