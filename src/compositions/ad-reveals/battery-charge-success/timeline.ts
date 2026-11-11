import { Easing, interpolate } from 'remotion';
import type { BatteryChargeSuccessProps } from '@/schemas';

export const CABLE_KEYS = ['leftTop', 'leftBottom', 'bottom', 'rightBottom', 'rightTop'] as const;

export type CableKey = (typeof CABLE_KEYS)[number];

const ARRIVAL_OFFSET: Record<CableKey, number> = {
  leftTop: 0,
  rightTop: 3,
  leftBottom: 6,
  rightBottom: 8,
  bottom: 4,
};

const TURN_DELAY = 12;
const TURN_FRAMES = 24;
const CHARGE_DELAY = 22;
const RELEASE_FRAMES = 24;
const LOCKUP_DELAY = 22;
const LOCKUP_STAGGER = 6;
const LOCKUP_FRAMES = 28;
const END_HOLD = 6;
const MIN_STEP = 2;

export type Timeline = {
  plugStart: (key: CableKey) => number;
  plugEnd: (key: CableKey) => number;
  landed: number;
  turn: readonly [number, number];
  charge: readonly [number, number];
  full: number;
  release: readonly [number, number];
  lockup: readonly [number, number, number];
  lockupFrames: number;
};

export const buildTimeline = (
  timing: BatteryChargeSuccessProps['timing'],
  duration: number,
): Timeline => {
  const plugEnd = (key: CableKey) => timing.plugAt + timing.plugFrames + ARRIVAL_OFFSET[key];
  const landed = Math.max(...CABLE_KEYS.map(plugEnd));
  const chargeStart = landed + CHARGE_DELAY;
  const full = chargeStart + timing.chargeFrames;
  const latest = duration - END_HOLD - LOCKUP_FRAMES - LOCKUP_STAGGER * 2;
  const releaseStart = Math.max(full, Math.min(full + timing.fullHold, latest - LOCKUP_DELAY));
  const lockupStart = releaseStart + LOCKUP_DELAY;
  return {
    plugStart: (key) => plugEnd(key) - timing.plugFrames,
    plugEnd,
    landed,
    turn: [landed + TURN_DELAY, landed + TURN_DELAY + TURN_FRAMES],
    charge: [chargeStart, full],
    full,
    release: [releaseStart, releaseStart + RELEASE_FRAMES],
    lockup: [lockupStart, lockupStart + LOCKUP_STAGGER, lockupStart + LOCKUP_STAGGER * 2],
    lockupFrames: LOCKUP_FRAMES,
  };
};

export const progress = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = Easing.linear,
) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const chargeLevel = (frame: number, line: Timeline) =>
  progress(frame, line.charge[0], line.charge[1], Easing.bezier(0.42, 0, 0.3, 1));

export const toneAmount = (frame: number, line: Timeline) =>
  progress(frame, line.turn[0], line.turn[1], Easing.inOut(Easing.sin));

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
