import { Easing, interpolate } from 'remotion';
import type { CirclePopProps } from '@/schemas';
import { clamp01, lerp, ramp } from '../../kit/motion';

const START_SCALE = 0.5;
export const FLOOD_LOBE_GROWTH = 0.8;

const inOut = Easing.inOut(Easing.cubic);
const popOut = Easing.out(Easing.back(1.7));

export type CirclePopBeat = {
  pop: number;
  flood: number;
  grow: number;
  collapse: number;
  echo: number;
  wobble: number;
  phase: number;
  ripple: number;
  lineIn: number;
  lineOut: number;
  drawIn: number;
  squiggle: number;
};

export const circlePopTimes = (timing: CirclePopProps['timing'], duration: number) => {
  const floodAt = Math.max(timing.floodAt, timing.popFrames + 14);
  const floodEnd = floodAt + timing.floodFrames;
  const lineAt = floodEnd + 4;
  const lineDone = lineAt + 18;
  const collapseAt = Math.max(lineDone + 30, duration - timing.collapseFrames);
  return { floodAt, floodEnd, collapseAt, lineAt, lineDone };
};

export const circlePopBeat = (
  frame: number,
  props: CirclePopProps,
  duration: number,
): CirclePopBeat => {
  const { timing, circle } = props;
  const times = circlePopTimes(timing, duration);
  const collapse = ramp(frame, times.collapseAt, duration, inOut);
  return {
    pop: interpolate(frame, [0, timing.popFrames], [START_SCALE, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: popOut,
    }),
    flood: ramp(frame, times.floodAt, times.floodEnd, Easing.in(Easing.quad)),
    grow: ramp(frame, times.floodAt, times.floodEnd + 4, inOut),
    collapse,
    echo:
      ramp(frame, times.lineAt - 2, times.lineDone + 6, inOut) *
      (1 - ramp(frame, times.collapseAt - 10, times.collapseAt + 6, inOut)),
    wobble: Math.min(
      ramp(frame, timing.popFrames - 4, timing.popFrames + 10, inOut),
      1 - ramp(collapse, 0.55, 1, (t) => t),
    ),
    phase: frame * 0.11 * circle.wobbleSpeed,
    ripple: clamp01((frame - 2) / 24),
    lineIn: ramp(frame, times.lineAt, times.lineDone),
    drawIn: ramp(frame, times.lineAt + 2, times.lineDone + 8, inOut),
    lineOut: ramp(frame, times.collapseAt - 10, times.collapseAt + 1, Easing.in(Easing.cubic)),
    squiggle: frame * 0.32,
  };
};

const logMix = (from: number, to: number, t: number) =>
  Math.exp(lerp(Math.log(from), Math.log(to), t));

const rootMix = (from: number, to: number, t: number) =>
  lerp(Math.sqrt(from), Math.sqrt(to), t) ** 2;

export const circlePopShape = (beat: CirclePopBeat, base: number, cover: number, small: number) => {
  if (beat.collapse > 0) {
    const radius = rootMix(cover, base * START_SCALE, beat.collapse);
    const grownBy = clamp01(Math.log(radius / base) / Math.log(cover / base));
    const textScale = radius >= base ? logMix(small, 1, grownBy) : (small * radius) / base;
    return { radius, textScale, lobeGrowth: grownBy };
  }
  return {
    radius: logMix(base, cover, beat.flood) * beat.pop,
    textScale: logMix(small, 1, beat.grow) * beat.pop,
    lobeGrowth: beat.flood,
  };
};
