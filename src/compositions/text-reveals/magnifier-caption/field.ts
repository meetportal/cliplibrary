import type { MagnifierCaptionProps } from '@/schemas';
import { type Key, keyBounds, type Point, targetPoint } from './path';

export type Bubble = Point & {
  r: number;
  word: string;
  size: number;
  target: number;
};

const IDLE_BUBBLE: Point = { x: -75, y: 30 };

const WIDTH_PER_CHAR = 0.56;
const MIN_RADIUS = 52;
const MAX_RADIUS = 170;
const GAP = 6;
const FILL = 0.72;

const mulberry = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const textWidth = (word: string, size: number): number => [...word].length * size * WIDTH_PER_CHAR;

const fits = (bubbles: readonly Bubble[], x: number, y: number, r: number): boolean =>
  bubbles.every((other) => Math.hypot(other.x - x, other.y - y) >= other.r + r + GAP);

const sizedFor = (word: string, r: number, largest: number): number =>
  Math.min(largest, (r * 1.55) / Math.max(1, [...word].length * WIDTH_PER_CHAR));

export const buildField = (
  props: MagnifierCaptionProps,
  words: readonly string[],
  keys: readonly Key[],
): Bubble[] => {
  const { cells, type, lens } = props;
  const decoys = cells.words
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
  const random = mulberry(Math.round(cells.seed) * 7919 + 13);
  const largest = type.cellSize;
  const ceiling = lens.radius * 0.86;
  const bubbles: Bubble[] = [];
  const idleWord = decoys[0] ?? '';
  const idleRadius = Math.min(
    ceiling,
    Math.max(cells.size * 0.8, textWidth(idleWord, largest) / 2 + 36),
  );
  bubbles.push({
    ...IDLE_BUBBLE,
    r: idleRadius,
    word: idleWord,
    size: sizedFor(idleWord, idleRadius, largest),
    target: -1,
  });
  words.forEach((word, index) => {
    const point = targetPoint(index, cells.spread);
    const wanted = Math.max(
      cells.size * (0.82 + random() * 0.36),
      textWidth(word, largest) / 2 + 40,
    );
    const r =
      Math.min(ceiling, wanted) *
      (fits(bubbles, point.x, point.y, Math.min(ceiling, wanted)) ? 1 : 0.8);
    bubbles.push({ ...point, r, word, size: sizedFor(word, r, largest), target: index });
  });
  const bounds = keyBounds(keys);
  const margin = MAX_RADIUS + 80;
  const left = bounds.left - margin;
  const top = bounds.top - margin;
  const width = bounds.right - bounds.left + margin * 2;
  const height = bounds.bottom - bounds.top + margin * 2;
  const attempts = Math.min(40000, Math.round((width * height) / 1500));
  for (let attempt = 0; attempt < attempts; attempt++) {
    const progress = (attempt / attempts) ** 0.6;
    const r = MAX_RADIUS - (MAX_RADIUS - MIN_RADIUS) * progress * (0.85 + random() * 0.15);
    const x = left + random() * width;
    const y = top + random() * height;
    if (!fits(bubbles, x, y, r)) {
      continue;
    }
    const pick = decoys[Math.floor(random() * decoys.length)] ?? '';
    const labelled = random() < FILL && textWidth(pick, largest) < r * 1.7 && r > largest;
    bubbles.push({ x, y, r, word: labelled ? pick : '', size: largest, target: -1 });
  }
  return bubbles;
};
