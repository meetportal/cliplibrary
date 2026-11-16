import { Easing, interpolate } from 'remotion';
import type { BatteryChargeSuccessProps } from '@/schemas';

export const CABLE_KEYS = ['leftTop', 'leftBottom', 'bottom', 'rightBottom', 'rightTop'] as const;

export type CableKey = (typeof CABLE_KEYS)[number];

const ARRIVAL_OFFSET: Record<CableKey, number> = {
  leftTop: 0,
  rightTop: 3,
  leftBottom: 5,
  rightBottom: 6,
  bottom: 4,
};

const TURN_DELAY = 12;
const TURN_FRAMES = 24;
const CHARGE_DELAY = 18;
const RELEASE_FRAMES = 24;
const LOCKUP_DELAY = 16;
const LOCKUP_STAGGER = 6;
const LOCKUP_FRAMES = 12;
const SETTLED_HOLD = 46;
const EXIT_FRAMES = 40;
const MIN_EXIT_FRAMES = 26;
const RETURN_ORDER: Record<CableKey, number> = {
  bottom: 0,
  leftTop: 2,
  rightTop: 3,
  leftBottom: 5,
  rightBottom: 6,
};

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
  exit: readonly [number, number];
  loop: number;
};

export const buildTimeline = (
  timing: BatteryChargeSuccessProps['timing'],
  duration: number,
): Timeline => {
  const plugEnd = (key: CableKey) => timing.plugAt + timing.plugFrames + ARRIVAL_OFFSET[key];
  const landed = Math.max(...CABLE_KEYS.map(plugEnd));
  const chargeStart = landed + CHARGE_DELAY;
  const full = chargeStart + timing.chargeFrames;
  const chain = LOCKUP_DELAY + LOCKUP_STAGGER * 2 + LOCKUP_FRAMES;
  const latest = duration - EXIT_FRAMES - SETTLED_HOLD - chain;
  const releaseStart = Math.max(full, Math.min(full + timing.fullHold, latest));
  const lockupStart = releaseStart + LOCKUP_DELAY;
  const settled = releaseStart + chain;
  const exitStart = Math.min(
    duration - MIN_EXIT_FRAMES,
    Math.max(duration - EXIT_FRAMES, settled + SETTLED_HOLD),
  );
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
    exit: [exitStart, duration],
    loop: duration,
  };
};

export const exitPhase = (frame: number, line: Timeline, from: number, to: number) => {
  const length = line.exit[1] - line.exit[0];
  return progress(
    frame,
    line.exit[0] + length * from,
    line.exit[0] + length * to,
    Easing.inOut(Easing.sin),
  );
};

export const returnWindow = (key: CableKey, line: Timeline): readonly [number, number] => {
  const length = line.exit[1] - line.exit[0];
  const start = line.exit[0] + length * (0.25 + RETURN_ORDER[key] * 0.025);
  return [start, line.exit[1] - length * (0.125 - RETURN_ORDER[key] * 0.025)];
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
  progress(frame, line.charge[0], line.charge[1], Easing.bezier(0.7, 0, 0.35, 1)) *
  (1 - exitPhase(frame, line, 0.1, 0.85));

export const toneAmount = (frame: number, line: Timeline) =>
  progress(frame, line.turn[0], line.turn[1], Easing.inOut(Easing.sin)) *
  (1 - exitPhase(frame, line, 0.4, 0.9));

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
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.round(distance * easing(progress(step, start, start + frames)));
    travelled = Math.min(distance, Math.max(travelled + 1, ideal));
  }
  return origin + direction * travelled;
};
