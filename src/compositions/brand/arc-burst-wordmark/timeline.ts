import { Easing, interpolate } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const burstOut = Easing.bezier(0.3, 0, 0.2, 1);

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

export const pixelTween = (
  frame: number,
  [start, end]: readonly [number, number],
  [from, to]: readonly [number, number],
  easing: (t: number) => number,
): number => {
  const distance = Math.abs(Math.round(to - from));
  if (distance === 0 || frame <= start) {
    return from;
  }
  const direction = Math.sign(to - from);
  const ideal = (at: number) => progress(at, [start, end], easing) * (to - from);
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < distance; step++) {
    const velocity = Math.abs(ideal(step) - ideal(step - 1));
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(velocity)));
  }
  return travelled >= distance ? to : from + direction * travelled;
};

export const SLICES = 3;
export const SLICE_STAGGER = 2;
export const SHARD_FRAMES = 12;

export const settledAt = (
  start: number,
  line: Timeline,
  style: ArcBurstWordmarkProps['build']['style'],
) => start + (style === 'slices' ? (SLICES - 1) * SLICE_STAGGER : 0) + line.flight + SHARD_FRAMES;

export const markSettledAt = (line: Timeline, style: ArcBurstWordmarkProps['build']['style']) =>
  line.markStart + (style === 'slices' ? (SLICES - 1) * SLICE_STAGGER : 0) + line.flight;

export type Timeline = {
  burstAt: number;
  burstEnd: number;
  buildStart: number;
  letterStarts: number[];
  markStart: number;
  buildEnd: number;
  flight: number;
  orbitsGone: number;
  accentStart: number;
  accentEnd: number;
};

export const buildTimeline = (props: ArcBurstWordmarkProps, letters: number): Timeline => {
  const { burst, build } = props;
  const burstAt = burst.at;
  const burstEnd = burst.at + burst.length;
  const buildStart = burstAt + build.delay;
  const count = Math.max(1, letters);
  const letterStarts = Array.from(
    { length: count },
    (_, index) => buildStart + (count === 1 ? 0 : (build.spread * index) / (count - 1)),
  );
  const tail = build.style === 'slices' ? (SLICES - 1) * SLICE_STAGGER : 0;
  const buildEnd = buildStart + build.spread + tail + build.flight;
  return {
    burstAt,
    burstEnd,
    buildStart,
    letterStarts,
    markStart: buildStart + build.spread * 0.5,
    buildEnd,
    flight: build.flight,
    orbitsGone: buildEnd + 10,
    accentStart: buildEnd - 10,
    accentEnd: buildEnd + 34,
  };
};
