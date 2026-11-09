import type { DominoWordsProps } from '@/schemas';
import type { Domino } from './chain';
import {
  FLAT,
  restAngle,
  slabCorners,
  solveTopple,
  type Topple,
  toppleAngle,
  toppleSpeed,
} from './physics';

const TRANSFER = 0.8;
const FIRST_PUSH = 0.6;
const BOUNCE_FRAMES = 8;
const SECOND_BOUNCE_FRAMES = 5;
const SECOND_BOUNCE = 0.3;

export type Schedule = {
  starts: number[];
  topples: Topple[];
  land: number;
};

export const buildSchedule = (chain: Domino[], timing: DominoWordsProps['timing']): Schedule => {
  const count = chain.length;
  const step = count > 1 ? timing.chainFrames / (count - 1) : 0;
  const starts = chain.map((_domino, index) => timing.hitAt + index * step);
  const topples: Topple[] = [];
  chain.forEach((domino, index) => {
    const next = chain[index + 1];
    const target = next === undefined ? FLAT : restAngle(domino, next, 0);
    const frames = next === undefined ? timing.lastFrames : step;
    const previous = topples[index - 1];
    const spin =
      previous === undefined ? (FIRST_PUSH * target) / frames : TRANSFER * toppleSpeed(previous);
    topples.push(solveTopple(spin, target, frames));
  });
  return { starts, topples, land: (starts[count - 1] ?? timing.hitAt) + timing.lastFrames };
};

const settleAngle = (since: number, settle: number): number => {
  const amplitude = (settle * Math.PI) / 180;
  if (since < BOUNCE_FRAMES) {
    return FLAT - amplitude * Math.sin((Math.PI * since) / BOUNCE_FRAMES);
  }
  const second = since - BOUNCE_FRAMES;
  if (second < SECOND_BOUNCE_FRAMES) {
    return FLAT - SECOND_BOUNCE * amplitude * Math.sin((Math.PI * second) / SECOND_BOUNCE_FRAMES);
  }
  return FLAT;
};

export const SETTLED_AFTER = BOUNCE_FRAMES + SECOND_BOUNCE_FRAMES;

export const anglesAt = (
  chain: Domino[],
  schedule: Schedule,
  frame: number,
  settle: number,
): number[] => {
  const angles = chain.map(() => 0);
  for (let index = chain.length - 1; index >= 0; index--) {
    const domino = chain[index];
    const start = schedule.starts[index] ?? 0;
    const topple = schedule.topples[index];
    if (domino === undefined || topple === undefined || frame <= start) {
      continue;
    }
    const next = chain[index + 1];
    const nextStart = schedule.starts[index + 1] ?? Number.POSITIVE_INFINITY;
    if (next === undefined) {
      angles[index] =
        frame < schedule.land
          ? toppleAngle(topple, frame - start)
          : settleAngle(frame - schedule.land, settle);
    } else if (frame < nextStart) {
      angles[index] = toppleAngle(topple, frame - start);
    } else {
      angles[index] = restAngle(domino, next, angles[index + 1] ?? 0);
    }
  }
  return angles;
};

export type Bounds = { minX: number; maxX: number; maxY: number };

export const chainBounds = (chain: Domino[], angles: number[]): Bounds => {
  const corners = chain.flatMap((domino, index) => slabCorners(domino, angles[index] ?? 0));
  if (corners.length === 0) {
    return { minX: 0, maxX: 1, maxY: 1 };
  }
  return {
    minX: Math.min(...corners.map(([x]) => x)),
    maxX: Math.max(...corners.map(([x]) => x)),
    maxY: Math.max(...corners.map(([, y]) => y)),
  };
};
