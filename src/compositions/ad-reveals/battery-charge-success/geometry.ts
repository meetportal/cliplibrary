import { Easing } from 'remotion';
import type { BatteryChargeSuccessProps } from '@/schemas';
import { type CableKey, progress, type Timeline } from './timeline';

export type Point = { x: number; y: number };

export type Box = { x: number; y: number; width: number; height: number };

type PlugPose = { tip: Point; angle: number; opacity: number };

const WIDTH = 1080;
export const HEIGHT = 1920;
export const PLUG_LENGTH = 104;
export const PLUG_THICKNESS = 40;
const SIDE_ROWS = [0.49, 0.7] as const;
const OFFSCREEN = 140;

export const batteryBox = (battery: BatteryChargeSuccessProps['battery']): Box => ({
  x: Math.round(WIDTH / 2 - battery.width / 2),
  y: Math.round(battery.centerY - battery.height / 2),
  width: battery.width,
  height: battery.height,
});

type Rest = { socket: Point; angle: number; far: Point; farAngle: number };

type Dangle = { tip: Point; angle: number; far: Point; phase: number };

const restFor = (key: CableKey, box: Box): Rest => {
  const top = box.y + box.height * SIDE_ROWS[0];
  const low = box.y + box.height * SIDE_ROWS[1];
  const right = box.x + box.width;
  const rests: Record<CableKey, Rest> = {
    leftTop: {
      socket: { x: box.x, y: top },
      angle: 0,
      far: { x: -OFFSCREEN, y: top + 20 },
      farAngle: Math.PI,
    },
    leftBottom: {
      socket: { x: box.x, y: low },
      angle: 0,
      far: { x: -OFFSCREEN, y: low + 40 },
      farAngle: Math.PI,
    },
    rightTop: {
      socket: { x: right, y: top },
      angle: -Math.PI,
      far: { x: WIDTH + OFFSCREEN, y: top + 20 },
      farAngle: 0,
    },
    rightBottom: {
      socket: { x: right, y: low },
      angle: -Math.PI,
      far: { x: WIDTH + OFFSCREEN, y: low + 24 },
      farAngle: 0,
    },
    bottom: {
      socket: { x: WIDTH / 2, y: box.y + box.height },
      angle: -Math.PI / 2,
      far: { x: WIDTH / 2 - 20, y: HEIGHT + OFFSCREEN },
      farAngle: Math.PI / 2,
    },
  };
  return rests[key];
};

const DANGLES: Record<CableKey, Dangle> = {
  leftTop: {
    tip: { x: 160, y: 1300 },
    angle: -Math.PI / 2 + 0.36,
    far: { x: 90, y: HEIGHT + OFFSCREEN },
    phase: 0,
  },
  leftBottom: {
    tip: { x: 350, y: 1450 },
    angle: -Math.PI / 2 + 0.3,
    far: { x: 260, y: HEIGHT + OFFSCREEN },
    phase: 1.7,
  },
  bottom: {
    tip: { x: 556, y: 1262 },
    angle: -Math.PI / 2 - 0.16,
    far: { x: 520, y: HEIGHT + OFFSCREEN },
    phase: 3.1,
  },
  rightBottom: {
    tip: { x: 690, y: 1470 },
    angle: -Math.PI / 2 - 0.06,
    far: { x: 720, y: HEIGHT + OFFSCREEN },
    phase: 4.4,
  },
  rightTop: {
    tip: { x: 944, y: 1360 },
    angle: -Math.PI / 2 - 0.12,
    far: { x: 1010, y: HEIGHT + OFFSCREEN },
    phase: 5.6,
  },
};

const CABLE_ORDER: Record<CableKey, number> = {
  bottom: 0,
  leftTop: 1,
  rightTop: 2,
  leftBottom: 3,
  rightBottom: 4,
};

const PULL = 60;
const THROW = 1080;

const SWING = Easing.bezier(0.5, 0, 0.18, 1);
const RISE = Easing.bezier(0.3, 0, 0.3, 1);

const cubic = (a: Point, b: Point, c: Point, d: Point, t: number): Point => {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t] as const;
  return {
    x: w[0] * a.x + w[1] * b.x + w[2] * c.x + w[3] * d.x,
    y: w[0] * a.y + w[1] * b.y + w[2] * c.y + w[3] * d.y,
  };
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

const along = (point: Point, angle: number, distance: number): Point => ({
  x: point.x + Math.cos(angle) * distance,
  y: point.y + Math.sin(angle) * distance,
});

export type CableState = {
  pose: PlugPose;
  far: Point;
  farAngle: number;
  plugged: number;
  settled: number;
  released: number;
};

