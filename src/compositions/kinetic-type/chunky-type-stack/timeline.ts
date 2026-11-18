import { Easing, interpolate } from 'remotion';

type Window = { from: number; to: number };

export type StackTimeline = {
  nameOut: Window[];
  nameUnderlineOut: Window;
  typeIn: Window[][];
  underlineIn: Window;
  exit: Window[][];
  underlineOut: Window;
  amp: Window;
  nameIn: Window[];
  nameUnderlineIn: Window;
  settled: number;
};

const TYPE_START = 10;
const LINE_SLOTS = 2;
const MAX_TYPE_STEP = 6;
const NAME_OUT_START = 2;
const SETTLE_LEAD = 50;
const EXIT_LINE_GAP = 4;
const EXIT_SPAN = 10;
const SHRINK_FRAMES = 10;
const NAME_SHRINK_FRAMES = 16;
const AMP_OVERLAP = 6;
const AMP_FRAMES = 24;
const NAME_LAG = 23;
const NAME_STEP = 10;
const UNDERLINE_LAG = 4;
const UNDERLINE_FRAMES = 22;
const NAME_UNDERLINE_FRAMES = 16;

const spread = (count: number, start: number, step: number, length: number): Window[] =>
  Array.from({ length: count }, (_, at) => ({
    from: start + at * step,
    to: start + at * step + length,
  }));

const trailing = (start: number, typed: number, length: number): Window => ({
  from: start + UNDERLINE_LAG,
  to: Math.max(start + UNDERLINE_LAG + length, typed + 6),
});

const retractFrames = (width: number) => Math.min(30, Math.max(14, width / 40));

const sweepFrames = (width: number) => Math.min(40, Math.max(14, width / 30));

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
  const typeStep = Math.min(MAX_TYPE_STEP, typeFrames / Math.max(1, slots));
  let slot = 0;
  const typeIn = counts.map((count) => {
    const windows = spread(count, TYPE_START + slot * typeStep, typeStep, popFrames);
    slot += count + LINE_SLOTS;
    return windows;
  });
  const typed = lastStart(typeIn.flat(), TYPE_START) + popFrames * 0.6;
  const lastLineStart = typeIn.at(-1)?.[0]?.from ?? TYPE_START;
  const underlineIn = trailing(lastLineStart, typed, UNDERLINE_FRAMES);
  const closing = (start: number) => {
    const exit = counts.map((count, line) =>
      spread(
        count,
        start + line * EXIT_LINE_GAP,
        Math.min(1, EXIT_SPAN / Math.max(1, count)),
        SHRINK_FRAMES,
      ),
    );
    const lettersEnd = lastEnd(exit.flat(), start);
    const sweep = sweepFrames(bars.stack);
    const sweepFrom = Math.max(start, lettersEnd + 4 - sweep);
    const ampFrom = lettersEnd - AMP_OVERLAP;
    const nameStart = ampFrom + NAME_LAG;
    const nameIn = spread(
      nameCount,
      nameStart,
      Math.min(1, NAME_STEP / Math.max(1, nameCount)),
      popFrames,
    );
    const named = lastStart(nameIn, nameStart) + popFrames * 0.6;
    const nameUnderlineIn = trailing(nameStart, named, NAME_UNDERLINE_FRAMES);
    return {
      exit,
      underlineOut: { from: sweepFrom, to: sweepFrom + sweep },
      amp: { from: ampFrom, to: ampFrom + AMP_FRAMES },
      nameIn,
      nameUnderlineIn,
      settled: Math.max(lastEnd(nameIn, nameStart), nameUnderlineIn.to),
    };
  };
  const { exit, underlineOut, amp, nameIn, nameUnderlineIn, settled } = closing(
    Math.max(underlineIn.to, duration - SETTLE_LEAD - closing(0).settled),
  );
  return {
    nameOut: spread(
      nameCount,
      NAME_OUT_START,
      Math.min(1, 14 / Math.max(1, nameCount)),
      NAME_SHRINK_FRAMES,
    ),
    nameUnderlineOut: {
      from: NAME_OUT_START,
      to: NAME_OUT_START + retractFrames(bars.name),
    },
    typeIn,
    underlineIn,
    exit,
    underlineOut,
    amp,
    nameIn,
    nameUnderlineIn,
    settled: Math.min(duration - 1, settled),
  };
};

export const progress = (frame: number, window: Window, easing: (t: number) => number = (t) => t) =>
  interpolate(frame, [window.from, window.to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const EASE_IN_OUT = Easing.inOut(Easing.cubic);
export const EASE_POP = Easing.bezier(0.4, 0, 0.2, 1);
export const EASE_SINE = Easing.inOut(Easing.sin);
