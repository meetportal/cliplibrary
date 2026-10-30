import type { MailinfraSpiderDropProps } from '@/schemas';
import { land, launch, settle, smooth, tween } from '../promo/timing';

export type SpiderDropTimeline = {
  start: number;
  floorFrames: number;
  landingFrames: number;
  floors: number;
  landing: number;
  release: number;
  inserted: number;
  climbStart: number;
  climbEnd: number;
};

export const spiderDropTimeline = (props: MailinfraSpiderDropProps): SpiderDropTimeline => {
  const { drop, inbox, climb } = props;
  const floors = props.floors.length;
  const landing = drop.start + floors * drop.floorFrames + drop.landingFrames;
  const release = landing + inbox.releaseAfter;
  const climbStart = landing + Math.max(climb.delay, inbox.releaseAfter + 2);
  return {
    start: drop.start,
    floorFrames: drop.floorFrames,
    landingFrames: drop.landingFrames,
    floors,
    landing,
    release,
    inserted: release + inbox.slideFrames,
    climbStart,
    climbEnd: climbStart + climb.frames,
  };
};

const hermite = (u: number, startSlope: number, endSlope: number): number => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (u3 - 2 * u2 + u) * startSlope + (3 * u2 - 2 * u3) + (u3 - u2) * endSlope;
};

const cruise = (u: number, depth: number): number =>
  u - (depth * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);

const floorProgress = (props: MailinfraSpiderDropProps, t: number): number => {
  const line = spiderDropTimeline(props);
  const depth = props.drop.slowAtSigns;
  const passing = 1 - depth;
  const elapsed = t - line.start;
  if (elapsed <= 0) {
    return 0;
  }
  const lastFloorAt = line.floors * line.floorFrames;
  if (line.floors > 0 && elapsed < line.floorFrames) {
    return hermite(elapsed / line.floorFrames, 0, passing);
  }
  if (elapsed < lastFloorAt) {
    const index = Math.floor(elapsed / line.floorFrames);
    return index + cruise(elapsed / line.floorFrames - index, depth);
  }
  const startSlope = line.floors > 0 ? (passing * line.landingFrames) / line.floorFrames : 0;
  return land(
    elapsed,
    [lastFloorAt, lastFloorAt + line.landingFrames],
    [line.floors, line.floors + 1],
    1.5 / props.drop.floorGap,
    startSlope,
  );
};

export const cameraY = (props: MailinfraSpiderDropProps, t: number): number =>
  floorProgress(props, t) * props.drop.floorGap;

const passFrame = (props: MailinfraSpiderDropProps, floor: number): number =>
  props.drop.start + (floor + 1) * props.drop.floorFrames;

const envelopeHang = (size: number) => 66 * size;

const ENVELOPE_HEIGHT = 140;

const envelopeTopOffset = (props: MailinfraSpiderDropProps): number =>
  props.spider.show ? envelopeHang(props.spider.size) : 0;

const envelopeHeight = (props: MailinfraSpiderDropProps): number =>
  ENVELOPE_HEIGHT * props.spider.size;

const insertedEnvelopeTop = (props: MailinfraSpiderDropProps): number =>
  props.inbox.y - envelopeHeight(props) * 0.5;

const releasedEnvelopeTop = (props: MailinfraSpiderDropProps): number =>
  props.inbox.y - envelopeHeight(props) * 0.86;

export const spiderScreenY = (props: MailinfraSpiderDropProps, t: number): number => {
  const line = spiderDropTimeline(props);
  const { spider, drop } = props;
  const arrive = land(t, [0, Math.max(1, spider.arriveFrames)], [-520, spider.restY], 4);
  const bob =
    Math.sin((t - spider.arriveFrames) / 18) *
    spider.bob *
    tween(t, [spider.arriveFrames - 12, spider.arriveFrames + 12], [0, 1]);
  const lead = tween(
    t,
    [line.start - 4, line.start + 26],
    [0, drop.spiderY - spider.restY],
    smooth,
  );
  const lowered = releasedEnvelopeTop(props) - envelopeTopOffset(props);
  const lower = tween(
    t,
    [line.landing - line.landingFrames * 0.55, line.release],
    [0, lowered - drop.spiderY],
    smooth,
  );
  const settleBob = bob * (1 - tween(t, [line.start - 10, line.start + 10], [0, 1]));
  const lift = tween(t, [line.release, line.climbStart + 14], [0, -40], smooth);
  const climb = launch(t, [line.climbStart, line.climbEnd], [0, -lowered - 900], 1.5);
  return arrive + settleBob + lead + lower + lift + climb;
};

export const envelopeScreenTop = (props: MailinfraSpiderDropProps, t: number): number => {
  const line = spiderDropTimeline(props);
  if (t < line.release) {
    return spiderScreenY(props, t) + envelopeTopOffset(props);
  }
  return tween(
    t,
    [line.release, line.inserted],
    [releasedEnvelopeTop(props), insertedEnvelopeTop(props)],
    settle,
  );
};

export const spiderX = (props: MailinfraSpiderDropProps, t: number): number =>
  540 + Math.sin(t / 38) * props.spider.sway;

export const legCycle = (props: MailinfraSpiderDropProps, t: number): number => {
  const line = spiderDropTimeline(props);
  const climbing = tween(t, [line.climbStart, line.climbStart + 16], [0, 1], smooth);
  return Math.sin(t / 9) * 0.12 * (1 - climbing) + Math.sin(t * 0.5) * 0.8 * climbing;
};

export const holdsEnvelope = (props: MailinfraSpiderDropProps, t: number): number => {
  const line = spiderDropTimeline(props);
  return 1 - tween(t, [line.release - 2, line.release + 8], [0, 1], smooth);
};

export const signCenterY = (props: MailinfraSpiderDropProps, floor: number): number =>
  (floor + 1) * props.drop.floorGap + props.signs.y;

const brushFrame = (props: MailinfraSpiderDropProps, floor: number): number => {
  const target = signCenterY(props, floor) - props.drop.spiderY;
  let low = props.drop.start;
  let high = passFrame(props, floor) + props.drop.floorFrames;
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (cameraY(props, middle) < target) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return (low + high) / 2;
};

export const signSwing = (props: MailinfraSpiderDropProps, floor: number, t: number): number => {
  const hit = brushFrame(props, floor);
  const since = t - hit;
  if (since <= 0) {
    return 0;
  }
  const fade = 1 - tween(since, [0, 120], [0, 1], (x) => x);
  return Math.sin(since / 7.5) * Math.exp(-since / 38) * fade * props.signs.swing;
};
