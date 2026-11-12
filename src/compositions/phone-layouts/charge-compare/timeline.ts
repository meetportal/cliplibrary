import { Easing, interpolate } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';

const PLUG_FRAMES = 36;
const WAKE_FRAMES = 12;
const CHARGE_DELAY = 8;
const LEAVE_FRAMES = 16;
const TRAVEL_DELAY = 2;
const TRAVEL_FRAMES = 34;
const END_HOLD = 59;
const END_BUILD = 68;
const MIN_STEP = 1;

export const INTRO_FRAMES = 8;

export type Timeline = {
  plug: readonly [number, number];
  wake: readonly [number, number];
  charge: readonly [number, number];
  leave: readonly [number, number];
  travel: readonly [number, number];
  name: readonly [number, number];
  tagline: readonly [number, number];
  pill: readonly [number, number];
  typing: readonly [number, number];
  settled: number;
};

export const buildTimeline = (timing: ChargeCompareProps['timing'], duration: number): Timeline => {
  const plugEnd = timing.plugAt + PLUG_FRAMES;
  const chargeStart = plugEnd + CHARGE_DELAY;
  const latestLeave = duration - END_HOLD - END_BUILD;
  const leave = Math.min(chargeStart + timing.chargeFrames + timing.fullHold, latestLeave);
  const full = Math.min(chargeStart + timing.chargeFrames, leave);
  return {
    plug: [timing.plugAt, plugEnd],
    wake: [plugEnd, plugEnd + WAKE_FRAMES],
    charge: [chargeStart, Math.max(chargeStart + 1, full)],
    leave: [leave, leave + LEAVE_FRAMES],
    travel: [leave + TRAVEL_DELAY, leave + TRAVEL_DELAY + TRAVEL_FRAMES],
    name: [leave + 28, leave + 50],
    tagline: [leave + 36, leave + 54],
    pill: [leave + 40, leave + 60],
    typing: [leave + 50, leave + 68],
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

export const pixelTween = (
  frame: number,
  from: number,
  to: number,
  start: number,
  frames: number,
  easing: (t: number) => number,
): number => {
  const origin = Math.round(from);
  const distance = Math.abs(Math.round(to) - origin);
  if (distance === 0 || frame <= start) {
    return origin;
  }
  const direction = Math.sign(Math.round(to) - origin);
  const at = (step: number) => from + (to - from) * easing(progress(step, start, start + frames));
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(at(step) - at(step - 1));
    travelled = Math.min(distance, travelled + Math.max(MIN_STEP, Math.round(ideal)));
  }
  return origin + direction * travelled;
};

export const seatEase = (t: number) => 0.75 * Easing.out(Easing.cubic)(t) + 0.25 * t;

export const chargeEase = (t: number) => 0.8 * Easing.inOut(Easing.sin)(t) + 0.2 * t;
