import { Easing, interpolate } from 'remotion';
import type { WordPickerProps } from '@/schemas';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

export const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const roll = Easing.bezier(0.4, 0.15, 0.4, 1);

export const tween = (
  frame: number,
  range: readonly [number, number],
  output: readonly [number, number],
  easing: (t: number) => number = Easing.linear,
) =>
  interpolate(frame, [range[0], range[1]], [output[0], output[1]], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const pixelTween = (
  frame: number,
  range: readonly [number, number],
  [from, to]: readonly [number, number],
  easing: (t: number) => number,
): number => {
  const start = Math.round(from);
  const distance = Math.abs(Math.round(to) - start);
  if (distance === 0 || frame <= range[0]) {
    return start;
  }
  const direction = Math.sign(Math.round(to) - start);
  let travelled = 0;
  for (let step = Math.floor(range[0]) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(
      tween(step, range, [from, to], easing) - tween(step - 1, range, [from, to], easing),
    );
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(ideal)));
  }
  return start + direction * travelled;
};

export type Moves = { count: number; starts: number[]; length: number };

export const movesOf = (steps: WordPickerProps['steps'], items: number): Moves => {
  const count = Math.max(0, Math.min(Math.round(steps.count), items - 1));
  const length = Math.max(4, Math.min(steps.moveFrames, steps.every - 2));
  return {
    count,
    length,
    starts: Array.from({ length: count }, (_unused, index) => steps.firstAt + index * steps.every),
  };
};

export const listOffset = (frame: number, moves: Moves, pitch: number): number =>
  moves.starts.reduce(
    (total, start) => total + pixelTween(frame, [start, start + moves.length], [0, pitch], roll),
    0,
  );

export const listProgress = (frame: number, moves: Moves): number =>
  moves.starts.reduce(
    (total, start) => total + tween(frame, [start, start + moves.length], [0, 1], roll),
    0,
  );

const ENTRANCE_FRAMES = 26;

const ENTRANCE_RISE = 64;

export const wordEntrance = (
  frame: number,
  entrance: WordPickerProps['entrance'],
  order: number,
): { opacity: number; rise: number } => {
  const start = entrance.wordsAt + (order <= 0 ? 0 : 6 + (order - 1) * entrance.stagger);
  const range: [number, number] = [start, start + ENTRANCE_FRAMES];
  return {
    opacity: tween(frame, range, [0, 1], settle),
    rise: pixelTween(frame, range, [ENTRANCE_RISE, 0], settle),
  };
};

export const brandOpacity = (frame: number): number =>
  tween(frame, [0, 8], [0.6, 1], Easing.out(Easing.quad));
