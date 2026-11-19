import { Easing } from 'remotion';
import { clamp01 } from '../../kit/motion';

export type Span = { from: number; to: number };

export type WordBeat = { enter: Span; exit: Span };

const beat = (enter: number, landed: number, leave: number, gone: number): WordBeat => ({
  enter: { from: enter, to: landed },
  exit: { from: leave, to: gone },
});

export const BEATS = {
  opener: beat(0, 20, 36, 48),
  glitch: beat(44, 68, 88, 100),
  bridge: beat(94, 106, 118, 130),
  panel: beat(126, 142, 162, 174),
  light: beat(178, 190, 208, 220),
  punchOne: beat(216, 230, 246, 258),
  punchTwo: beat(254, 268, 284, 296),
} as const;

export const DECOR = {
  bar: { from: 0, to: 10 },
  sheets: { from: 40, to: 128 },
  arcs: { from: 14, to: 136 },
  dashboard: { from: 104, to: 182 },
  wipe: { from: 164, to: 190 },
  smoke: { from: 180, to: 228 },
  pulseOne: { from: 216, to: 240 },
  pulseTwo: { from: 254, to: 278 },
  signal: { from: 282, to: 450 },
  plate: { from: 338, to: 366 },
  logo: { from: 350, to: 368 },
  endName: { from: 362, to: 376 },
  tagline: { from: 366, to: 384 },
  underline: { from: 380, to: 392 },
  website: { from: 382, to: 394 },
  contacts: { from: 386, to: 398 },
} as const;

const FPS = 30;
export const END = 450;

const NAME_START = 290;
const NAME_TYPE_MIN = 16;
const NAME_TYPE_MAX = 22;
const NAME_HOLD = 24;
const NAME_EXIT = 12;

export const NAME_PUSH = 1.4;
export const NAME_GROW_SECONDS = (NAME_TYPE_MAX + NAME_HOLD) / FPS;
export const WORD_GROW_SECONDS = (BEATS.glitch.exit.from - BEATS.glitch.enter.from) / FPS;

export type NameTiming = { type: number };

const within = (value: number, low: number, high: number) =>
  Math.round(Math.min(high, Math.max(low, value)));

export const nameTiming = (glyphs: number): NameTiming => ({
  type: within(8 + glyphs * 1.2, NAME_TYPE_MIN, NAME_TYPE_MAX),
});

export const nameBeat = ({ type }: NameTiming): WordBeat => {
  const typed = NAME_START + type;
  return beat(NAME_START, typed, typed + NAME_HOLD, typed + NAME_HOLD + NAME_EXIT);
};

export const tailAdvance = ({ type }: NameTiming) => NAME_TYPE_MAX - type;

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const accelerate = Easing.bezier(0.7, 0, 0.84, 0);
export const glide = Easing.bezier(0.4, 0.15, 0.6, 0.85);

const EXIT_FADE = 1.35;

export const exitAlpha = (exit: number) =>
  0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, exit * EXIT_FADE));

export const progress = (frame: number, span: Span) =>
  clamp01((frame - span.from) / Math.max(1, span.to - span.from));

export const eased = (frame: number, span: Span, curve: (t: number) => number = smooth) =>
  curve(progress(frame, span));

export type WordState = { visible: boolean; enter: number; exit: number; seconds: number };

export const wordState = (frame: number, word: WordBeat): WordState => ({
  visible: frame >= word.enter.from && frame < word.exit.to,
  enter: progress(frame, word.enter),
  exit: progress(frame, word.exit),
  seconds: Math.max(0, frame - word.enter.from) / FPS,
});
