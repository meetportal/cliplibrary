import { Easing, interpolate, spring } from 'remotion';
import type { ChevronMarkAssembleProps } from '@/schemas';

export const BEATS = {
  flipToDark: 50,
  dropSecond: 52,
  split: 106,
  fallFirst: 146,
  fallSecond: 154,
  flipToLight: 156,
  endStart: 192,
  lockup: 196,
  plate: 216,
  name: 226,
} as const;

const ROOT2 = Math.SQRT2;
const ROCK_PERIOD = 64;

type SpringConfig = { damping: number; stiffness: number; mass?: number };

const DROP: SpringConfig = { damping: 15, stiffness: 110 };
const FLOAT: SpringConfig = { damping: 20, stiffness: 36 };
const LOCK: SpringConfig = { damping: 15, stiffness: 150 };
const SPIN: SpringConfig = { damping: 10, stiffness: 70 };
const SPLIT: SpringConfig = { damping: 12, stiffness: 9 };

const sp = (frame: number, start: number, fps: number, config: SpringConfig): number =>
  frame < start ? 0 : spring({ frame: frame - start, fps, config: { mass: 1, ...config } });

const ease = (frame: number, range: [number, number], easing = Easing.bezier(0.65, 0, 0.35, 1)) =>
  interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export type Pose = { x: number; y: number; angle: number };

const chain = (frame: number, fps: number, keys: readonly [number, number, SpringConfig][]) => {
  let value = 0;
  let previous = 0;
  for (const [start, target, config] of keys) {
    value += (target - previous) * sp(frame, start, fps, config);
    previous = target;
  }
  return value;
};

export type Poses = {
  first: Pose;
  second: Pose;
  secondVisible: boolean;
  chevron: { arms: number; scale: number; opacity: number };
  keystone: number;
  piece: number;
  cell: number;
};

export const markPoses = (
  frame: number,
  fps: number,
  mark: ChevronMarkAssembleProps['mark'],
  top: number,
  chevronAt: number,
): Poses => {
  const s = mark.cell;
  const d = (s * mark.pieceScale) / 100;
  const stack = ROOT2 * d;
  const spin = 180 * mark.tumble;
  const alive = 1 - sp(frame, BEATS.fallFirst, fps, LOCK);
  const phase = (2 * Math.PI * frame) / ROCK_PERIOD;
  const bob = Math.sin((2 * Math.PI * frame) / 130 + 0.4) * 0.35 * s * alive;
  const drift = Math.cos(phase) * 0.22 * s * alive;
  const rock = Math.sin(phase) * 30 * alive;
  const stacked =
    Math.min(1, sp(frame, BEATS.dropSecond, fps, DROP)) *
    (1 - Math.min(1, sp(frame, BEATS.split, fps, SPLIT)));
  const turn = (rock * Math.PI) / 180;
  const dip =
    0.16 * s * Math.sin(Math.PI * ease(frame, [BEATS.dropSecond + 14, BEATS.dropSecond + 30]));
  const restY = 0.5 * s;
  const first: Pose = {
    x:
      -0.55 * s +
      chain(frame, fps, [
        [0, 0.55 * s, FLOAT],
        [BEATS.split, 0.1 * s, SPLIT],
        [BEATS.fallFirst, 0.55 * s, LOCK],
      ]) +
      drift,
    y:
      top +
      chain(frame, fps, [
        [0, restY - top, DROP],
        [BEATS.split, -1.1 * s - top, SPLIT],
        [BEATS.fallFirst, -top, LOCK],
      ]) +
      bob +
      dip,
    angle:
      45 -
      spin -
      25 +
      chain(frame, fps, [
        [0, spin + 25, SPIN],
        [BEATS.split, spin + 25 + 90, SPLIT],
        [BEATS.fallFirst, spin + 25 + 180, SPIN],
      ]) +
      -180 * ease(frame, [12, BEATS.dropSecond + 10], Easing.inOut(Easing.sin)) +
      rock,
  };
  const secondTop = top - stack;
  const second: Pose = {
    x:
      0.35 * s +
      chain(frame, fps, [
        [BEATS.dropSecond, -0.35 * s, FLOAT],
        [BEATS.split, 0.3 * s, SPLIT],
        [BEATS.fallSecond, -0.35 * s, LOCK],
      ]) +
      drift +
      stacked * stack * Math.sin(turn),
    y:
      secondTop +
      chain(frame, fps, [
        [BEATS.dropSecond, restY - stack - secondTop, DROP],
        [BEATS.split, -3.1 * s - secondTop, SPLIT],
        [BEATS.fallSecond, -stack - secondTop, LOCK],
      ]) +
      bob +
      dip * 0.4 +
      stacked * stack * (1 - Math.cos(turn)),
    angle:
      45 +
      spin +
      30 -
      chain(frame, fps, [
        [BEATS.dropSecond, spin + 30, SPIN],
        [BEATS.split, spin + 30 + 180, SPLIT],
        [BEATS.fallSecond, spin + 30 + 270, SPIN],
      ]) +
      rock,
  };
  const grow = ease(frame, [chevronAt, chevronAt + 9], Easing.bezier(0.25, 0.8, 0.35, 1));
  return {
    first,
    second,
    secondVisible: frame >= BEATS.dropSecond,
    chevron: {
      arms: 1 + 2 * ease(frame, [chevronAt + 2, chevronAt + 15]),
      scale: 0.45 + 0.55 * grow,
      opacity: grow,
    },
    keystone: mark.keystone ? ease(frame, [BEATS.fallSecond + 16, BEATS.fallSecond + 30]) : 0,
    piece: d,
    cell: s,
  };
};

export const lockupProgress = (frame: number): number =>
  ease(frame, [BEATS.lockup, BEATS.lockup + 32]);

export const lockPulse = (frame: number): number =>
  1 + 0.04 * Math.sin(Math.PI * ease(frame, [BEATS.fallSecond + 14, BEATS.endStart + 6]));

export const unfoldProgress = (frame: number): number =>
  ease(frame, [BEATS.plate, BEATS.plate + 30]);

export const revealProgress = (frame: number, start: number, frames = 26): number =>
  ease(frame, [start, start + frames], Easing.bezier(0.25, 0.8, 0.35, 1));
