import { Easing } from 'remotion';
import type { DominoWordsProps } from '@/schemas';
import type { Domino } from './chain';
import { anglesAt, type Bounds, chainBounds, type Schedule, SETTLED_AFTER } from './timeline';

type Key = readonly [number, number];

const SMOOTH = 16;

const pullEase = Easing.inOut(Easing.sin);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const frontKeys = (chain: Domino[], schedule: Schedule): Key[] => {
  const first = chain[0]?.pivot ?? 0;
  const last = chain.at(-1);
  const keys: Key[] = [
    [0, first],
    [(schedule.starts[0] ?? 0) + SMOOTH, first],
  ];
  chain.forEach((domino, index) => {
    if (index > 0) {
      keys.push([(schedule.starts[index] ?? 0) + SMOOTH, domino.pivot]);
    }
  });
  if (last !== undefined && chain.length > 1) {
    keys.push([schedule.land + SMOOTH, last.pivot + last.length / 2]);
  }
  return keys;
};

const sample = (keys: Key[], frame: number): number => {
  const [firstFrame, firstValue] = keys[0] ?? [0, 0];
  if (frame <= firstFrame) {
    return firstValue;
  }
  for (let index = 1; index < keys.length; index++) {
    const [toFrame, toValue] = keys[index] ?? [0, 0];
    const [fromFrame, fromValue] = keys[index - 1] ?? [0, 0];
    if (frame <= toFrame) {
      const span = toFrame - fromFrame;
      return span <= 0 ? toValue : fromValue + ((toValue - fromValue) * (frame - fromFrame)) / span;
    }
  }
  return keys.at(-1)?.[1] ?? 0;
};

export const smoothFront = (keys: Key[], frame: number): number => {
  let total = 0;
  let count = 0;
  for (let outer = -SMOOTH; outer <= SMOOTH; outer++) {
    for (let inner = -SMOOTH; inner <= SMOOTH; inner++) {
      total += sample(keys, frame + outer + inner);
      count++;
    }
  }
  return total / count;
};

const TAIL = 120;
const PIXEL_STEP = 2;

const pixelFollow = (keys: Key[], until: number): number[] => {
  const ideal = Array.from({ length: until + 1 }, (_value, frame) => smoothFront(keys, frame));
  const start = ideal[0] ?? 0;
  const target = PIXEL_STEP * Math.round(((ideal[until] ?? start) - start) / PIXEL_STEP);
  const path = [start];
  let travelled = 0;
  for (let frame = 1; frame <= until; frame++) {
    const step = (ideal[frame] ?? 0) - (ideal[frame - 1] ?? 0);
    if (travelled < target) {
      travelled = Math.min(
        target,
        travelled + Math.max(PIXEL_STEP, PIXEL_STEP * Math.round(step / PIXEL_STEP)),
      );
    }
    path.push(start + travelled);
  }
  return path;
};

export type BallPath = { contactX: number; rollSpeed: number; restX: number };

const ROLL_OUT = 12;

const HALO: Record<DominoWordsProps['pusher']['style'], number> = {
  striped: 0.4,
  solid: 0.1,
  glow: 0.9,
};

export const ballAt = (
  ball: BallPath,
  pusher: DominoWordsProps['pusher'],
  hitAt: number,
  frame: number,
): number =>
  frame < hitAt
    ? ball.contactX - ball.rollSpeed * (hitAt - frame)
    : ball.contactX -
      pusher.rebound * ball.rollSpeed * ROLL_OUT * (1 - Math.exp(-(frame - hitAt) / ROLL_OUT));

export type CameraPlan = {
  keys: Key[];
  follow: number[];
  ball: BallPath;
  fit: Bounds;
  fitZoom: number;
  fitX: number;
  pullStart: number;
};

const followOffset = (camera: DominoWordsProps['camera'], width: number) =>
  PIXEL_STEP * Math.round(((0.5 - camera.frontAt) * width) / PIXEL_STEP);

export const planCamera = (
  chain: Domino[],
  schedule: Schedule,
  props: DominoWordsProps,
  width: number,
  standRoom: number,
): CameraPlan => {
  const { pusher, timing, camera } = props;
  const rest = anglesAt(chain, schedule, schedule.land + SETTLED_AFTER + 1, timing.settle);
  const chainFit = chainBounds(chain, rest);
  const keys = frontKeys(chain, schedule);
  const follow = pixelFollow(
    keys,
    Math.ceil(schedule.land + camera.pullDelay + camera.pullFrames + TAIL),
  );
  const first = chain[0];
  const contactX = (first?.pivot ?? 0) - (first?.thickness ?? 0) - pusher.radius;
  const startX = (follow[0] ?? 0) + followOffset(camera, width) - width / 2;
  const rollSpeed = Math.max(0, contactX - startX) / Math.max(1, timing.hitAt);
  const ball = { contactX, rollSpeed, restX: contactX - pusher.rebound * rollSpeed * ROLL_OUT };
  const ballEdge = ball.restX - pusher.radius * (1 + HALO[pusher.style]);
  const fit =
    pusher.show && first !== undefined
      ? { ...chainFit, minX: Math.min(chainFit.minX, ballEdge) }
      : chainFit;
  const span = Math.max(1, fit.maxX - fit.minX);
  const fitZoom = Math.min(
    1,
    (width - 2 * camera.margin) / span,
    standRoom / Math.max(1, fit.maxY),
  );
  return {
    keys,
    follow,
    ball,
    fit,
    fitZoom,
    fitX: (fit.minX + fit.maxX) / 2,
    pullStart: schedule.land + camera.pullDelay,
  };
};

export type CameraState = { x: number; zoom: number; pull: number };

const NO_ZOOM = 0.999;

const steppedPull = (from: number, to: number, frame: number, start: number, frames: number) => {
  const distance = PIXEL_STEP * Math.round(Math.abs(to - from) / PIXEL_STEP);
  const share = (at: number) => pullEase(clamp01((at - start) / frames));
  let travelled = 0;
  for (let at = Math.floor(start) + 1; at <= frame && travelled < distance; at++) {
    const ideal = distance * (share(at) - share(at - 1));
    travelled = Math.min(
      distance,
      travelled + Math.max(PIXEL_STEP, PIXEL_STEP * Math.round(ideal / PIXEL_STEP)),
    );
  }
  return from + Math.sign(to - from) * travelled;
};

export const cameraAt = (
  plan: CameraPlan,
  camera: DominoWordsProps['camera'],
  frame: number,
  width: number,
): CameraState => {
  const tracked =
    plan.follow[Math.min(plan.follow.length - 1, Math.max(0, Math.round(frame)))] ?? 0;
  const follow = tracked + followOffset(camera, width);
  const pull = pullEase(clamp01((frame - plan.pullStart) / camera.pullFrames));
  return {
    x:
      plan.fitZoom >= NO_ZOOM
        ? steppedPull(follow, plan.fitX, frame, plan.pullStart, camera.pullFrames)
        : follow + (plan.fitX - follow) * pull,
    zoom: plan.fitZoom ** pull,
    pull,
  };
};
