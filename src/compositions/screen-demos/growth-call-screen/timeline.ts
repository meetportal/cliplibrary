import { Easing } from 'remotion';
import type { GrowthCallScreenProps } from '@/schemas';

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

export type Span = { from: number; to: number };

export const progress = (frame: number, span: Span) =>
  span.to <= span.from
    ? Number(frame >= span.to)
    : Math.max(0, Math.min(1, (frame - span.from) / (span.to - span.from)));

export const ENTRANCE = {
  plate: { from: -12, to: 10 },
  name: { from: -8, to: 14 },
  lead: { from: -6, to: 16 },
  headline: { from: -4, to: 19 },
  trail: { from: -2, to: 21 },
  actions: { from: 0, to: 23 },
  bar: { from: 2, to: 25 },
} satisfies Record<string, Span>;

export const RISE = { name: 20, lines: 30, actions: 24, bar: 34, website: 14 };

const DURATION = 270;
const SHIMMER_START = 16;
const RIPPLE_START = 0;
const SWEEP_GAP = 4;
const MIN_SWEEP = 16;
const WEBSITE_LEAD = 4;
const WEBSITE_FRAMES = 18;
const GLOSS_DELAY = 12;
const TAIL_ROOM = 26;

export type Timeline = {
  every: number;
  sweep: number;
  answer: Span | null;
  website: Span | null;
  shimmerEnd: number;
  glossStart: number;
  rippleStart: number;
};

export const buildTimeline = (props: GrowthCallScreenProps): Timeline => {
  const every = Math.max(1, Math.round(props.shimmer.every));
  const sweep = Math.max(MIN_SWEEP, every - SWEEP_GAP);
  if (!props.answer.show) {
    return {
      every,
      sweep,
      answer: null,
      website: null,
      shimmerEnd: Number.POSITIVE_INFINITY,
      glossStart: Number.POSITIVE_INFINITY,
      rippleStart: RIPPLE_START,
    };
  }
  const from = Math.round(props.answer.at);
  const length = Math.max(
    1,
    Math.min(Math.round(props.answer.length), DURATION - TAIL_ROOM - from),
  );
  const to = from + length;
  return {
    every,
    sweep,
    answer: { from, to },
    website: { from: to - WEBSITE_LEAD, to: to - WEBSITE_LEAD + WEBSITE_FRAMES },
    shimmerEnd: from + 2,
    glossStart: to + GLOSS_DELAY,
    rippleStart: RIPPLE_START,
  };
};

export const shimmerAt = (frame: number, line: Timeline): number | null => {
  if (frame < SHIMMER_START) {
    return null;
  }
  const start = SHIMMER_START + Math.floor((frame - SHIMMER_START) / line.every) * line.every;
  if (start + line.sweep > line.shimmerEnd) {
    return null;
  }
  const t = (frame - start) / line.sweep;
  return t <= 1 ? t : null;
};

export const glossAt = (frame: number, line: Timeline): number | null => {
  if (frame < line.glossStart) {
    return null;
  }
  return ((frame - line.glossStart) % line.every) / line.every;
};

export const answered = (frame: number, line: Timeline) =>
  line.answer === null ? 0 : smooth(progress(frame, line.answer));
