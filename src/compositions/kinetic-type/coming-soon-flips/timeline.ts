import { Easing, interpolate } from 'remotion';
import type { ComingSoonFlipsProps, FlipWord } from '@/schemas';

const MIN_FINALE = 90;

export const settle = Easing.bezier(0.25, 0.8, 0.35, 1);

const smooth = Easing.bezier(0.65, 0, 0.35, 1);

export type Cue =
  | { kind: 'word'; word: FlipWord; local: number; length: number }
  | { kind: 'flash' }
  | { kind: 'finale'; local: number; length: number };

const finaleStart = (props: ComingSoonFlipsProps, duration: number): number => {
  const words = props.words.reduce((sum, word) => sum + word.frames, 0);
  return Math.min(words + props.flashFrames, Math.max(0, duration - MIN_FINALE));
};

export const cueAt = (props: ComingSoonFlipsProps, frame: number, duration: number): Cue => {
  const finale = finaleStart(props, duration);
  if (frame >= finale) {
    return { kind: 'finale', local: frame - finale, length: duration - finale };
  }
  let at = 0;
  for (const word of props.words) {
    if (frame < at + word.frames) {
      return { kind: 'word', word, local: frame - at, length: word.frames };
    }
    at += word.frames;
  }
  return { kind: 'flash' };
};

const clamped = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export type LightPose = { shift: number; bloom: number; glow: number };

const OFF_WALL = 0;
const TURN_DIM = 8;
const GLOW_FROM = 4;
const GLOW_TO = 14;

export const lightPose = (
  light: ComingSoonFlipsProps['light'],
  axis: { before: number; after: number },
  local: number,
): LightPose => {
  const turnAt = Math.max(1, light.sweepFrames);
  const settleFrames = Math.max(1, light.settleFrames);
  const restAt = turnAt + settleFrames;
  const far = (axis.after + OFF_WALL) * light.swing;
  const glide = (t: number) => t + (1 - light.swing) * (Math.sin((t * Math.PI) / 2) - t);
  const forward = interpolate(local, [0, turnAt], [-axis.before, far], {
    ...clamped,
    easing: glide,
  });
  const backAt = (at: number) =>
    interpolate(at, [turnAt, restAt], [far, 0], { ...clamped, easing: Easing.inOut(Easing.sin) });
  const back = backAt(local);
  const bloom = interpolate(
    local,
    [turnAt + settleFrames * 0.45, restAt + settleFrames * 0.15],
    [0, 1],
    { ...clamped, easing: smooth },
  );
  const leaving = interpolate(local, [turnAt - TURN_DIM, turnAt], [1, 0], {
    ...clamped,
    easing: smooth,
  });
  const returning =
    local > turnAt + settleFrames / 2
      ? 1
      : interpolate(Math.abs(backAt(local + 1) - back), [GLOW_FROM, GLOW_TO], [0, 1], {
          ...clamped,
          easing: smooth,
        });
  const glow = light.swing < 1 ? 1 : local < turnAt ? leaving : returning;
  return { shift: local < turnAt ? forward : back, bloom, glow: light.swing < 1 ? 1 : glow };
};

export const hash = (...values: number[]): number => {
  let state = 2166136261;
  for (const value of values) {
    state ^= Math.floor(value * 997) + 0x9e3779b9;
    state = Math.imul(state, 16777619);
    state ^= state >>> 13;
    state = Math.imul(state, 0x5bd1e995);
    state ^= state >>> 15;
  }
  return (state >>> 0) / 4294967296;
};
