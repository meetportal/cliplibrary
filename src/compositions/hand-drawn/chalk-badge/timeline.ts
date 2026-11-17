import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';

export type BadgeState = {
  caption: number;
  write: number;
  swoosh: number;
  sparkles: [number, number];
  twinkle: number;
  lockupSettle: number;
  lockupExit: number;
  erase: number;
  swooshErase: number;
  sparkleErase: number;
  captionErase: number;
  dust: number;
  push: number;
};

const CAPTION_START = 0;
const CAPTION_FRAMES = 30;
const WRITE_START = 4;
const ERASE_FRAMES = 36;
const ERASE_TAIL = 3;
const SPARKLE_FRAMES = 14;
const LOCKUP_FRAMES = 22;
const WRITE_LEAD = 4;
export const LOCKUP_DROP = 18;

const smooth = Easing.inOut(Easing.sin);
const pop = Easing.inOut(Easing.cubic);

export const badgeState = (
  frame: number,
  duration: number,
  fps: number,
  writeSeconds: number,
  eraseAtEnd: boolean,
): BadgeState => {
  const writeFrames = Math.max(8, Math.round(writeSeconds * fps));
  const swooshStart = WRITE_START + Math.round(writeFrames * 0.32);
  const swooshEnd = swooshStart + Math.round(writeFrames * 1.03);
  const sparkleStart = swooshEnd - 11;
  const lockupStart = swooshEnd - 12;
  const eraseEnd = duration - ERASE_TAIL;
  const eraseStart = eraseEnd - ERASE_FRAMES;
  const erasing = (from: number, to: number, easing = smooth) =>
    eraseAtEnd ? ramp(frame, from, to, easing) : 0;
  return {
    caption: ramp(frame, CAPTION_START, CAPTION_START + CAPTION_FRAMES, smooth),
    write: ramp(frame, WRITE_START - WRITE_LEAD, WRITE_START + writeFrames, smooth),
    swoosh: ramp(frame, swooshStart, swooshEnd, smooth),
    sparkles: [
      ramp(frame, sparkleStart, sparkleStart + SPARKLE_FRAMES, pop),
      ramp(frame, sparkleStart + 4, sparkleStart + 4 + SPARKLE_FRAMES, pop),
    ],
    twinkle: ramp(frame, sparkleStart + 8, sparkleStart + 30, smooth),
    lockupSettle: 1 - ramp(frame, lockupStart, lockupStart + LOCKUP_FRAMES, smooth),
    lockupExit: erasing(eraseStart + 10, eraseStart + 32, pop),
    erase: erasing(eraseStart, eraseEnd),
    swooshErase: erasing(eraseStart + 2, eraseEnd),
    sparkleErase: erasing(eraseStart + 4, eraseStart + 30, pop),
    captionErase: erasing(eraseStart + 2, eraseEnd - 4),
    dust: ramp(frame, WRITE_START + 4, WRITE_START + 4 + writeFrames, smooth),
    push: ramp(frame, 0, duration - 1, smooth),
  };
};
