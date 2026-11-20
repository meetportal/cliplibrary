import { Easing, interpolate } from 'remotion';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
export const glide = Easing.bezier(0.3, 0.5, 0.3, 1);
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const liftOff = Easing.in(Easing.sin);

export const progress = (
  frame: number,
  start: number,
  length: number,
  easing: (t: number) => number,
) =>
  interpolate(frame, [start, start + Math.max(1, length)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const TEXT_IN = 24;
export const TEXT_OUT = 14;
export const EXIT_FRAMES = 36;

export type Beat = { rise: number; textIn: number; textOut: number; exit: number };

export const INTRO = { tileIn: 0, tileInFrames: 34, nameIn: 6, nameOut: 50, tileOut: 52 };

export const FAN: Beat & { slide: number; slideFrames: number } = {
  rise: 56,
  textIn: 0,
  textOut: 0,
  exit: 136,
  slide: 70,
  slideFrames: 40,
};

export const FEATURE_1: Beat = { rise: 156, textIn: 178, textOut: 238, exit: 236 };

export const FEATURE_2: Beat = { rise: 256, textIn: 280, textOut: 334, exit: 332 };

export const END = { rise: 352, textIn: 366 };

export const END_TEXT_LEFT = 980;