const farAlongEdge = (start: Point, rest: Rest, reach: number) => {
  const across = Math.abs(rest.far.x - start.x);
  const up = Math.abs(rest.far.y - start.y);
  const travelled = reach * (across + up);
  if (travelled <= across || up === 0) {
    const t = across === 0 ? 1 : Math.min(1, travelled / across);
    return { far: { x: lerp(start.x, rest.far.x, t), y: start.y }, farAngle: Math.PI / 2 };
  }
  const t = (travelled - across) / up;
  return {
    far: { x: rest.far.x, y: lerp(start.y, rest.far.y, t) },
    farAngle: lerp(Math.PI / 2, rest.farAngle, t),
  };
};

export const cableState = (
  key: CableKey,
  frame: number,
  line: Timeline,
  box: Box,
  sway: number,
): CableState => {
  const rest = restFor(key, box);
  const dangle = DANGLES[key];
  const swing = progress(frame, line.plugStart(key), line.plugEnd(key));
  const eased = key === 'bottom' ? RISE(swing) : SWING(swing);
  const time = frame / 30;
  const calm = (1 - eased) * sway;
  const swayTip = {
    x: dangle.tip.x + Math.sin(time * 1.3 + dangle.phase) * 16 * calm,
    y: dangle.tip.y + Math.cos(time * 1.1 + dangle.phase) * 8 * calm,
  };
  const swayAngle = dangle.angle + Math.sin(time * 1.2 + dangle.phase + 0.6) * 0.07 * calm;
  const span = Math.hypot(rest.socket.x - swayTip.x, rest.socket.y - swayTip.y);
  const lift = along(swayTip, swayAngle, Math.min(320, span * 0.4));
  const approach = along(rest.socket, rest.angle + Math.PI, Math.min(240, span * 0.35));
  const flight = cubic(swayTip, lift, approach, rest.socket, eased);
  const turn = SWING(Math.min(1, swing * 1.15));
  const angle = lerp(swayAngle, rest.angle, turn);
  const tip = flight;
  const releaseStart = line.release[0] + CABLE_ORDER[key] * 2;
  const released = progress(frame, releaseStart, releaseStart + line.release[1] - line.release[0]);
  const out =
    PULL * Easing.inOut(Easing.sin)(Math.min(1, released * 2.5)) +
    THROW * Easing.in(Easing.quad)(released);
  const away = { x: Math.cos(angle + Math.PI) * out, y: Math.sin(angle + Math.PI) * out };
  const reach = Easing.inOut(Easing.sin)(swing);
  const { far, farAngle } = farAlongEdge(dangle.far, rest, reach);
  return {
    pose: {
      tip: { x: tip.x + away.x, y: tip.y + away.y },
      angle,
      opacity: 1,
    },
    far: { x: far.x + away.x, y: far.y + away.y },
    farAngle,
    plugged: progress(frame, line.plugEnd(key), line.plugEnd(key) + 1),
    settled: reach,
    released,
  };
};

const plugTail = (pose: PlugPose): Point => along(pose.tip, pose.angle + Math.PI, PLUG_LENGTH);

const SAMPLES = 48;
const PLUGGED_SWAY = 0.42;

export const cablePoints = (
  state: CableState,
  frame: number,
  seed: number,
  sway: number,
): Point[] => {
  const tail = plugTail(state.pose);
  const tailAngle = state.pose.angle + Math.PI;
  const span = Math.hypot(state.far.x - tail.x, state.far.y - tail.y);
  const a = along(tail, tailAngle, Math.min(220, span * 0.35));
  const b = along(state.far, state.farAngle + Math.PI, Math.min(320, span * 0.45));
  const time = frame / 30;
  return Array.from({ length: SAMPLES + 1 }, (_, index) => {
    const t = index / SAMPLES;
    const point = cubic(tail, a, b, state.far, t);
    const ahead = cubic(tail, a, b, state.far, Math.min(1, t + 0.01));
    const behind = cubic(tail, a, b, state.far, Math.max(0, t - 0.01));
    const dx = ahead.x - behind.x;
    const dy = ahead.y - behind.y;
    const length = Math.hypot(dx, dy) || 1;
    const fade = Math.min(1, t / 0.18) * lerp(1, PLUGGED_SWAY, state.settled);
    const wiggle =
      (Math.sin(t * 9.5 + seed + time * 0.9 * sway) * 22 + Math.sin(t * 4.1 + seed * 2) * 14) *
      fade;
    return { x: point.x - (dy / length) * wiggle, y: point.y + (dx / length) * wiggle };
  });
};

export const pathOf = (points: readonly Point[]): string =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

export const pointAt = (points: readonly Point[], t: number): Point => {
  const scaled = Math.max(0, Math.min(1, t)) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaled));
  const start = points[index] ?? { x: 0, y: 0 };
  const end = points[index + 1] ?? start;
  return lerpPoint(start, end, scaled - index);
};
