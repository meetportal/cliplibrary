import type { FilmDustProps } from '@/schemas';

type MarkKind = 'hair' | 'fibre' | 'speck' | 'dark' | 'scratch';

export type Mark = {
  kind: MarkKind;
  x: number;
  y: number;
  start: number;
  life: number;
  peak: number;
  angle: number;
  length: number;
  width: number;
  bendA: number;
  bendB: number;
};

const MARKS_PER_FRAME = 1.5;
const SCRATCHES_PER_FRAME = 0.022;
const FADE_IN = 3;
const FADE_OUT = 4;

const random = (seed: number) => {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const between = (next: () => number, low: number, high: number) => low + (high - low) * next();

const pickKind = (next: () => number, hairs: number, dark: number): MarkKind => {
  const roll = next();
  if (roll < hairs) {
    return next() < 0.75 ? 'hair' : 'fibre';
  }
  return next() < dark ? 'dark' : 'speck';
};

const dustMark = (next: () => number, frames: number, dust: FilmDustProps['dust']): Mark => {
  const kind = pickKind(next, dust.hairs, dust.darkSpecks);
  const speck = kind === 'speck' || kind === 'dark';
  const life = speck
    ? Math.max(2, Math.round(dust.life * between(next, 0.2, 0.7)))
    : Math.max(3, Math.round(dust.life * between(next, 0.6, 1.4)));
  return {
    kind,
    x: next(),
    y: next(),
    start: Math.floor(next() * frames),
    life,
    peak: dust.opacity * (kind === 'dark' ? between(next, 1.4, 2.2) : between(next, 0.6, 1.4)),
    angle: next() * Math.PI * 2,
    length: dust.size * (kind === 'fibre' ? between(next, 24, 60) : between(next, 26, 72)),
    width: dust.size * (speck ? between(next, 1.4, 3.6) : between(next, 1.6, 2.6)),
    bendA: between(next, -0.5, 0.5),
    bendB: between(next, -0.5, 0.5),
  };
};

const scratchMark = (next: () => number, frames: number, dust: FilmDustProps['dust']): Mark => ({
  kind: 'scratch',
  x: between(next, 0.04, 0.96),
  y: between(next, -0.1, 0.5),
  start: Math.floor(next() * frames),
  life: Math.max(3, Math.round(dust.life * between(next, 0.6, 1.1))),
  peak: dust.opacity * between(next, 0.45, 0.8),
  angle: 0,
  length: between(next, 0.35, 0.8),
  width: Math.max(1, dust.size * between(next, 1.2, 2)),
  bendA: between(next, -0.004, 0.004),
  bendB: between(next, -0.004, 0.004),
});

export const buildMarks = (frames: number, dust: FilmDustProps['dust']): Mark[] => {
  const next = random(dust.seed);
  const count = Math.round(frames * MARKS_PER_FRAME * dust.amount);
  const scratches = Math.round(frames * SCRATCHES_PER_FRAME * dust.scratches);
  return [
    ...Array.from({ length: count }, () => dustMark(next, frames, dust)),
    ...Array.from({ length: scratches }, () => scratchMark(next, frames, dust)),
  ];
};

export const markAlpha = (mark: Mark, frame: number, frames: number): number => {
  const age = (((frame - mark.start) % frames) + frames) % frames;
  if (age >= mark.life) {
    return 0;
  }
  const rise = Math.min(1, (age + 1) / FADE_IN);
  const fall = Math.min(1, (mark.life - age) / Math.min(FADE_OUT, mark.life));
  return Math.min(1, mark.peak) * Math.min(rise, fall);
};
