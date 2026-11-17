import { Easing, interpolate } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';

const PLUG_FRAMES = 48;
const WAKE_FRAMES = 20;
const WAKE_LEAD = 8;
const CHARGE_LEAD = 8;
const IRIS_DELAY = 8;
const IRIS_FRAMES = 20;
const TRAVEL_FRAMES = 36;
const END_HOLD = 46;
const END_BUILD = 54;

export type Timeline = {
  plug: readonly [number, number];
  wake: readonly [number, number];
  charge: readonly [number, number];
  iris: readonly [number, number];
  travel: readonly [number, number];
  name: readonly [number, number];
  tagline: readonly [number, number];
  pill: readonly [number, number];
  typing: readonly [number, number];
  settled: number;
};

export const buildTimeline = (timing: ChargeCompareProps['timing'], duration: number): Timeline => {
  const plugEnd = timing.plugAt + PLUG_FRAMES;
  const chargeStart = plugEnd - CHARGE_LEAD;
  const latestLeave = duration - END_HOLD - END_BUILD;
  const leave = Math.min(chargeStart + timing.chargeFrames + timing.fullHold, latestLeave);
  const full = Math.min(chargeStart + timing.chargeFrames, leave);
  return {
    plug: [timing.plugAt, plugEnd],
    wake: [plugEnd - WAKE_LEAD, plugEnd - WAKE_LEAD + WAKE_FRAMES],
    charge: [chargeStart, Math.max(chargeStart + 1, full)],
    iris: [leave + IRIS_DELAY, leave + IRIS_DELAY + IRIS_FRAMES],
    travel: [leave, leave + TRAVEL_FRAMES],
    name: [leave + 19, leave + 39],
    tagline: [leave + 24, leave + 43],
    pill: [leave + 26, leave + 41],
    typing: [leave + 39, leave + END_BUILD],
    settled: leave + END_BUILD,
  };
};

export const progress = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = Easing.linear,
) => {
  if (to <= from) {
    return frame >= from ? 1 : 0;
  }
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

export const seatEase = Easing.inOut(Easing.sin);
