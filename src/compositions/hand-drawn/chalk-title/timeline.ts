import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';

export type Window = { from: number; to: number };

export type TitleTimeline = {
  start: Window;
  amp: Window;
  end: Window;
  byline: Window;
  sparkles: Window[];
  twinkle: Window;
  erase: Window | null;
  smearFade: Window;
};

const FIRST = 2;
const ERASE_FRAMES = 26;
const ERASE_TAIL = 5;
const SPARKLE_FRAMES = 16;
const SETTLE = 6;

const WRITE_EASE = Easing.inOut(Easing.sin);
export const GROW_EASE = Easing.inOut(Easing.cubic);

export const buildTimeline = (
  duration: number,
  fps: number,
  writeSeconds: number,
  eraseAtEnd: boolean,
): TitleTimeline => {
  const write = Math.max(8, Math.round(writeSeconds * fps));
  const step = Math.round(0.85 * write);
  const start = { from: FIRST, to: FIRST + write };
  const amp = { from: start.from + step, to: start.from + step + write };
  const end = { from: amp.from + step, to: amp.from + step + write };
  const byline = { from: end.to - 3, to: end.to - 3 + Math.round(0.9 * write) };
  const sparkleStart = amp.to - 6;
  const sparkles = [3, 0, 6].map((delay) => ({
    from: sparkleStart + delay,
    to: sparkleStart + delay + SPARKLE_FRAMES,
  }));
  const eraseTo = duration - ERASE_TAIL;
  return {
    start,
    amp,
    end,
    byline,
    sparkles,
    twinkle: { from: sparkleStart + 8, to: sparkleStart + 8 + 40 },
    erase: eraseAtEnd ? { from: eraseTo - ERASE_FRAMES, to: eraseTo } : null,
    smearFade: { from: 0, to: start.to },
  };
};

export const progress = (frame: number, window: Window, easing = WRITE_EASE) =>
  ramp(frame, window.from, window.to, easing);

export const settle = (frame: number, window: Window) =>
  ramp(frame, window.from, window.to + SETTLE, GROW_EASE);

export const titleDrift = (frame: number, duration: number, amount: number) => {
  const turn = (2 * Math.PI * frame) / duration;
  return { x: amount * Math.sin(turn), y: -amount * Math.cos(turn) };
};
