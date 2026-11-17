import { Easing } from 'remotion';
import { clamp01, lerp, ramp } from '../../kit/motion';

const ROLL = 15;
const ROLL_LEAD = 2;
const COLLAPSE_START = 3;
const COLLAPSE = 14;
const TAKEOFF_LEAD = 6;
const FIRST_HOP = 15;
const MIN_HOP = 6;
const BOB = 15;
const LINE_HOLD = 30;
const MAX_EXTRA_HOLD = 24;
const DROP = 16;
const GROW_LEAD = 4;
const GROW = 20;
const COVER_AT = 16;
const MIN_WRITE = 20;
const MAX_WRITE = 48;
const WRITE_BASE = 20;
const WRITE_PER_LETTER = 3;
const TAIL = 30;
const HOLD_MIN = 46;
const EXIT = 13;
const TRAIL_OUT = 3;
const FLIP_GAP = 12;
const IRIS_FRAMES = 12;

export type Schedule = {
  rollEnd: number;
  rollLead: number;
  collapseStart: number;
  collapseEnd: number;
  chainStart: number;
  lands: number[];
  bobs: number[];
  dropStart: number;
  dropEnd: number;
  flipsEnd: number;
  growStart: number;
  growEnd: number;
  caretIn: number;
  writeStart: number;
  writeEnd: number;
  caretOutStart: number;
  caretOutEnd: number;
  swellStart: number;
  swellEnd: number;
  logoStart: number;
  accentStart: number;
  foldStart: number;
  foldEnd: number;
  exitStart: number;
  exitEnd: number;
  last: number;
};

const soloLands = (firstLand: number, window: number, hop: number) => {
  const hops = Math.max(0, Math.floor(window / hop));
  const step = hops === 0 ? 0 : Math.floor(window / hops);
  return Array.from({ length: hops + 1 }, (_, at) => firstLand + at * step);
};

const spreadLands = (
  firstLand: number,
  window: number,
  gaps: number,
  hop: number,
  count: number,
) => {
  const step = Math.max(MIN_HOP, Math.min(hop, Math.floor(window / gaps)));
  return Array.from({ length: count }, (_, at) => firstLand + at * step);
};

const bobTimes = (lastLand: number, hold: number) => {
  const count = Math.max(1, Math.round(hold / BOB));
  return Array.from({ length: count }, (_, at) => lastLand + Math.round(((at + 1) * hold) / count));
};

export const buildSchedule = (
  words: number,
  letters: number,
  hop: number,
  write: number,
  duration: number,
): Schedule => {
  const last = duration - 1;
  const exitEnd = last - TRAIL_OUT;
  const exitStart = exitEnd - EXIT;
  const collapseEnd = COLLAPSE_START + COLLAPSE;
  const chainStart = collapseEnd - TAKEOFF_LEAD;
  const firstLand = chainStart + FIRST_HOP;
  const afterLand = LINE_HOLD + DROP - GROW_LEAD + COVER_AT;
  const latestLand = (frames: number) => exitStart - HOLD_MIN - TAIL - afterLand - frames;
  const writeCap = Math.max(
    MIN_WRITE,
    Math.min(MAX_WRITE, WRITE_BASE + WRITE_PER_LETTER * Math.max(1, letters)),
  );
  const gaps = Math.max(0, words - 1);
  const wanted = Math.min(write, writeCap);
  const shortfall = Math.max(0, gaps * MIN_HOP - (latestLand(wanted) - firstLand));
  const writeFrames = Math.max(MIN_WRITE, wanted - shortfall);
  const window = Math.max(0, latestLand(writeFrames) - firstLand);
  const lands =
    gaps === 0
      ? soloLands(firstLand, window, hop)
      : spreadLands(firstLand, window, gaps, hop, Math.max(1, words));
  const lastLand = lands.at(-1) ?? firstLand;
  const room = latestLand(0) - lastLand;
  const writeTime = Math.max(writeFrames, Math.min(writeCap, room));
  const hold = LINE_HOLD + Math.max(0, Math.min(MAX_EXTRA_HOLD, room - writeTime));
  const bobs = bobTimes(lastLand, hold);
  const dropStart = lastLand + hold;
  const dropEnd = dropStart + DROP;
  const growStart = dropEnd - GROW_LEAD;
  const writeStart = growStart + COVER_AT;
  const writeEnd = writeStart + writeTime;
  return {
    rollEnd: ROLL - ROLL_LEAD,
    rollLead: ROLL_LEAD,
    collapseStart: COLLAPSE_START,
    collapseEnd,
    chainStart,
    lands,
    bobs,
    dropStart,
    dropEnd,
    flipsEnd: lastLand + IRIS_FRAMES,
    growStart,
    growEnd: growStart + GROW,
    caretIn: writeStart - 6,
    writeStart,
    writeEnd,
    caretOutStart: writeEnd - 3,
    caretOutEnd: writeEnd + 9,
    swellStart: writeEnd - 6,
    swellEnd: writeEnd + 8,
    logoStart: writeEnd - 2,
    accentStart: writeEnd + 4,
    foldStart: writeEnd + 8,
    foldEnd: writeEnd + TAIL,
    exitStart,
    exitEnd,
    last,
  };
};

