import { Easing } from 'remotion';
import type { BrandingIsTickerProps } from '@/schemas';

export const swell = Easing.bezier(0.7, 0.12, 0.45, 1);
export const rise = Easing.bezier(0.3, 0, 0.2, 1);
const runUp = Easing.bezier(1, 0.035, 0.6, 0.986);

const GROW_DELAY = 2;
const HALF_FRAME = 0.5;
const LONGEST_STEP = 36;
const END_LEAD = 12;
export const ENTRY_FRAMES = 22;
export const ENTRY_RISE = 40;

export type Timeline = {
  steps: number;
  period: number;
  cycleEnd: number;
  growStart: number;
  growEnd: number;
  entryStart: number;
  stagger: number;
};

export const buildTimeline = (props: BrandingIsTickerProps, count: number): Timeline => {
  const cycleEnd = props.ticker.cycleFrames;
  const growStart = cycleEnd + GROW_DELAY;
  const words = Math.max(1, count);
  const steps = words * Math.max(1, Math.ceil(cycleEnd / LONGEST_STEP / words));
  return {
    steps,
    period: cycleEnd / steps,
    cycleEnd,
    growStart,
    growEnd: growStart + props.timing.transitionFrames,
    entryStart: cycleEnd + END_LEAD,
    stagger: props.timing.stagger,
  };
};

const glide = (u: number, share: number) => share * u + (1 - share) * runUp(u);

export const tickerPosition = (frame: number, line: Timeline, share: number) => {
  const raw = Math.max(0, Math.min(frame + HALF_FRAME, line.cycleEnd)) / line.period;
  const step = Math.floor(raw);
  return { step, progress: glide(raw - step, share) };
};
