import { Easing, interpolate } from 'remotion';
import type { DotRingLogoRevealProps } from '@/schemas';
import { curveAt, hermite, lerpPoint, type Point, ringPoint } from './geometry';
import type { Lockup } from './lockup';

const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
const fall = Easing.in(Easing.quad);
const rebound = Easing.out(Easing.quad);
const glide = Easing.bezier(0.45, 0, 0.25, 1);

export const progress = (
  frame: number,
  [start, end]: readonly [number, number],
  easing: (t: number) => number = smooth,
) =>
  interpolate(frame, [start, Math.max(start + 0.001, end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

const REST_FRAMES = 11;
const ENTRANCE_FRAMES = 12;
const ENTRANCE_RISE = 120;
const SQUASH_RECOVERY = 3;
const FALL_SPEED = 0.26;
const START_SPEED = 0.12;
const CLOSE_SPEED = 1.4;
const COMET_SHARE = 0.17;

export type Timeline = {
  start: number;
  merge: number;
  close: number;
  exitEnd: number;
  apexEnd: number;
  dropEnd: number;
  slideStart: number;
  slideEnd: number;
  closeSpeed: number;
  total: number;
};

const ringDistance = (frame: number, start: number, close: number, circumference: number) =>
  hermite(
    frame,
    [start, close],
    [0, circumference],
    (START_SPEED * circumference) / (close - start),
    (CLOSE_SPEED * circumference) / (close - start),
  );

export const buildTimeline = (
  timing: DotRingLogoRevealProps['timing'],
  lockup: Lockup,
): Timeline => {
  const { start, ringFrames, pause, nameFrames } = timing;
  const close = start + ringFrames;
  const circumference = lockup.circumference;
  const closeSpeed = (CLOSE_SPEED * circumference) / ringFrames;
  const exitFrames = Math.min(12, Math.max(8, Math.round((2 * lockup.exit.length) / closeSpeed)));
  let low = start;
  let high = close;
  for (let step = 0; step < 30; step++) {
    const middle = (low + high) / 2;
    if (ringDistance(middle, start, close, circumference) < lockup.mergeDistance) {
      low = middle;
    } else {
      high = middle;
    }
  }
  const exitEnd = close + exitFrames;
  const apexEnd = exitEnd + pause;
  const ringHeight = 2 * lockup.radius + lockup.thickness;
  const fallFrames = Math.min(
    16,
    Math.max(10, Math.round((2 * lockup.drop.length) / (FALL_SPEED * ringHeight))),
  );
  const dropEnd = apexEnd + fallFrames;
  const slideStart = dropEnd + REST_FRAMES;
  return {
    start,
    merge: high,
    close,
    exitEnd,
    apexEnd,
    dropEnd,
    slideStart,
    slideEnd: slideStart + nameFrames,
    closeSpeed,
    total: circumference + lockup.exit.length,
  };
};

export const headDistance = (frame: number, line: Timeline, lockup: Lockup) =>
  frame < line.close
    ? ringDistance(frame, line.start, line.close, lockup.circumference)
    : hermite(
        frame,
        [line.close, line.exitEnd],
        [lockup.circumference, line.total],
        line.closeSpeed,
        0,
      );

const pathPoint = (distance: number, lockup: Lockup): Point =>
  distance <= lockup.circumference
    ? ringPoint(lockup.center, lockup.radius, distance)
    : curveAt(lockup.exit, distance - lockup.circumference);

export const cometLength = (distance: number, line: Timeline, lockup: Lockup) =>
  Math.max(
    0,
    Math.min(
      COMET_SHARE * lockup.circumference,
      distance - lockup.mergeDistance,
      line.total - distance,
    ),
  );

const slideX = (frame: number, line: Timeline, lockup: Lockup) =>
  lockup.slideStart.x +
  (lockup.stop.x - lockup.slideStart.x) * progress(frame, [line.slideStart, line.slideEnd], glide);

export type DotState = {
  point: Point;
  radius: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
};

const still = (point: Point, radius: number): DotState => ({
  point,
  radius,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
});

const falling = (frame: number, line: Timeline, lockup: Lockup): DotState => {
  const ringRadius = lockup.thickness / 2;
  const span: readonly [number, number] = [line.apexEnd, line.dropEnd];
  const fallen = (at: number) => progress(at, span, fall) * lockup.drop.length;
  const radius =
    ringRadius + (lockup.stopRadius - ringRadius) * progress(frame, span, Easing.linear);
  const speed = fallen(frame) - fallen(frame - 1);
  const scaleY = 1 + Math.min(0.4, speed / (10 * radius));
  return {
    point: curveAt(lockup.drop, fallen(frame)),
    radius,
    scaleX: 1 / Math.sqrt(scaleY),
    scaleY,
    opacity: 1,
  };
};

const squash = (frame: number, line: Timeline) =>
  progress(frame, [line.dropEnd + 1, line.dropEnd + SQUASH_RECOVERY], rebound);

const landing = (frame: number, line: Timeline, lockup: Lockup): DotState => {
  const recovered = squash(frame, line);
  const scaleY = 0.6 + 0.4 * recovered;
  const radius = lockup.stopRadius;
  return {
    point: { x: lockup.slideStart.x, y: lockup.slideStart.y + radius * (1 - scaleY) },
    radius,
    scaleX: 1.5 - 0.5 * recovered,
    scaleY,
    opacity: 1,
  };
};

export const dotState = (frame: number, line: Timeline, lockup: Lockup): DotState => {
  const ringRadius = lockup.thickness / 2;
  if (frame < line.merge) {
    const target = pathPoint(lockup.mergeDistance, lockup);
    const span = Math.hypot(lockup.waitPoint.x - target.x, lockup.waitPoint.y - target.y);
    const headSpeed =
      headDistance(line.merge + 0.5, line, lockup) - headDistance(line.merge - 0.5, line, lockup);
    const travelled = hermite(frame, [0, line.merge], [0, span], 0.9, headSpeed);
    const point = lerpPoint(lockup.waitPoint, target, span > 0 ? travelled / span : 1);
    const rise = ENTRANCE_RISE * (1 - progress(frame, [0, ENTRANCE_FRAMES], settle));
    return {
      ...still(
        { x: point.x, y: point.y + rise },
        ringRadius * (0.6 + 0.4 * progress(frame, [0, 8], settle)),
      ),
      opacity: 0.45 + 0.55 * progress(frame, [0, 8], Easing.linear),
    };
  }
  if (frame < line.exitEnd) {
    return still(pathPoint(headDistance(frame, line, lockup), lockup), ringRadius);
  }
  if (frame <= line.apexEnd) {
    return still(lockup.apex, ringRadius);
  }
  if (frame <= line.dropEnd) {
    return falling(frame, line, lockup);
  }
  if (frame < line.slideStart) {
    return landing(frame, line, lockup);
  }
  const speed = slideX(frame + 0.5, line, lockup) - slideX(frame - 0.5, line, lockup);
  const stretch = 1 + Math.min(1.4, speed / Math.max(1, lockup.stopRadius * 2)) * 0.9;
  const recovered = squash(frame, line);
  const scaleY = (0.6 + 0.4 * recovered) / (1 + (stretch - 1) * 0.35);
  return {
    point: { x: slideX(frame, line, lockup), y: lockup.stop.y + lockup.stopRadius * (1 - scaleY) },
    radius: lockup.stopRadius,
    scaleX: Math.max(stretch, 1.5 - 0.5 * recovered),
    scaleY,
    opacity: 1,
  };
};

export const letterStart = (glyphX: number, line: Timeline, lockup: Lockup) => {
  if (glyphX <= lockup.slideStart.x) {
    return line.slideStart - 1;
  }
  let low = line.slideStart;
  let high = line.slideEnd;
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (slideX(middle, line, lockup) < glyphX) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return high - 1;
};
