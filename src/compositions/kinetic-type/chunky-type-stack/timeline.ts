import { Easing, interpolate } from 'remotion';

export type Window = { from: number; to: number };

export type StackTimeline = {
  nameOut: Window[];
  nameUnderlineOut: Window;
  typeIn: Window[][];
  underlineIn: Window;
  exit: Window[][];
  underlineOut: Window;
  ampGrow: Window;
  ampShrink: Window;
  nameIn: Window[];
  nameUnderlineIn: Window;
};

const TYPE_START = 10;
const LINE_SLOTS = 3;
const EXIT_LEAD = 132;
const EXIT_LINE_GAP = 5;
const SHRINK_FRAMES = 8;
const AMP_HOLD = 6;

const spread = (count: number, start: number, step: number, length: number): Window[] =>
  Array.from({ length: count }, (_, at) => ({
    from: start + at * step,
    to: start + at * step + length,
  }));

const UNDERLINE_LAG = 4;
const UNDERLINE_FRAMES = 22;

const trailing = (start: number, typed: number): Window => ({
  from: start + UNDERLINE_LAG,
  to: Math.max(start + UNDERLINE_LAG + UNDERLINE_FRAMES, typed + 6),
});

const retractFrames = (width: number) => Math.min(30, Math.max(14, width / 55));

const lastStart = (windows: Window[], fallback: number) =>
  windows.reduce((latest, window) => Math.max(latest, window.from), fallback);

const lastEnd = (windows: Window[], fallback: number) =>
  windows.reduce((latest, window) => Math.max(latest, window.to), fallback);

export const buildTimeline = (
  counts: number[],
  nameCount: number,
  duration: number,
  typeFrames: number,
  popFrames: number,
  bars: { stack: number; name: number },
): StackTimeline => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const slots = total + LINE_SLOTS * Math.max(0, counts.length - 1);
  const typeStep = Math.min(1.8, typeFrames / Math.max(1, slots));
  let slot = 0;
  const typeIn = counts.map((count) => {
    const windows = spread(count, TYPE_START + slot * typeStep, typeStep, popFrames);
    slot += count + LINE_SLOTS;
    return windows;
  });
  const typed = lastStart(typeIn.flat(), TYPE_START) + popFrames * 0.6;
  const lastLineStart = typeIn.at(-1)?.[0]?.from ?? TYPE_START;
  const underlineIn = trailing(lastLineStart, typed);
  const exitAt = duration - EXIT_LEAD;
  const exit = counts.map((count, line) =>
    spread(
      count,
      exitAt + line * EXIT_LINE_GAP,
      Math.min(1, 12 / Math.max(1, count)),
      SHRINK_FRAMES,
    ),
  );
  const lastLineExit = exit.at(-1)?.[0]?.from ?? exitAt;
  const underlineOut = { from: lastLineExit + 1, to: lastLineExit + 1 + retractFrames(bars.stack) };
  const exitEnd = Math.max(lastEnd(exit.flat(), exitAt), underlineOut.to);
  const ampGrow = { from: exitEnd - 4, to: exitEnd + 8 };
  const ampShrink = { from: ampGrow.to + AMP_HOLD, to: ampGrow.to + AMP_HOLD + 9 };
  const nameStart = ampShrink.to - 2;
  const nameIn = spread(
    nameCount,
    nameStart,
    Math.min(1.5, 16 / Math.max(1, nameCount)),
    popFrames,
  );
  const named = lastStart(nameIn, nameStart) + popFrames * 0.6;
  return {
    nameOut: spread(nameCount, 0, Math.min(1, 14 / Math.max(1, nameCount)), SHRINK_FRAMES),
    nameUnderlineOut: { from: 1, to: 1 + retractFrames(bars.name) },
    typeIn,
    underlineIn,
    exit,
    underlineOut,
    ampGrow,
    ampShrink,
    nameIn,
    nameUnderlineIn: trailing(nameStart, named),
  };
};

export const progress = (frame: number, window: Window, easing: (t: number) => number = (t) => t) =>
  interpolate(frame, [window.from, window.to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const EASE_IN = Easing.in(Easing.cubic);
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);
export const EASE_SINE = Easing.inOut(Easing.sin);
