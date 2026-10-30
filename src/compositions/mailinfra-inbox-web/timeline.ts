import { Easing } from 'remotion';
import type { MailinfraInboxWebProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { fractionAtSpiral, type Point, spiralStartFraction, type WebGeometry } from './geometry';

export type Phases = {
  drop: number;
  runOut: [number, number];
  frame: [number, number];
  back: [number, number];
  radials: [number, number];
  spiral: [number, number];
  walkHome: [number, number];
  turns: [number, number, number][];
  envelopesAt: number;
  flight: number;
  stagger: number;
  countRange: [number, number];
  zoom: [number, number];
};

const DOWN = Math.PI / 2;

export const phasesFor = (props: MailinfraInboxWebProps): Phases => {
  const { timing, envelopes } = props;
  const drop = timing.dropFrames;
  const weave = timing.weaveFrames;
  const at = (share: number) => drop + weave * share;
  const envelopesAt = drop + weave - 14;
  const flight = envelopes.flightFrames;
  const stagger = envelopes.stagger;
  const count = Math.max(0, Math.round(envelopes.count));
  const firstLand = envelopesAt + flight;
  const lastLand = firstLand + Math.max(0, count - 1) * stagger;
  const countRange: [number, number] = [firstLand, Math.max(lastLand + 10, firstLand + 30)];
  const zoomStart = countRange[1] + timing.holdFrames;
  return {
    drop,
    runOut: [drop, at(0.12)],
    frame: [at(0.1), at(0.4)],
    back: [at(0.4), at(0.5)],
    radials: [at(0.46), at(0.66)],
    spiral: [at(0.66), at(1)],
    walkHome: [at(1) + 6, at(1) + 50],
    turns: [
      [at(0.28), at(0.4), Math.PI],
      [at(0.54), at(0.66), Math.PI],
      [at(1) - 8, at(1) + 8, Math.PI],
    ],
    envelopesAt,
    flight,
    stagger,
    countRange,
    zoom: [zoomStart, zoomStart + timing.zoomFrames],
  };
};

export const frameProgress = (frame: number, phases: Phases): number =>
  tween(frame, phases.frame, [0, 1], smooth);

export const framePassFrame = (fraction: number, phases: Phases): number => {
  let low = phases.frame[0];
  let high = phases.frame[1];
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (frameProgress(middle, phases) < fraction) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return (low + high) / 2;
};

export const spiralProgress = (frame: number, phases: Phases): number =>
  tween(frame, phases.spiral, [0, 1], smooth);

const dropStart = (props: MailinfraInboxWebProps): number =>
  -props.web.size * 0.55 - 540 / props.camera.startZoom - props.spider.size;

const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const HUB: Point = { x: 0, y: 0 };

const dropEase = Easing.bezier(0.3, 0.15, 0.35, 1);

export const spiderAt = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Point => {
  const bottom = web.frameStart;
  if (frame <= phases.runOut[1]) {
    return { x: 0, y: tween(frame, [0, phases.runOut[1]], [dropStart(props), bottom.y], dropEase) };
  }
  const inner = lerpPoint(HUB, bottom, spiralStartFraction);
  if (frame <= phases.spiral[0]) {
    return lerpPoint(bottom, inner, tween(frame, phases.back, [0, 1], smooth));
  }
  if (frame <= phases.walkHome[0]) {
    return lerpPoint(HUB, bottom, fractionAtSpiral(web, spiralProgress(frame, phases)));
  }
  const outer = lerpPoint(HUB, bottom, fractionAtSpiral(web, 1));
  return lerpPoint(outer, HUB, tween(frame, phases.walkHome, [0, 1], smooth));
};

export const spiderHeading = (frame: number, phases: Phases): number =>
  phases.turns.reduce(
    (heading, [from, to, amount]) => heading + tween(frame, [from, to], [0, amount], smooth),
    DOWN,
  );

export const gaitPhase = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): number => {
  let phase = 0;
  let previous = spiderAt(phases.drop, web, phases, props);
  for (let step = Math.floor(phases.drop) + 1; step <= frame; step++) {
    const point = spiderAt(step, web, phases, props);
    const travel =
      Math.hypot(point.x - previous.x, point.y - previous.y) / (props.spider.size * 0.12);
    const turning = Math.abs(spiderHeading(step, phases) - spiderHeading(step - 1, phases)) * 2.5;
    phase += Math.min(1.1, travel + turning);
    previous = point;
  }
  return phase;
};

export type Camera = { x: number; y: number; scale: number; blurY: number; blur: number };

const whip = Easing.bezier(0.6, 0, 0.25, 1);

const cameraBase = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Omit<Camera, 'blurY' | 'blur'> => {
  const { camera, wordmark } = props;
  const dropY = tween(frame, [phases.drop * 0.3, phases.drop], [-props.web.size * 0.55, 0], smooth);
  const followIn = tween(frame, [phases.drop, phases.runOut[1]], [0, 1], smooth);
  const followOut = tween(frame, [phases.back[0], phases.radials[1]], [0, 1], smooth);
  const weight = camera.follow * Math.max(0, followIn - followOut);
  let followX = 0;
  let followY = 0;
  if (weight > 0) {
    for (let offset = -10; offset <= 10; offset += 2) {
      const point = spiderAt(frame + offset, web, phases, props);
      followX += point.x / 11;
      followY += point.y / 11;
    }
  }
  const pull = tween(
    frame,
    [phases.drop, phases.spiral[1] + 10],
    [Math.log(camera.startZoom), Math.log(camera.webZoom)],
    smooth,
  );
  const zoomT = tween(frame, phases.zoom, [0, 1], whip);
  const endY = (540 - wordmark.hubY) / camera.endZoom;
  const drift = camera.drift * (1 - zoomT) * tween(frame, [0, phases.drop], [0, 1], smooth);
  return {
    x: followX * weight + Math.sin(frame / 90) * 10 * drift,
    y: dropY + followY * weight + endY * zoomT + Math.cos(frame / 120) * 7 * drift,
    scale: Math.exp(pull + (Math.log(camera.endZoom) - Math.log(camera.webZoom)) * zoomT),
  };
};

export const cameraAt = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Camera => {
  const now = cameraBase(frame, web, phases, props);
  const before = cameraBase(frame - 1, web, phases, props);
  const strength = props.camera.motionBlur;
  const vertical = Math.abs(now.y - before.y) * now.scale;
  const zoom = Math.abs(Math.log(now.scale) - Math.log(before.scale)) * 540;
  const dropping = frame <= phases.drop + 4 ? 1 : 0;
  return {
    ...now,
    blurY: Math.min(18, vertical * 0.22 * strength * dropping),
    blur: Math.min(14, zoom * 0.08 * strength),
  };
};
