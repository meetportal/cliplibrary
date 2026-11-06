import type { DotRingLogoRevealProps } from '@/schemas';
import {
  type Box,
  type Curve,
  curve,
  fitBox,
  lerpPoint,
  type Point,
  plateBox,
  ringPoint,
  ringStartAngle,
} from './geometry';
import { type NameMetrics, scaleMetrics } from './name-metrics';

const SIDE_MARGIN = 80;
const STOP_GAP = 0.06;
const MERGE_SHARE = 0.14;
const APEX_RISE = 230;
const FRAME_MARGIN = 80;
const MARK_CLEARANCE = 24;
const EDGE_CLEARANCE = 16;

export type Lockup = {
  center: Point;
  radius: number;
  thickness: number;
  circumference: number;
  logo: { width: number; height: number };
  shape: Box;
  name: NameMetrics & { size: number; left: number; baseline: number };
  stop: Point;
  stopRadius: number;
  slideStart: Point;
  apex: Point;
  waitPoint: Point;
  mergeDistance: number;
  exit: Curve;
  drop: Curve;
};

const markShape = (props: DotRingLogoRevealProps, logo: { width: number; height: number }): Box => {
  const { handoff } = props.ring;
  if (handoff === 'bloom') {
    return { ...logo, radius: 0 };
  }
  const box = plateBox(logo, props.logoBox.padding, props.logoBox.roundness);
  if (handoff === 'plate') {
    return box;
  }
  const outline = props.ring.frameThickness;
  return { width: box.width + outline, height: box.height + outline, radius: box.radius };
};

export const buildLockup = (
  props: DotRingLogoRevealProps,
  logoAspect: number | null,
  reference: NameMetrics,
  canvas: { width: number; height: number },
): Lockup => {
  const logo =
    logoAspect === null
      ? {
          width: Math.min(props.logoBox.width, props.logoBox.height),
          height: Math.min(props.logoBox.width, props.logoBox.height),
        }
      : fitBox(logoAspect, props.logoBox.width, props.logoBox.height);
  const shape = markShape(props, logo);
  const markHeight = props.ring.handoff === 'bloom' ? logo.height : shape.height;
  const referenceSize = 100;
  const referenceWidth = reference.width + (STOP_GAP + props.name.stopSize) * referenceSize;
  const maxWidth = canvas.width - 2 * SIDE_MARGIN;
  const size = Math.min(props.name.size, (referenceSize * maxWidth) / Math.max(1, referenceWidth));
  const metrics = scaleMetrics(reference, size);
  const stopRadius = (props.name.stopSize * size) / 2;
  const lineWidth = metrics.width + STOP_GAP * size + stopRadius * 2;
  const total = markHeight + props.name.gap + metrics.capTop;
  const top = Math.min(
    Math.max(FRAME_MARGIN, (canvas.height - total) / 2 + props.layout.offsetY),
    Math.max(FRAME_MARGIN, canvas.height - total - FRAME_MARGIN),
  );
  const center = { x: canvas.width / 2, y: top + markHeight / 2 };
  const baseline = top + markHeight + props.name.gap + metrics.capTop;
  const left = (canvas.width - lineWidth) / 2;
  const stop = { x: left + lineWidth - stopRadius, y: baseline - stopRadius };
  const radius = props.ring.size / 2;
  const markHalfWidth = Math.max(shape.width, props.ring.size + props.ring.thickness) / 2;
  const clearOfMark = canvas.width / 2 - markHalfWidth - stopRadius - MARK_CLEARANCE;
  const slideStart = {
    x: Math.max(stopRadius + EDGE_CLEARANCE, Math.min(left + stopRadius * 0.6, clearOfMark)),
    y: stop.y,
  };
  const thickness = props.ring.thickness;
  const ringTop = center.y - radius - thickness / 2;
  const shapeTop = center.y - shape.height / 2;
  const apex = {
    x: slideStart.x,
    y: Math.max(SIDE_MARGIN, Math.min(ringTop, shapeTop) - APEX_RISE),
  };
  const exitFrom = { x: center.x, y: center.y - radius };
  const exit = curve([
    exitFrom,
    { x: exitFrom.x - 0.3 * (exitFrom.x - apex.x), y: exitFrom.y - 0.85 * (exitFrom.y - apex.y) },
    { x: apex.x + 0.3 * (exitFrom.x - apex.x), y: apex.y },
    apex,
  ]);
  const drop = curve([
    apex,
    lerpPoint(apex, slideStart, 1 / 3),
    lerpPoint(apex, slideStart, 2 / 3),
    slideStart,
  ]);
  const circumference = 2 * Math.PI * radius;
  const mergeDistance = MERGE_SHARE * circumference;
  const merge = ringPoint(center, radius, mergeDistance);
  const angle = ringStartAngle - mergeDistance / radius;
  const waitPoint = {
    x: merge.x + Math.cos(angle) * 34 + Math.sin(angle) * 30,
    y: merge.y + Math.sin(angle) * 34 - Math.cos(angle) * 30,
  };
  return {
    center,
    radius,
    thickness,
    circumference,
    logo,
    shape,
    name: { ...metrics, size, left, baseline },
    stop,
    stopRadius,
    slideStart,
    apex,
    waitPoint,
    mergeDistance,
    exit,
    drop,
  };
};
