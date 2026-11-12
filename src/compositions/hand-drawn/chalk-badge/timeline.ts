import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';

export type BadgeState = {
  caption: number;
  write: number;
  swoosh: number;
  sparkles: [number, number];
  twinkle: number;
  lockup: number;
  erase: number;
  captionErase: number;
  dust: number;
  lockupRise: number;
};

const CAPTION_START = 2;
const CAPTION_FRAMES = 22;
const WRITE_START = 6;
const ERASE_FRAMES = 30;
const ERASE_TAIL = 3;
const RISE_STEPS = [4, 4, 2, 2, 2, 2];
const LOCKUP_RISE = RISE_STEPS.reduce((sum, step) => sum + step, 0);

const risen = (elapsed: number) =>
  RISE_STEPS.slice(0, Math.max(0, Math.min(RISE_STEPS.length, elapsed))).reduce(
    (sum, step) => sum + step,
    0,
  );

const smooth = Easing.inOut(Easing.sin);
const settle = Easing.out(Easing.cubic);
const landing = Easing.bezier(0.25, 0.6, 0.6, 0.9);

export const badgeState = (
  frame: number,
  duration: number,
  fps: number,
  writeSeconds: number,
  eraseAtEnd: boolean,
): BadgeState => {
  const writeFrames = Math.max(8, Math.round(writeSeconds * fps));
  const swooshStart = WRITE_START + Math.round(writeFrames * 0.5);
  const swooshEnd = swooshStart + Math.round(writeFrames * 0.95);
  const sparkleStart = swooshEnd - 8;
  const lockupStart = swooshEnd - 2;
  const eraseEnd = duration - ERASE_TAIL;
  const eraseStart = eraseEnd - ERASE_FRAMES;
  const erasing = (from: number, to: number) => (eraseAtEnd ? ramp(frame, from, to, smooth) : 0);
  return {
    caption: ramp(frame, CAPTION_START, CAPTION_START + CAPTION_FRAMES, Easing.linear),
    write: ramp(frame, WRITE_START, WRITE_START + writeFrames, smooth),
    swoosh: ramp(frame, swooshStart, swooshEnd, smooth),
    sparkles: [
      ramp(frame, sparkleStart, sparkleStart + 12, settle),
      ramp(frame, sparkleStart + 4, sparkleStart + 15, settle),
    ],
    twinkle: ramp(frame, sparkleStart + 8, sparkleStart + 30, smooth),
    lockup: ramp(frame, lockupStart, lockupStart + 16, landing),
    erase: erasing(eraseStart, eraseEnd),
    captionErase: erasing(eraseStart + 2, eraseEnd - 4),
    lockupRise: LOCKUP_RISE - risen(frame - lockupStart),
    dust: ramp(frame, WRITE_START + 4, WRITE_START + 4 + writeFrames, smooth),
  };
};
