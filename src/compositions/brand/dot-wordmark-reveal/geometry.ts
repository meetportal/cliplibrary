import { Easing } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { clamp01, lerp, ramp } from '../../kit/motion';
import type { Box, LineLayout, Lockup } from './layout';
import type { Palette } from './palette';
import { arc, irisProgress, type Point, type Schedule } from './timeline';

export type Stage = {
  schedule: Schedule;
  lockup: Lockup;
  line: LineLayout;
  palette: Palette;
  targets: (boolean | null)[];
  pill: { w: number; h: number };
  caret: number;
  center: Point;
  coverRadius: number;
  frameWidth: number;
  frameHeight: number;
};

export type Blob = Box & { rotation: number; color: string };

const inOut = Easing.inOut(Easing.cubic);
const IRIS_SOFTNESS = 36;
const WRITE = Easing.out(Easing.sin);

export const landPoint = (stage: Stage, at: number): Point => {
  const count = stage.line.words.length;
  const word = stage.line.words[Math.min(at, count - 1)];
  if (word === undefined) {
    return stage.center;
  }
  if (at >= count) {
    const left = (at - count) % 2 === 0;
    const reach = stage.pill.h;
    return {
      x: left ? word.left - reach : word.left + word.width + reach,
      y: word.top + stage.line.size * 0.16 - stage.pill.h / 2,
    };
  }
  const below = stage.line.words.find((one) => one.row > 0);
  if (below !== undefined) {
    const first = stage.line.words[0]?.top ?? word.top;
    return { x: word.cx, y: (first + stage.line.lineHeight + below.top) / 2 };
  }
  return { x: word.cx, y: word.top + stage.line.size * 0.16 - stage.pill.h / 2 };
};

export const irisRadius = (stage: Stage, at: number) => {
  const point = landPoint(stage, at);
  const far = Math.max(
    ...[
      [0, 0],
      [stage.frameWidth, 0],
      [0, stage.frameHeight],
      [stage.frameWidth, stage.frameHeight],
    ].map(([x = 0, y = 0]) => Math.hypot(x - point.x, y - point.y)),
  );
  return far * 1.01;
};

export const primaryAmount = (stage: Stage, frame: number, point: Point): number => {
  if (frame >= stage.schedule.dropStart) {
    return 0;
  }
  let amount = 0;
  stage.targets.forEach((target, at) => {
    if (target === null) {
      return;
    }
    const land = stage.schedule.lands[at] ?? 0;
    const radius = irisProgress(frame, land) * irisRadius(stage, at);
    const from = landPoint(stage, at);
    const reach = clamp01(
      (radius - Math.hypot(point.x - from.x, point.y - from.y)) / IRIS_SOFTNESS + 0.5,
    );
    const covered = radius <= 0 ? 0 : reach;
    amount = lerp(amount, target ? 1 : 0, covered);
  });
  return amount;
};

const boxLerp = (from: Box, to: Box, t: number): Box => ({
  cx: lerp(from.cx, to.cx, t),
  cy: lerp(from.cy, to.cy, t),
  w: lerp(from.w, to.w, t),
  h: lerp(from.h, to.h, t),
  r: lerp(from.r, to.r, t),
});

const pillBox = (stage: Stage, point: Point): Box => ({
  cx: point.x,
  cy: point.y,
  w: stage.pill.w,
  h: stage.pill.h,
  r: stage.pill.w / 2,
});

const pillColor = (stage: Stage, frame: number, point: Point) =>
  mixLab(stage.palette.pill, stage.palette.pillOnFill, primaryAmount(stage, frame, point));

const hopHeight = (from: Point, to: Point) => 70 + Math.abs(to.x - from.x) * 0.15;

const lowHop = (stage: Stage) => Math.round(stage.line.size * 0.15);

const rowOf = (stage: Stage, at: number) => stage.line.words[at]?.row ?? 0;

const twoRows = (stage: Stage) => stage.line.words.some((word) => word.row > 0);

const hopPoint = (stage: Stage, at: number, from: Point, to: Point, t: number): Point =>
  at === 0 || !twoRows(stage)
    ? arc(from, to, t, hopHeight(from, to))
    : arc(from, to, t, lowHop(stage));

const BOB_HOP = 12;

const bobHops = (stage: Stage) =>
  Math.max(1, Math.round((stage.schedule.dropStart - stage.schedule.bobStart) / BOB_HOP));

const bobPhase = (stage: Stage, frame: number) => {
  const hops = bobHops(stage);
  const span = stage.schedule.dropStart - stage.schedule.bobStart;
  const base = Math.floor(span / hops);
  const extra = span % hops;
  const since = Math.max(0, frame - stage.schedule.bobStart);
  let start = 0;
  for (let index = 0; index < hops; index++) {
    const length = base + (index < extra ? 1 : 0);
    if (since < start + length || index === hops - 1) {
      return { index, t: clamp01((since - start) / length) };
    }
    start += length;
  }
  return { index: hops - 1, t: 1 };
};

