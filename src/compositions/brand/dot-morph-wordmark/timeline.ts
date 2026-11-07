import { Easing, interpolate } from 'remotion';
import type { DotMorphWordmarkProps } from '@/schemas';
import type { Wordmark } from './layout';

export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const settle = Easing.bezier(0.22, 0.9, 0.32, 1);

export const progress = (
  u: number,
  [from, to]: readonly [number, number],
  easing: (t: number) => number = smooth,
) =>
  interpolate(u, [from, Math.max(from + 0.001, to)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const POP = { stagger: 1.5, length: 12, lead: 3 } as const;
export const SWIRL = { end: 24, turn: (200 * Math.PI) / 180 } as const;
export const UNFOLD = { start: 12, blendEnd: 35, turnEnd: 41, scaleEnd: 38 } as const;
const ROW_SQUASH = { start: 34, stagger: 1.5 } as const;
const HOP = { start: 44, rise: 6, hang: 3, fall: 7 } as const;
const HOP_LENGTH = HOP.rise + HOP.hang + HOP.fall;
export const SQUASH_LENGTH = 8;
export const BLOOM = { lead: 2, stagger: 1.5, length: 12, melt: 3 } as const;
export const UNDERLINE = {
  spread: 8,
  letters: 4,
  stagger: 1.5,
  length: 12,
  fade: [6, 14],
  slide: [6, 13],
  lift: [8, 16],
  line: 0.1,
  gap: 0.1,
} as const;
const STOP_SETTLE = 10;
const LOGO = { delay: 4, length: 22 } as const;
const TIGHTEN_GAP = { bloom: 2, underline: -4 } as const;
const LAST_FRAME_MARGIN = 14;

type DotEvents = {
  rowSquash: number;
  takeoff: number;
  land: number;
};

export type Timeline = {
  start: number;
  factor: number;
  dots: DotEvents[];
  lettersDone: number;
  tightenStart: number;
  tightenEnd: number;
  logoStart: number;
  logoEnd: number;
  toFrame: (u: number) => number;
};

const groupEnd = (style: DotMorphWordmarkProps['morph']['style'], land: number, letters: number) =>
  style === 'bloom'
    ? land - BLOOM.lead + Math.max(0, letters - 1) * BLOOM.stagger + BLOOM.length
    : land + UNDERLINE.letters + Math.max(0, letters - 1) * UNDERLINE.stagger + UNDERLINE.length;

export const buildTimeline = (
  props: DotMorphWordmarkProps,
  wordmark: Wordmark,
  durationInFrames: number,
): Timeline => {
  const dots = wordmark.rowX.map((_, index) => {
    const takeoff = HOP.start + index * props.timing.stagger;
    return {
      rowSquash: ROW_SQUASH.start + index * ROW_SQUASH.stagger,
      takeoff,
      land: takeoff + HOP_LENGTH,
    };
  });
  const lettersDone = Math.max(
    ...dots.map((dot, index) =>
      groupEnd(props.morph.style, dot.land, wordmark.groups[index]?.size ?? 0),
    ),
  );
  const lastLand = dots.at(-1)?.land ?? HOP.start + HOP_LENGTH;
  const underline = props.morph.style === 'underline';
  const settleLength = underline ? UNDERLINE.lift[1] : STOP_SETTLE;
  const stopSettled = wordmark.stop === null ? lastLand : lastLand + settleLength;
  const linesDone = underline ? lastLand + UNDERLINE.fade[1] : 0;
  const tightenStart = Math.max(
    Math.max(lettersDone, stopSettled) + TIGHTEN_GAP[props.morph.style],
    linesDone,
  );
  const tightenEnd = tightenStart + props.timing.tighten;
  const logoStart = tightenStart + LOGO.delay;
  const logoEnd = logoStart + LOGO.length;
  const last = wordmark.logo === null ? tightenEnd : Math.max(tightenEnd, logoEnd);
  const start = props.timing.start;
  const room = durationInFrames - LAST_FRAME_MARGIN - start;
  const factor = Math.min(props.timing.pace, room / last);
  return {
    start,
    factor,
    dots,
    lettersDone,
    tightenStart,
    tightenEnd,
    logoStart,
    logoEnd,
    toFrame: (u: number) => start + u * factor,
  };
};

export const bump = (u: number, at: number, length: number = SQUASH_LENGTH) => {
  const t = (u - at) / length;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t) * (1 - t * 0.35);
};

const takeoffEase = Easing.bezier(0.5, 0.12, 0.3, 1);
const dropEase = Easing.bezier(0.55, 0, 0.8, 0.72);

const gentle = Easing.inOut(Easing.sin);
const ROW_HOLD = 0.6;
const CROUCH = 0.8;

const segment = (u: number, points: readonly (readonly [number, number])[]) => {
  for (let index = 1; index < points.length; index++) {
    const [from, start] = points[index - 1] ?? [0, 0];
    const [to, end] = points[index] ?? [0, 0];
    if (u < to) {
      return start + (end - start) * progress(u, [from, to], gentle);
    }
  }
  return points.at(-1)?.[1] ?? 0;
};

export const rowSquash = (u: number, landAt: number, takeoff: number) => {
  if (u <= landAt || u >= takeoff + 1.5) {
    return 0;
  }
  const peak = landAt + 6;
  if (u >= takeoff) {
    return CROUCH * (1 - (u - takeoff) / 1.5);
  }
  if (takeoff - peak < 8) {
    return segment(u, [
      [landAt, 0],
      [peak, 1],
      [takeoff, CROUCH],
    ]);
  }
  return segment(u, [
    [landAt, 0],
    [peak, 1],
    [peak + 4, ROW_HOLD],
    [takeoff - 4, ROW_HOLD],
    [takeoff, CROUCH],
  ]);
};

export const hopShape = (u: number, at: number) => {
  const t = u - at;
  if (t <= 0) {
    return { rise: 0, fall: 0 };
  }
  if (t < HOP.rise) {
    return { rise: takeoffEase(t / HOP.rise), fall: 0 };
  }
  const s = Math.min(1, (t - HOP.rise) / (HOP.hang + HOP.fall));
  return { rise: 1, fall: dropEase(s) };
};

export const hopTravel = (u: number, at: number) =>
  progress(u, [at + HOP.rise * 0.5, at + HOP_LENGTH]);

export const hopFall = (u: number, at: number) => progress(u, [at + HOP.rise, at + HOP_LENGTH]);
