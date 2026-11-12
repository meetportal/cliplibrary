import { Easing } from 'remotion';
import { clamp01, lerp, ramp } from '../../kit/motion';

const HOLD_MIN = 50;
const TAIL = 70;
const BOB_MIN = 12;
const BOB_MAX = 15;
const MAX_WRITE = 48;
const FIRST_HOP = 14;
const MIN_HOP = 6;
const MIN_WRITE = 24;
const FLIP_GAP = 12;

export type Schedule = {
  collapseStart: number;
  collapseEnd: number;
  lands: number[];
  bobStart: number;
  dropStart: number;
  dropEnd: number;
  growStart: number;
  growEnd: number;
  caretIn: number;
  writeStart: number;
  writeEnd: number;
  caretHopStart: number;
  caretHopEnd: number;
  swellStart: number;
  swellEnd: number;
  logoStart: number;
  accentStart: number;
  foldStart: number;
  foldEnd: number;
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

export const buildSchedule = (
  words: number,
  hop: number,
  write: number,
  duration: number,
): Schedule => {
  const collapseStart = 2;
  const collapseEnd = 18;
  const firstLand = collapseEnd + FIRST_HOP;
  const latestDrop = (frames: number) => duration - 1 - HOLD_MIN - TAIL - frames;
  const gaps = Math.max(0, words - 1);
  const shortfall = Math.max(0, gaps * MIN_HOP - (latestDrop(write) - BOB_MIN - firstLand));
  const writeFrames = Math.max(MIN_WRITE, write - shortfall);
  const window = latestDrop(writeFrames) - BOB_MIN - firstLand;
  const lands =
    gaps === 0
      ? soloLands(firstLand, window, hop)
      : spreadLands(firstLand, window, gaps, hop, Math.max(1, words));
  const bobStart = lands.at(-1) ?? firstLand;
  const bob = Math.max(BOB_MIN, Math.min(BOB_MAX, latestDrop(writeFrames) - bobStart));
  const dropStart = bobStart + bob;
  const writeTime = Math.max(writeFrames, Math.min(MAX_WRITE, latestDrop(0) - dropStart));
  const dropEnd = dropStart + 12;
  const growStart = dropEnd;
  const growEnd = growStart + 16;
  const caretIn = growEnd - 5;
  const writeStart = growEnd;
  const writeEnd = writeStart + writeTime;
  const caretHopStart = writeEnd;
  const caretHopEnd = caretHopStart + 12;
  const swellStart = writeEnd - 4;
  const swellEnd = swellStart + 12;
  const logoStart = swellStart + 6;
  const accentStart = swellEnd + 8;
  const foldStart = accentStart + 6;
  const foldEnd = foldStart + 20;
  return {
    collapseStart,
    collapseEnd,
    lands,
    bobStart,
    dropStart,
    dropEnd,
    growStart,
    growEnd,
    caretIn,
    writeStart,
    writeEnd,
    caretHopStart,
    caretHopEnd,
    swellStart,
    swellEnd,
    logoStart,
    accentStart,
    foldStart,
    foldEnd,
    last: duration - 1,
  };
};

export const flipTargets = (lands: readonly number[]): (boolean | null)[] => {
  const flips = lands.map(() => false);
  let lastChosen = Number.POSITIVE_INFINITY;
  let onPrimary = false;
  for (let at = lands.length - 1; at >= 0; at--) {
    const land = lands[at] ?? 0;
    if (lastChosen - land >= FLIP_GAP) {
      flips[at] = true;
      lastChosen = land;
    }
  }
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

const IRIS_FRAMES = 10;

export const irisProgress = (frame: number, land: number) =>
  ramp(frame, land - 1, land - 1 + IRIS_FRAMES, Easing.inOut(Easing.cubic));

export type Point = { x: number; y: number };

export const arc = (from: Point, to: Point, t: number, height: number): Point => {
  const top = Math.min(from.y, to.y) - height;
  const k = clamp01(t);
  const base = lerp(from.y, to.y, k);
  const lift = 4 * k * (1 - k) * (top - (from.y + to.y) / 2);
  return { x: lerp(from.x, to.x, k), y: base + lift };
};

export const pixelRise = (frame: number, start: number, frames: number, distance: number) => {
  const t = clamp01((frame - start) / frames);
  return Math.round(distance * (1 - t) ** 2);
};
