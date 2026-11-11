import { Easing } from 'remotion';
import type { BrandingIsTickerProps } from '@/schemas';

export const settle = Easing.bezier(0.22, 0.9, 0.3, 1);
export const swell = Easing.bezier(0.65, 0, 0.35, 1);
const RUN_UP = 0.78;
const RUN_POWER = 4;
const LAND_POWER = 3;
const LAND_SPEED = LAND_POWER / (1 - RUN_UP);
const RUN_SHARE = LAND_SPEED / (RUN_POWER / RUN_UP + LAND_SPEED);

const runAndLand = (u: number) => {
  if (u <= RUN_UP) {
    return RUN_SHARE * (u / RUN_UP) ** RUN_POWER;
  }
  const t = (u - RUN_UP) / (1 - RUN_UP);
  return RUN_SHARE + (1 - RUN_SHARE) * (1 - (1 - t) ** LAND_POWER);
};

const END_LEAD = 18;
export const ENTRY_FRAMES = 22;
export const ENTRY_RISE = 40;

export type Timeline = {
  period: number;
  cycleEnd: number;
  growStart: number;
  growEnd: number;
  entryStart: number;
  stagger: number;
};

export const buildTimeline = (props: BrandingIsTickerProps, steps: number): Timeline => {
  const cycleEnd = props.ticker.cycleFrames;
  const growStart = cycleEnd + 2;
  const entryStart = cycleEnd + END_LEAD;
  const stagger = props.timing.stagger;
  return {
    period: cycleEnd / Math.max(1, steps),
    cycleEnd,
    growStart,
    growEnd: growStart + props.timing.transitionFrames,
    entryStart,
    stagger,
  };
};

const glide = (u: number, share: number) =>
  share * u + (1 - share) * runAndLand(Math.max(0, Math.min(1, u)));

export const tickerPosition = (frame: number, line: Timeline, share: number) => {
  const raw = frame / line.period;
  const step = Math.floor(raw);
  return { step, progress: glide(raw - step, share) };
};