const flight = (stage: Stage, frame: number): Blob | null => {
  const { schedule } = stage;
  const tileCenter = { x: stage.lockup.tile.cx, y: stage.lockup.tile.cy };
  const points = [tileCenter, ...schedule.lands.map((_, at) => landPoint(stage, at))];
  const times = [schedule.collapseEnd, ...schedule.lands];
  let rotation = 0;
  for (let at = 1; at < points.length; at++) {
    const from = points[at - 1] ?? tileCenter;
    const to = points[at] ?? tileCenter;
    const start = times[at - 1] ?? 0;
    const end = times[at] ?? 0;
    const sign = to.x >= from.x ? 1 : -1;
    if (frame < end) {
      const raw = (frame - start) / Math.max(1, end - start);
      const t = at === 1 ? Easing.inOut(Easing.sin)(clamp01(raw)) : raw;
      const point = hopPoint(stage, at - 1, from, to, t);
      return {
        ...pillBox(stage, point),
        rotation: rotation + sign * 180 * clamp01(t),
        color: pillColor(stage, frame, point),
      };
    }
    rotation += sign * 180;
  }
  const rest = points.at(-1) ?? tileCenter;
  const { index, t } = bobPhase(stage, frame);
  const lastRow = rowOf(stage, schedule.lands.length - 1);
  const point = arc(rest, rest, t, lastRow === 0 ? 70 : lowHop(stage));
  return {
    ...pillBox(stage, point),
    rotation: rotation + 180 * (index + t),
    color: pillColor(stage, frame, point),
  };
};

const restingRotation = (stage: Stage) => {
  const signs = stage.schedule.lands.map((_, at) => {
    const from = at === 0 ? stage.lockup.tile.cx : landPoint(stage, at - 1).x;
    return landPoint(stage, at).x >= from ? 1 : -1;
  });
  return signs.reduce<number>((sum, sign) => sum + sign * 180, 180 * bobHops(stage));
};

export const fillAt = (stage: Stage, frame: number): Blob => {
  const { schedule, lockup, palette, center } = stage;
  const tile = lockup.tile;
  const cover: Box = {
    cx: center.x,
    cy: center.y,
    w: stage.coverRadius * 2,
    h: stage.coverRadius * 2,
    r: stage.coverRadius,
  };
  if (frame <= schedule.collapseStart) {
    return { ...tile, rotation: 0, color: palette.primary };
  }
  if (frame < schedule.collapseEnd) {
    const t = ramp(frame, schedule.collapseStart, schedule.collapseEnd, Easing.inOut(Easing.sin));
    const pill = pillBox(stage, { x: tile.cx, y: tile.cy });
    return {
      ...boxLerp(tile, pill, t),
      rotation: 0,
      color: mixLab(palette.primary, palette.pill, t),
    };
  }
  if (frame < schedule.dropStart) {
    return flight(stage, frame) ?? { ...tile, rotation: 0, color: palette.primary };
  }
  const drop = schedule.dropEnd - schedule.dropStart;
  const dot = stage.pill.w * 2.6;
  if (frame < schedule.growStart) {
    const t = clamp01((frame - schedule.dropStart) / drop);
    const last = landPoint(stage, schedule.lands.length - 1);
    const point = arc(last, center, t, rowOf(stage, schedule.lands.length - 1) === 0 ? 60 : 6);
    const shape = inOut(t);
    const swell = Easing.in(Easing.quad)(t);
    const turn = restingRotation(stage);
    return {
      cx: point.x,
      cy: point.y,
      w: lerp(stage.pill.w, dot, swell),
      h: lerp(stage.pill.h, dot, swell),
      r: lerp(stage.pill.w / 2, dot / 2, swell),
      rotation: lerp(turn, Math.round(turn / 360) * 360, shape) % 360,
      color: mixLab(palette.pill, palette.primary, shape),
    };
  }
  if (frame < schedule.foldStart) {
    const t = ramp(frame, schedule.growStart, schedule.growEnd, Easing.linear);
    const size = lerp(dot, cover.w, 0.12 * t + 0.88 * t * t);
    return {
      cx: center.x,
      cy: center.y,
      w: size,
      h: size,
      r: size / 2,
      rotation: 0,
      color: palette.primary,
    };
  }
  const t = ramp(frame, schedule.foldStart, schedule.foldEnd, inOut);
  return { ...boxLerp(cover, tile, t), rotation: 0, color: palette.primary };
};

export const caretAt = (stage: Stage, frame: number, x0: number, x1: number, y: number) => {
  const { schedule } = stage;
  if (frame < schedule.caretIn || frame >= schedule.caretHopStart + 12) {
    return null;
  }
  const scale = ramp(frame, schedule.caretIn, schedule.caretIn + 3);
  if (frame < schedule.writeStart) {
    const frames = schedule.writeStart - schedule.caretIn;
    const t = clamp01((frame - schedule.caretIn) / frames);
    const speed = ((x1 - x0) * Math.PI) / 2 / (schedule.writeEnd - schedule.writeStart);
    const run = (speed * frames) / 2;
    return { x: x0 - run + run * t * t, y, scale };
  }
  if (frame < schedule.writeEnd) {
    const t = ramp(frame, schedule.writeStart, schedule.writeEnd, WRITE);
    return { x: lerp(x0, x1, t), y, scale };
  }
  const fade = ramp(frame, schedule.caretHopStart, schedule.caretHopStart + 12, inOut);
  return { x: x1, y, scale: 1 - fade };
};

export const revealFrames = (
  stage: Stage,
  x0: number,
  x1: number,
  centers: readonly number[],
): number[] => {
  const { schedule } = stage;
  return centers.map((cx) => {
    for (let frame = schedule.writeStart; frame <= schedule.writeEnd; frame++) {
      const t = ramp(frame, schedule.writeStart, schedule.writeEnd, WRITE);
      if (lerp(x0, x1, t) >= cx) {
        return frame - 2;
      }
    }
    return schedule.writeEnd - 2;
  });
};
