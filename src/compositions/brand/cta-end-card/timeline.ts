import { Easing } from 'remotion';
import type { CtaEndCardProps } from '@/schemas';

const RISE = 24;
const FADE = 18;
const UNDERLINE_SPEED = 24;
const EXIT = 14;
const SHEEN_SWEEP = 40;
const SHEEN_PERIOD = 44;
const PUSH_ROW = 1300;
const PUSH_BOOST = 2;
const PUSH_MARGIN = 120;
const PUSH_LEAD = 6;

const lift = Easing.bezier(0.45, 0, 0.25, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);
const glide = Easing.bezier(0.33, 0, 0.67, 1);

const progress = (frame: number, start: number, frames: number) =>
  Math.max(0, Math.min(1, (frame - start) / frames));

export type Beats = ReturnType<typeof buildBeats>;

export const buildBeats = (motion: CtaEndCardProps['motion'], duration: number) => {
  const start = motion.start;
  const k = motion.stagger;
  const head = [start, start + k, start + 2 * k];
  const tagline = start + 3 * k - 1;
  const primary = start + 4 * k;
  const secondary = primary + Math.round(k * 0.8);
  const website = start + 6 * k;
  const underline = start + 2 * k + 6;
  const exitStart = motion.exit ? duration - EXIT : duration;
  const settled = Math.min(
    duration - 2,
    Math.max(...head, tagline, secondary, website) + RISE - PUSH_LEAD,
  );
  return { head, tagline, primary, secondary, website, underline, exitStart, settled, duration };
};

export const exitFade = (frame: number, beats: Beats) =>
  beats.exitStart >= beats.duration
    ? 1
    : 1 - smooth(progress(frame, beats.exitStart, beats.duration - 1 - beats.exitStart));

export const enter = (frame: number, start: number) => smooth(progress(frame, start, FADE));

export const rise = (frame: number, distance: number, start: number) =>
  distance * (1 - lift(progress(frame, start, RISE)));

export const pushAmount = (push: number, cardWidth: number, width: number) => {
  const card = Math.max(1, cardWidth);
  const boost = Math.min(PUSH_BOOST, Math.max(1, PUSH_ROW / card));
  return Math.max(0, Math.min(push * boost, (width - PUSH_MARGIN) / card - 1));
};

export const pushScale = (frame: number, beats: Beats, amount: number) =>
  1 + amount * glide(progress(frame, beats.settled, beats.duration - 1 - beats.settled));

export const underlineDraw = (frame: number, beats: Beats, length: number) => {
  const frames = Math.max(18, Math.min(44, Math.round(length / UNDERLINE_SPEED)));
  return smooth(progress(frame, beats.underline, frames));
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
