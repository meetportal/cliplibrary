import { Easing } from 'remotion';
import type { CtaEndCardProps } from '@/schemas';

export const ENTRANCE = 26;
const UNDERLINE_SPEED = 24;
const EXIT = 14;
const SHEEN_SWEEP = 40;
const SHEEN_PERIOD = 44;

const settle = Easing.bezier(0.25, 0.8, 0.35, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const progress = (frame: number, start: number, frames: number) =>
  Math.max(0, Math.min(1, (frame - start) / frames));

const STEP = 2;

export const pixelTween = (frame: number, from: number, start: number, frames: number): number => {
  const distance = Math.round(Math.abs(from) / STEP);
  if (distance === 0 || frame <= start) {
    return Math.sign(from) * distance * STEP;
  }
  const at = (step: number) => Math.abs(from) * (1 - settle(progress(step, start, frames)));
  let travelled = 0;
  for (let step = Math.floor(start) + 1; step <= frame && travelled < distance; step++) {
    const ideal = Math.abs(at(step) - at(step - 1)) / STEP;
    travelled = Math.min(distance, travelled + Math.max(1, Math.round(ideal)));
  }
  return Math.sign(from) * (distance - travelled) * STEP;
};

export type Beats = ReturnType<typeof buildBeats>;

export const buildBeats = (motion: CtaEndCardProps['motion'], duration: number) => {
  const start = motion.start;
  const k = motion.stagger;
  const head = [start, start + k, start + 2 * k];
  const tagline = start + 3 * k + 4;
  const primary = start + 4 * k + 4;
  const secondary = primary + Math.round(k * 0.8);
  const website = start + 6 * k + 4;
  const underline = start + 2 * k + 10;
  const exitStart = motion.exit ? duration - EXIT : duration;
  return { head, tagline, primary, secondary, website, underline, exitStart, duration };
};

export const exitFade = (frame: number, beats: Beats) =>
  beats.exitStart >= beats.duration
    ? 1
    : 1 - smooth(progress(frame, beats.exitStart, beats.duration - 1 - beats.exitStart));

const FADE = 16;

export const enter = (frame: number, start: number) =>
  Easing.out(Easing.quad)(progress(frame, start, FADE));

export const underlineDraw = (frame: number, beats: Beats, length: number) => {
  const frames = Math.max(16, Math.min(44, Math.round(length / UNDERLINE_SPEED)));
  const t = progress(frame, beats.underline, frames);
  return 0.65 * smooth(t) + 0.35 * t;
};

export const sheenAt = (frame: number, beats: Beats): number | null => {
  const from = beats.website + 10;
  if (frame < from || frame > beats.exitStart - 4) {
    return null;
  }
  const local = (frame - from) % SHEEN_PERIOD;
  if (local > SHEEN_SWEEP) {
    return null;
  }
  const t = local / SHEEN_SWEEP;
  return -0.4 + 1.35 * (0.4 * smooth(t) + 0.6 * t);
};
