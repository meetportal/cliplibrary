import type { WeddingItineraryPagesProps } from '@/schemas';
import { smooth, TAU, tween } from '../../promo/timing';
import { mixOklab } from './oklab';

type Timing = WeddingItineraryPagesProps['timing'];

export type TypedSlot = {
  text: string;
  start: number;
  end: number;
  last: boolean;
  groupStart: boolean;
};

const CARET_FADE = 3;

const CHAR_FADE = 6;

export const splitLines = (text: string): string[] =>
  text.split('\n').filter((line) => line.trim().length > 0);

export const pageArrival = (index: number, timing: Timing): number => index * timing.pageFrames;

export const pageLeave = (frame: number, index: number, count: number, timing: Timing): number => {
  if (index >= count - 1) {
    return 0;
  }
  const next = pageArrival(index + 1, timing);
  return tween(frame, [next, next + timing.transitionFrames * 0.8], [0, 1], smooth);
};

export const pageVisible = (
  frame: number,
  index: number,
  count: number,
  timing: Timing,
): boolean => {
  const arrive = pageArrival(index, timing);
  const gone = pageArrival(index + 1, timing) + timing.transitionFrames;
  return frame >= arrive - 1 && (index === count - 1 || frame <= gone + 1);
};

export const backgroundAt = (frame: number, colors: readonly string[], timing: Timing): string =>
  colors.reduce<string>((current, color, index) => {
    const previous = colors[index - 1];
    if (previous === undefined) {
      return color;
    }
    const arrive = pageArrival(index, timing);
    const mix = tween(frame, [arrive, arrive + timing.transitionFrames], [0, 1], smooth);
    if (mix <= 0) {
      return current;
    }
    return mix >= 1 ? color : mixOklab(previous, color, mix);
  }, colors[0] ?? '#ffffff');

export const typeSlots = (
  groups: readonly string[][],
  start: number,
  timing: Timing,
): TypedSlot[] => {
  const lines = groups.flatMap((group, groupIndex) =>
    group.map((text, index) => ({ text, groupStart: index === 0 && groupIndex > 0 })),
  );
  let cursor = start;
  return lines.map((line, index) => {
    const begin = cursor;
    const end = begin + Math.max(0, Array.from(line.text).length - 1) * timing.charFrames;
    cursor = end + timing.charFrames + timing.lineGap;
    return { ...line, start: begin, end, last: index === lines.length - 1 };
  });
};

export const charOpacity = (
  frame: number,
  slot: TypedSlot,
  index: number,
  timing: Timing,
): number => {
  const since = frame - slot.start - index * timing.charFrames;
  return since < 0 ? 0 : Math.min(1, (since + 1) / CHAR_FADE);
};

export const typedCount = (
  frame: number,
  slot: TypedSlot,
  length: number,
  timing: Timing,
): number =>
  frame < slot.start
    ? 0
    : Math.min(length, Math.floor((frame - slot.start) / timing.charFrames) + 1);

export const caretOpacity = (frame: number, slot: TypedSlot, timing: Timing): number => {
  const appear = tween(frame, [slot.start - CARET_FADE, slot.start], [0, 1], smooth);
  if (!slot.last) {
    const away = slot.end + timing.charFrames;
    return appear * tween(frame, [away, away + CARET_FADE], [1, 0], smooth);
  }
  const blink =
    frame <= slot.end ? 1 : 0.5 + 0.5 * Math.cos(((frame - slot.end) / timing.caretBlink) * TAU);
  const away = slot.end + timing.caretHold;
  return appear * blink * tween(frame, [away, away + CARET_FADE + 2], [1, 0], smooth);
};

export type StackItem = { height: number; gap: number };

export const stackTops = (items: readonly StackItem[], centerY: number): number[] => {
  const total = items.reduce(
    (sum, item, index) => sum + item.height + (index === 0 ? 0 : item.gap),
    0,
  );
  let cursor = Math.round(centerY - total / 2);
  return items.map((item, index) => {
    cursor += index === 0 ? 0 : item.gap;
    const top = cursor;
    cursor += item.height;
    return Math.round(top);
  });
};
