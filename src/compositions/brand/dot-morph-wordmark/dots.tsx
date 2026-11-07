import { Easing } from 'remotion';
import type { DotMorphWordmarkProps } from '@/schemas';
import type { Wordmark } from './layout';
import {
  BLOOM,
  bump,
  hopFall,
  hopShape,
  hopTravel,
  POP,
  progress,
  rowSquash,
  SQUASH_LENGTH,
  SWIRL,
  type Timeline,
  UNDERLINE,
  UNFOLD,
} from './timeline';

const TILT_START = (-75 * Math.PI) / 180;
const CLUSTER_SCALE = 1.3;
const LIFT = Easing.out(Easing.cubic);
const MELT = Easing.out(Easing.quad);
const STOP_LANDING = 1.2;
const STRETCH_SPEED = 0.32;
const SPLASH = Easing.out(Easing.cubic);
const SPREAD = Easing.inOut(Easing.quad);
const ROUND_UP = Easing.inOut(Easing.cubic);

export type Blob = {
  x: number;
  bottom: number;
  width: number;
  height: number;
  pill: boolean;
  opacity: number;
  followsStop: boolean;
};

export type Landing = { x: number; y: number; stop: boolean };

export const landingPoint = (
  index: number,
  wordmark: Wordmark,
  style: DotMorphWordmarkProps['morph']['style'],
): Landing => {
  const { stop, groups, baseline, landSize, capHeight, xHeight, dotCount } = wordmark;
  if (stop !== null && index === dotCount - 1) {
    return { x: stop.openX, y: baseline - stop.diameter * STOP_LANDING * 0.5, stop: true };
  }
  return {
    x: groups[index]?.center ?? wordmark.center.x,
    y: style === 'underline' ? baseline - landSize / 2 : baseline - (capHeight + xHeight) / 4,
    stop: false,
  };
};

export const isGradientDot = (index: number, count: number) => (count - 1 - index) % 2 === 0;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const clusterRadius = (count: number, size: number) =>
  count < 2 ? 0 : (0.56 * size * CLUSTER_SCALE) / Math.sin(Math.PI / count);

const linePoint = (index: number, u: number, wordmark: Wordmark) => {
  const { dotCount, dotSize, rowX, rowY, center } = wordmark;
  const rowSpacing = dotCount > 1 ? (rowX[1] ?? 0) - (rowX[0] ?? 0) : 0;
  const theta = lerp(TILT_START, 0, progress(u, [UNFOLD.start, UNFOLD.turnEnd]));
  const spacing = lerp(dotSize * 1.15, rowSpacing, progress(u, [UNFOLD.start, UNFOLD.blendEnd]));
  const y = lerp(center.y, rowY, progress(u, [UNFOLD.start, UNFOLD.turnEnd]));
  const offset = (index - (dotCount - 1) / 2) * spacing;
  return { x: center.x + offset * Math.cos(theta), y: y + offset * Math.sin(theta) };
};

const clusterAngle = (u: number, settleAngle: number) =>
  settleAngle - SWIRL.turn * (1 - progress(u, [0, SWIRL.end], Easing.out(Easing.cubic)));

export const bestClusterAngle = (wordmark: Wordmark) => {
  const { dotCount, dotSize, center } = wordmark;
  const radius = clusterRadius(dotCount, dotSize);
  const probe = UNFOLD.start + 8;
  let best = 0;
  let bestCost = Number.POSITIVE_INFINITY;
  for (let step = 0; step < 72; step++) {
    const angle = (step * Math.PI) / 36;
    let cost = 0;
    for (let index = 0; index < dotCount; index++) {
      const target = linePoint(index, probe, wordmark);
      const around = angle + (index * 2 * Math.PI) / dotCount;
      cost +=
        (center.x + radius * Math.cos(around) - target.x) ** 2 +
        (center.y + radius * Math.sin(around) - target.y) ** 2;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = angle;
    }
  }
  return best;
};

export const dotBlob = (
  index: number,
  u: number,
  wordmark: Wordmark,
  line: Timeline,
  props: DotMorphWordmarkProps,
  settleAngle: number,
): Blob | null => {
  const popAt = index * POP.stagger - POP.lead;
  if (u <= popAt) {
    return null;
  }
  const { dotCount, dotSize, landSize, groups } = wordmark;
  const events = line.dots[index];
  const group = groups[index];
  if (events === undefined || group === undefined) {
    return null;
  }
  const pop = progress(u, [popAt, popAt + POP.length], LIFT);
  const radius = clusterRadius(dotCount, dotSize);
  const around = clusterAngle(u, settleAngle) + (index * 2 * Math.PI) / dotCount;
  const cluster = {
    x: wordmark.center.x + radius * Math.cos(around),
    y: wordmark.center.y + radius * Math.sin(around),
  };
  const onLine = linePoint(index, u, wordmark);
  const blend = progress(u, [UNFOLD.start, UNFOLD.blendEnd]);
  const target = landingPoint(index, wordmark, props.morph.style);
  const travel = hopTravel(u, events.takeoff);
  const fall = hopFall(u, events.takeoff);
  const baseX = lerp(cluster.x, onLine.x, blend);
  const baseY = lerp(cluster.y, onLine.y, blend);
  const x = lerp(baseX, target.x, travel);
  const lift = props.dots.hop * dotSize;
  const offsetAt = (at: number) => {
    const shape = hopShape(at, events.takeoff);
    return -lift * shape.rise + (target.y - baseY + lift) * shape.fall;
  };
  const speed = Math.abs(offsetAt(u + 0.5) - offsetAt(u - 0.5));
  const grow = lerp(CLUSTER_SCALE, 1, progress(u, [UNFOLD.start, UNFOLD.scaleEnd]));
  const arrival =
    target.stop && wordmark.stop !== null ? wordmark.stop.diameter * STOP_LANDING : landSize;
  const size = lerp(dotSize * grow, arrival, fall) * pop;
  const centerY = baseY + offsetAt(u);
  const amount = props.dots.squash;
  const stretch = u < events.land ? Math.min(1, speed / (dotSize * STRETCH_SPEED)) : 0;
  const squash = amount * (rowSquash(u, events.rowSquash, events.takeoff) - stretch);
  const flying = { x, bottom: centerY + size / 2, size, squash };
  if (props.morph.style === 'bloom') {
    return bloomBlob(u, flying, events.land, target, wordmark, amount);
  }
  return underlineBlob(u, flying, events.land, target, wordmark, group);
};