const SOLO_FLIPS = 4;

const spreadFlips = (lands: readonly number[]) => {
  const count = Math.min(SOLO_FLIPS, lands.length - (lands.length % 2));
  const picked = new Set(
    Array.from({ length: count }, (_, at) =>
      Math.round((at * (lands.length - 1)) / Math.max(1, count - 1)),
    ),
  );
  return lands.map((_, at) => picked.has(at));
};

const gapFlips = (lands: readonly number[]) => {
  const flips = lands.map(() => false);
  let lastChosen = Number.POSITIVE_INFINITY;
  for (let at = lands.length >= 3 ? lands.length - 2 : lands.length - 1; at >= 0; at--) {
    const land = lands[at] ?? 0;
    if (lastChosen - land >= FLIP_GAP) {
      flips[at] = true;
      lastChosen = land;
    }
  }
  return flips;
};

export const flipTargets = (lands: readonly number[], solo: boolean): (boolean | null)[] => {
  const flips = solo ? spreadFlips(lands) : gapFlips(lands);
  let onPrimary = false;
  const targets = lands.map(() => false);
  for (let at = lands.length - 1; at >= 0; at--) {
    if (flips[at]) {
      targets[at] = onPrimary;
      onPrimary = !onPrimary;
    }
  }
  let state = false;
  return lands.map((_, at) => {
    const target = targets[at] ?? false;
    if (!flips[at] || target === state) {
      return null;
    }
    state = target;
    return target;
  });
};

export const irisProgress = (frame: number, land: number) =>
  ramp(frame, land - 1, land - 1 + IRIS_FRAMES, Easing.inOut(Easing.sin));

export type Point = { x: number; y: number };

export const arcY = (fromY: number, toY: number, k: number, height: number): number => {
  const top = Math.min(fromY, toY) - height;
  const t = clamp01(k);
  return lerp(fromY, toY, t) + 4 * t * (1 - t) * (top - (fromY + toY) / 2);
};

export const riseIn = (frame: number, start: number, frames: number, distance: number) =>
  distance * (1 - ramp(frame, start, start + frames, Easing.inOut(Easing.sin)));

const slopeAt = (before: number, after: number, spanBefore: number, spanAfter: number) => {
  if (before * after <= 0) {
    return 0;
  }
  const left = 2 * spanAfter + spanBefore;
  const right = spanAfter + 2 * spanBefore;
  return (left + right) / (left / before + right / after);
};

export const smoothThrough = (
  times: readonly number[],
  values: readonly number[],
  frame: number,
): number => {
  const count = Math.min(times.length, values.length);
  const first = times[0] ?? 0;
  const end = times[count - 1] ?? 0;
  if (count < 2 || frame <= first) {
    return values[0] ?? 0;
  }
  if (frame >= end) {
    return values[count - 1] ?? 0;
  }
  let at = 0;
  while (at < count - 2 && frame >= (times[at + 1] ?? 0)) {
    at++;
  }
  const delta = (index: number) =>
    ((values[index + 1] ?? 0) - (values[index] ?? 0)) /
    Math.max(1e-6, (times[index + 1] ?? 0) - (times[index] ?? 0));
  const span = (index: number) => (times[index + 1] ?? 0) - (times[index] ?? 0);
  const slope = (index: number) =>
    index <= 0 || index >= count - 1
      ? 0
      : slopeAt(delta(index - 1), delta(index), span(index - 1), span(index));
  const h = span(at);
  const t = (frame - (times[at] ?? 0)) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * (values[at] ?? 0) +
    (t3 - 2 * t2 + t) * h * slope(at) +
    (-2 * t3 + 3 * t2) * (values[at + 1] ?? 0) +
    (t3 - t2) * h * slope(at + 1)
  );
};
