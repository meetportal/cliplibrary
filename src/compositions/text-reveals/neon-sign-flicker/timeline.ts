import { Easing, interpolate } from 'remotion';
import type { NeonSignFlickerProps } from '@/schemas';

type Flicker = NeonSignFlickerProps['flicker'];
type Opening = NeonSignFlickerProps['opening'];

export type SignState = {
  letters: number[];
  gain: number;
  lamp: number;
};

type Segment = { start: number; levels: number[]; after: number };

export type SignTimeline = {
  ignitions: Segment[];
  lampOn: Segment;
  flicker: Segment[];
  end: number;
  ending: Flicker['ending'];
};

const EMBER = 0.04;
const LAMP_IDLE = 0.12;
const IGNITIONS = [
  [0.35, 0.05, 0.7, 0.2, 1],
  [0.6, 0.12, 0.08, 1],
  [0.25, 0.6, 0.15, 0.9, 1],
];
const DROPS = [[0.45, 0.1, 0.5], [0.35, 0.05, 0.05, 0.4], [0.62]];
const BURN_OUT = [0.3, 0.12, EMBER];
const RELIGHT = [0.35, 0.8, 1];

const random = (seed: number) => {
  let state = Math.floor(seed * 9973) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(items: readonly T[], roll: number): T =>
  items[Math.min(items.length - 1, Math.floor(roll * items.length))] as T;

const burstLevels = (length: number, weakness: number, roll: () => number): number[] => {
  const full = 1 - 0.22 * weakness;
  if (length <= 3) {
    return [0.55, full, 0.5].slice(0, length);
  }
  const levels = [0.5];
  let nextDrop = 2 + Math.floor(roll() * 3);
  while (levels.length < length - 1) {
    const drop = pick(DROPS, roll());
    if (levels.length >= nextDrop && levels.length + drop.length < length - 1) {
      levels.push(...drop);
      nextDrop = levels.length + 2 + Math.floor(roll() * (5 - 3 * weakness));
    } else {
      levels.push(full * (0.86 + 0.14 * roll()));
    }
  }
  return [...levels, 0.45];
};

const segmentLevel = (segment: Segment, frame: number): number | null => {
  const offset = Math.floor(frame - segment.start);
  if (offset < 0) {
    return null;
  }
  return segment.levels[offset] ?? segment.after;
};

export const buildTimeline = (count: number, flicker: Flicker, opening: Opening): SignTimeline => {
  const roll = random(flicker.pattern);
  const switchOn = opening.style === 'switch-on';
  const firstLetter = 10;
  const stagger = Math.min(7, Math.max(2, (opening.length - 22) / Math.max(1, count - 1)));
  const ignitions = Array.from({ length: count }, (_, index) => ({
    start: switchOn ? firstLetter + Math.round(index * stagger) : -1,
    levels: switchOn ? pick(IGNITIONS, roll()) : [],
    after: 1,
  }));
  const lastIgnition = Math.max(0, ...ignitions.map((item) => item.start + item.levels.length));
  const lampOn = {
    start: switchOn ? 4 : -1,
    levels: switchOn ? [0.7, 0.15, 0.9, 0.4] : [],
    after: 1,
  };
  const segments: Segment[] = [];
  let cursor = Math.max(flicker.start, switchOn ? lastIgnition + 12 : 0);
  const bursts = Math.round(flicker.bursts);
  for (let index = 0; index < bursts; index++) {
    const length = Math.max(3, Math.round(flicker.firstBurst - flicker.shrink * index));
    segments.push({
      start: cursor,
      levels: burstLevels(length, index / Math.max(1, bursts - 1), roll),
      after: EMBER,
    });
    cursor += length;
    if (index < bursts - 1) {
      cursor += Math.max(4, Math.round(flicker.gap * (1 - 0.1 * Math.max(0, index - 2))));
    }
  }
  const ending =
    flicker.ending === 'burn-out'
      ? { start: cursor, levels: BURN_OUT, after: 0 }
      : { start: cursor + Math.max(4, Math.round(flicker.gap * 0.6)), levels: RELIGHT, after: 1 };
  return {
    ignitions,
    lampOn,
    flicker: [...segments, ending],
    end: ending.start,
    ending: flicker.ending,
  };
};

const flickerLevel = (line: SignTimeline, frame: number): number => {
  let level = 1;
  for (const segment of line.flicker) {
    const value = segmentLevel(segment, frame);
    if (value === null) {
      return level;
    }
    level = value;
  }
  return level;
};

const surge = (line: SignTimeline, frame: number) =>
  line.ending === 'relight'
    ? 0.28 *
      interpolate(frame, [line.end + 1, line.end + 3, line.end + 26], [0, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.sin),
      })
    : 0;

export const signState = (
  line: SignTimeline,
  frame: number,
  target: number,
  hum: number,
): SignState => {
  const failing = flickerLevel(line, frame);
  const letters = line.ignitions.map((ignition, index) => {
    const lit = ignition.start < 0 ? 1 : (segmentLevel(ignition, frame) ?? 0);
    return index === target ? Math.min(lit, failing) : lit;
  });
  const lampPower = line.lampOn.start < 0 ? 1 : (segmentLevel(line.lampOn, frame) ?? 0);
  const inFlicker = frame >= (line.flicker[0]?.start ?? Number.POSITIVE_INFINITY);
  const lampCircuit = inFlicker ? LAMP_IDLE + (1 - LAMP_IDLE) * failing : 1;
  const dead = line.ending === 'burn-out' && frame >= line.end;
  return {
    letters,
    gain: 1 + hum * Math.sin((2 * Math.PI * frame) / 53) + surge(line, frame),
    lamp: dead ? failing * (1 - LAMP_IDLE) : lampPower * lampCircuit,
  };
};
