import { Easing } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { clamp01, lerp, ramp } from '../../kit/motion';
import type { Box, LineLayout, Lockup } from './layout';
import type { Palette } from './palette';
import { breathAt, rollAt } from './roll';
import { arcY, irisProgress, type Point, type Schedule, smoothThrough } from './timeline';

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

export type Blob = Box & { rotation: number; color: string; shift: number; scale: number };

const inOut = Easing.inOut(Easing.cubic);
const IRIS_SOFTNESS = 36;
const WRITE = Easing.out(Easing.sin);
const SQUASH = 0.16;
const SQUASH_WIDTH = 1.4;

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
  if (frame >= stage.schedule.flipsEnd) {
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

const pillColor = (stage: Stage, frame: number, point: Point) =>
  mixLab(stage.palette.pill, stage.palette.pillOnFill, primaryAmount(stage, frame, point));

const hopHeight = (from: Point, to: Point) => 70 + Math.abs(to.x - from.x) * 0.15;

const bobHeight = (stage: Stage) => Math.round(stage.line.size * 0.6);

const BOB_SQUASH = 0.5;
const BOB_RISE = 1.5;

const chainOf = (stage: Stage) => {
  const { schedule, lockup } = stage;
  const last = landPoint(stage, schedule.lands.length - 1);
  const points = [
    { x: lockup.tile.cx, y: lockup.tile.cy },
    ...schedule.lands.map((_, at) => landPoint(stage, at)),
    ...schedule.bobs.map(() => last),
    stage.center,
  ];
  const times = [schedule.chainStart, ...schedule.lands, ...schedule.bobs, schedule.dropEnd];
  return { points, times, firstBob: schedule.lands.length };
};

const flight = (stage: Stage, frame: number) => {
  const { points, times, firstBob } = chainOf(stage);
  const indices = points.map((_, at) => at);
  const last = points.length - 2;
  const progress = smoothThrough(times, indices, frame);
  const segment = Math.min(last, Math.floor(progress));
  const k = progress - segment;
  const from = points[segment] ?? stage.center;
  const to = points[segment + 1] ?? stage.center;
  const bobbing = segment >= firstBob && segment < last;
  const x = smoothThrough(
    times,
    points.map((point) => point.x),
    frame,
  );
  const base = bobHeight(stage);
  const height = bobbing
    ? base * BOB_RISE ** (segment - firstBob)
    : segment === last
      ? Math.min(hopHeight(from, to), base * BOB_RISE ** (last - firstBob))
      : hopHeight(from, to);
  const y = arcY(from.y, to.y, k, height);
  let rotation = 0;
  for (let at = 0; at <= segment; at++) {
    const a = points[at] ?? stage.center;
    const b = points[at + 1] ?? stage.center;
    const turns = at >= firstBob && at < last ? 0 : b.x >= a.x ? 1 : -1;
    rotation += turns * 180 * (at === segment ? k : 1);
  }
  const squash = times
    .slice(1, -1)
    .reduce(
      (most, land, at) =>
        Math.max(
          most,
          (at + 1 > firstBob ? BOB_SQUASH : 1) * Math.exp(-(((frame - land) / SQUASH_WIDTH) ** 2)),
        ),
      0,
    );
  return { point: { x, y }, rotation, squash: SQUASH * squash };
};

const growSize = (stage: Stage, frame: number) =>
  ramp(frame, stage.schedule.growStart, stage.schedule.growEnd, Easing.inOut(Easing.sin));

const tileBlob = (stage: Stage, frame: number): Blob => {
  const { lockup, schedule, palette, frameWidth } = stage;
  const roll = rollAt(lockup.tile, frameWidth, schedule, frame);
  const breath = breathAt(schedule, frame);
  const tile = lockup.tile;
  return {
    cx: tile.cx + roll.dx,
    cy: tile.cy,
    w: tile.w,
    h: tile.h,
    r: tile.r,
    rotation: roll.angle,
    color: palette.primary,
    shift: roll.dx,
    scale: breath,
  };
};

const travelBlob = (stage: Stage, frame: number): Blob => {
  const { schedule, lockup, palette, pill } = stage;
  const tile = lockup.tile;
  const roll = rollAt(tile, stage.frameWidth, schedule, frame);
  const collapse = ramp(
    frame,
    schedule.collapseStart,
    schedule.collapseEnd,
    Easing.inOut(Easing.sin),
  );
  const moving = frame >= schedule.chainStart;
  const motion = moving
    ? flight(stage, frame)
    : { point: { x: tile.cx + roll.dx, y: tile.cy }, rotation: roll.angle, squash: 0 };
  const settled = frame >= schedule.dropEnd;
  const point = settled ? stage.center : motion.point;
  const dot = stage.coverRadius * 2;
  const grow = growSize(stage, frame);
  const baseW = lerp(tile.w, pill.w, collapse) * (1 + motion.squash * 0.6);
  const baseH = lerp(tile.h, pill.h, collapse) * (1 - motion.squash);
  const w = lerp(baseW, dot, grow);
  const h = lerp(baseH, dot, grow);
  const travelColor = mixLab(palette.primary, pillColor(stage, frame, point), collapse);
  const dropping = ramp(frame, schedule.dropStart, schedule.dropEnd, inOut);
  return {
    cx: point.x,
    cy: point.y,
    w,
    h,
    r: lerp(tile.r, Math.min(w, h) / 2, collapse),
    rotation: settled ? 0 : motion.rotation,
    color: mixLab(travelColor, palette.primary, dropping),
    shift: moving ? 0 : roll.dx,
    scale: 1,
  };
};

export const fillAt = (stage: Stage, frame: number): Blob => {
  const { schedule, lockup, palette, center } = stage;
  if (frame < schedule.collapseStart || frame >= schedule.foldEnd) {
    return tileBlob(stage, frame);
  }
  if (frame < schedule.foldStart) {
    return travelBlob(stage, frame);
  }
  const cover: Box = {
    cx: center.x,
    cy: center.y,
    w: stage.coverRadius * 2,
    h: stage.coverRadius * 2,
    r: stage.coverRadius,
  };
  const t = ramp(frame, schedule.foldStart, schedule.foldEnd, inOut);
  const tile = lockup.tile;
  return {
    cx: lerp(cover.cx, tile.cx, t),
    cy: lerp(cover.cy, tile.cy, t),
    w: lerp(cover.w, tile.w, t),
    h: lerp(cover.h, tile.h, t),
    r: lerp(cover.r, tile.r, t),
    rotation: 0,
    color: palette.primary,
    shift: 0,
    scale: 1,
  };
};

export const caretAt = (stage: Stage, frame: number, x0: number, x1: number, y: number) => {
  const { schedule } = stage;
  if (frame < schedule.caretIn || frame >= schedule.caretOutEnd) {
    return null;
  }
  const scale =
    ramp(frame, schedule.caretIn, schedule.caretIn + 5, inOut) *
    (1 - ramp(frame, schedule.caretOutStart, schedule.caretOutEnd, inOut));
  if (frame < schedule.writeStart) {
    const frames = schedule.writeStart - schedule.caretIn;
    const t = clamp01((frame - schedule.caretIn) / frames);
    const speed = ((x1 - x0) * Math.PI) / 2 / (schedule.writeEnd - schedule.writeStart);
    const run = (speed * frames) / 2;
    return { x: x0 - run + run * t * t, y, scale };
  }
  const t = ramp(frame, schedule.writeStart, schedule.writeEnd, WRITE);
  return { x: lerp(x0, x1, t), y, scale };
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
