import { Easing } from 'remotion';
import { clamp01, ramp } from '../../kit/motion';
import type { Box } from './layout';
import type { Schedule } from './timeline';

const DEGREES_PER_DIAGONAL = 60;
const EXIT_MARGIN = 40;

export type Roll = { dx: number; angle: number; speed: number };

const offsetAt = (tile: Box, frameWidth: number, schedule: Schedule, frame: number) => {
  if (frame < schedule.rollEnd) {
    const t = clamp01((frame + schedule.rollLead) / (schedule.rollEnd + schedule.rollLead));
    return -(frameWidth / 2) * (1 - Easing.out(Easing.cubic)(t));
  }
  if (frame >= schedule.exitStart) {
    const distance = frameWidth - tile.cx + Math.hypot(tile.w, tile.h) / 2 + EXIT_MARGIN;
    const t = (frame - schedule.exitStart) / Math.max(1, schedule.exitEnd - schedule.exitStart);
    return distance * Easing.in(Easing.quad)(clamp01(t)) + 2 * Math.max(0, t - 1) * distance;
  }
  return 0;
};

export const rollAt = (tile: Box, frameWidth: number, schedule: Schedule, frame: number): Roll => {
  const dx = offsetAt(tile, frameWidth, schedule, frame);
  const before = offsetAt(tile, frameWidth, schedule, frame - 0.5);
  const after = offsetAt(tile, frameWidth, schedule, frame + 0.5);
  return {
    dx,
    angle: (dx / Math.hypot(tile.w, tile.h)) * DEGREES_PER_DIAGONAL * Math.min(1, tile.h / tile.w),
    speed: Math.abs(after - before),
  };
};

const BREATH = 0.01;

export const breathAt = (schedule: Schedule, frame: number) => {
  if (frame <= schedule.foldEnd || frame >= schedule.exitStart) {
    return 1;
  }
  const t = (frame - schedule.foldEnd) / Math.max(1, schedule.exitStart - schedule.foldEnd);
  return 1 + BREATH * Math.sin(Math.PI * t) ** 2;
};

export const trailFade = (schedule: Schedule, frame: number) =>
  1 - ramp(frame, schedule.exitEnd, schedule.last, Easing.in(Easing.quad));

export const sweepAt = (schedule: Schedule, frame: number, at: number, count: number) => {
  const stagger = count <= 1 ? 0 : Math.min(1, 4 / (count - 1));
  const start = schedule.exitStart + at * stagger;
  return {
    move: ramp(frame, start, start + 10, Easing.in(Easing.quad)),
    fade: ramp(frame, start + 3, start + 10, Easing.inOut(Easing.sin)),
  };
};
