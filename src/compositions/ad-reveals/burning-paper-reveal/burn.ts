import { Easing, interpolate } from 'remotion';
import type { BurningPaperRevealProps } from '@/schemas';

export const CARD = { width: 740, height: 540 } as const;
export const CARD_CENTER = { x: 556, y: 990 } as const;

const EDGE_STEP = 4;
const OVERRUN = 70;
const EASE_IN = 10;
const EASE_IN_FLOOR = 0.4;
const DIE_LEAD = 0.2;
const DIE_SECONDS = 4.2;
const CHAR_SECONDS = 1.5;
const PULL_TAIL = 3;
const CLIP_SLACK = 60;
const SMOLDER = 0.7;
const SMOLDER_SECONDS = 6;

type Burn = BurningPaperRevealProps['burn'];

export type BurnState = {
  front: number;
  intensity: number;
  dying: number;
  char: number;
  smoke: number;
};

const progress = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = (t) => t,
) =>
  interpolate(frame, [from, Math.max(from + 0.001, to)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

const sweepFrames = (burn: Burn, fps: number) => Math.max(1, Math.round(burn.sweepSeconds * fps));

const frontAt = (frame: number, burn: Burn, reach: number) => {
  const start = burn.startAt * CARD.width;
  const edge = CARD.width + Math.abs(burn.slant) / 2;
  const end = CARD.width + OVERRUN + Math.abs(burn.slant) / 2 + burn.jag * 34;
  const lead = EASE_IN * (1 + EASE_IN_FLOOR) * 0.5;
  const speed = Math.max(0, edge - start) / Math.max(1, reach - EASE_IN + lead);
  const f = Math.max(0, frame);
  if (f < EASE_IN) {
    return start + speed * (EASE_IN_FLOOR * f + ((1 - EASE_IN_FLOOR) * f * f) / (2 * EASE_IN));
  }
  if (f <= reach) {
    return start + speed * (lead + f - EASE_IN);
  }
  const stop = (2 * (end - edge)) / Math.max(speed, 0.01);
  const t = Math.min(f - reach, stop);
  return edge + speed * t - (speed * t * t) / (2 * stop);
};

export const burnAt = (frame: number, burn: Burn, fps: number): BurnState => {
  const reach = sweepFrames(burn, fps);
  const dying = progress(
    frame,
    reach - DIE_LEAD * fps,
    reach + DIE_SECONDS * fps,
    Easing.inOut(Easing.sin),
  );
  return {
    front: frontAt(frame, burn, reach),
    intensity: 1 - dying,
    dying,
    char: 1 - progress(frame, reach, reach + CHAR_SECONDS * fps, Easing.out(Easing.quad)),
    smoke: Math.max(
      1 - dying,
      SMOLDER * (1 - progress(frame, reach, reach + SMOLDER_SECONDS * fps)),
    ),
  };
};

export const cameraScale = (frame: number, pullBack: number, burn: Burn, fps: number) => {
  const end = sweepFrames(burn, fps) + PULL_TAIL * fps;
  return 1 + pullBack * (1 - progress(frame, 0, end, Easing.out(Easing.cubic)));
};

const BOTTOM_LEAD = 0.62;

export const tongueLife = (dying: number, bottomness: number) => {
  const start = (1 - bottomness) * BOTTOM_LEAD;
  const t = Math.max(0, Math.min(1, (dying - start) / (1 - BOTTOM_LEAD)));
  return 1 - t * t * (3 - 2 * t);
};

export const edgeX = (y: number, front: number, burn: Burn) =>
  front +
  burn.slant * (y / CARD.height - 0.5) +
  burn.jag *
    (15 * Math.sin(y * 0.031 + front * 0.004 + 0.7) +
      9 * Math.sin(y * 0.083 - front * 0.009 + 2.1) +
      4.5 * Math.sin(y * 0.19 + front * 0.017 + 4.4) +
      2 * Math.sin(y * 0.37 + front * 0.03 + 1.2));

export type Point = { x: number; y: number };

export const edgePoints = (front: number, burn: Burn): Point[] => {
  const points: Point[] = [];
  for (let y = 0; y <= CARD.height; y += EDGE_STEP) {
    points.push({ x: edgeX(y, front, burn), y });
  }
  if ((points.at(-1)?.y ?? 0) < CARD.height) {
    points.push({ x: edgeX(CARD.height, front, burn), y: CARD.height });
  }
  return points;
};

export const paperClip = (points: readonly Point[]) => {
  const right = points.map(
    (point) =>
      `${Math.max(0, Math.min(CARD.width + CLIP_SLACK, point.x)).toFixed(2)}px ${point.y}px`,
  );
  return `polygon(0px 0px, ${right.join(', ')}, 0px ${CARD.height}px)`;
};

export const wave = (t: number, seed: number) =>
  0.5 * Math.sin(t + seed) +
  0.3 * Math.sin(t * 2.17 + seed * 1.7) +
  0.2 * Math.sin(t * 3.71 + seed * 2.3);

export const hash = (value: number) => {
  const raw = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return raw - Math.floor(raw);
};