type Flying = { x: number; bottom: number; size: number; squash: number };

const round = (x: number, bottom: number, size: number, q: number, opacity = 1): Blob => ({
  x,
  bottom,
  width: size * (1 + q),
  height: size * (1 - q),
  pill: false,
  opacity,
  followsStop: false,
});

const bloomBlob = (
  u: number,
  flying: Flying,
  land: number,
  target: Landing,
  wordmark: Wordmark,
  amount: number,
): Blob | null => {
  const q = flying.squash + amount * bump(u, land, SQUASH_LENGTH);
  if (target.stop) {
    const size = lerp(
      flying.size,
      wordmark.stop?.diameter ?? flying.size,
      progress(u, [land, land + SQUASH_LENGTH], SPLASH),
    );
    return { ...round(flying.x, flying.bottom, size, q), followsStop: true };
  }
  const melt = progress(u, [land - 2, land + BLOOM.melt], MELT);
  if (melt >= 1) {
    return null;
  }
  const size = flying.size * (1 - melt);
  const middle = flying.bottom - flying.size / 2;
  return round(flying.x, middle + size / 2, size, q * (1 - melt));
};

const underlineBlob = (
  u: number,
  flying: Flying,
  land: number,
  target: Landing,
  wordmark: Wordmark,
  group: Wordmark['groups'][number],
): Blob | null => {
  const spread = progress(u, [land - 2, land + UNDERLINE.spread + 1], SPREAD);
  if (spread <= 0) {
    return round(flying.x, flying.bottom, flying.size, flying.squash);
  }
  const pad = wordmark.capHeight * 0.06;
  const lineHeight = Math.max(6, wordmark.capHeight * UNDERLINE.line);
  const lineBottom = wordmark.baseline + wordmark.capHeight * UNDERLINE.gap + lineHeight;
  const height = lerp(flying.size, lineHeight, spread);
  const bottom = lerp(flying.bottom, lineBottom, spread);
  const dotLeft = flying.x - flying.size / 2;
  const dotRight = flying.x + flying.size / 2;
  if (target.stop && wordmark.stop !== null) {
    const { diameter } = wordmark.stop;
    const slide = progress(
      u,
      [land + UNDERLINE.slide[0], land + UNDERLINE.slide[1]],
      Easing.out(Easing.cubic),
    );
    const lift = progress(u, [land + UNDERLINE.lift[0], land + UNDERLINE.lift[1]], ROUND_UP);
    const left = lerp(lerp(dotLeft, group.left - pad, spread), flying.x - diameter / 2, slide);
    const right = lerp(dotRight, flying.x + diameter / 2, slide);
    const shown = lerp(height, diameter, lift);
    return {
      x: (left + right) / 2,
      bottom: lerp(bottom, wordmark.baseline, lift),
      width: Math.max(shown, right - left),
      height: shown,
      pill: true,
      opacity: 1,
      followsStop: true,
    };
  }
  const retract = progress(u, [land + UNDERLINE.fade[0], land + UNDERLINE.fade[1]]);
  if (retract >= 1) {
    return null;
  }
  const left = lerp(dotLeft, group.left - pad, spread);
  const right = lerp(dotRight, group.right + pad, spread);
  const span = (right - left) * (1 - retract);
  const shown = Math.min(height * (1 - retract * 0.6), span);
  return {
    x: (left + right) / 2,
    bottom: bottom - (height - shown) / 2,
    width: Math.max(shown, span),
    height: shown,
    pill: true,
    opacity: retract > 0.7 ? 1 - (retract - 0.7) / 0.3 : 1,
    followsStop: false,
  };
};

export const BlobView = ({ blob, fill }: { blob: Blob; fill: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: blob.width,
      height: blob.height,
      borderRadius: blob.pill ? blob.height / 2 : '50%',
      background: fill,
      opacity: blob.opacity < 1 ? blob.opacity : undefined,
      transform: `translate(${(blob.x - blob.width / 2).toFixed(2)}px, ${(blob.bottom - blob.height).toFixed(2)}px)`,
    }}
  />
);
