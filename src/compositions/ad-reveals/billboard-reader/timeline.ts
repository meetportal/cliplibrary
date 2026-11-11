import { Easing } from 'remotion';
import type { BillboardReaderProps } from '@/schemas';
import { clamp01, LAMP_XS, type Vec3 } from './layout';

const smooth = Easing.inOut(Easing.sin);

const START = { azimuth: -6, elevation: -10, distance: 54, targetY: -4 } as const;
const END_TARGET_Y = 5.2;
const DRIFT = 9;
const PEAK_AT = 0.33;
const START_SPEED = 0.15;
const END_SPEED = 0.85;

const rising = (t: number) =>
  START_SPEED * t +
  (1 - START_SPEED) * (t / 2 - (PEAK_AT / (2 * Math.PI)) * Math.sin((Math.PI * t) / PEAK_AT));

const falling = (t: number) => {
  const past = t - PEAK_AT;
  return past - (((1 - END_SPEED) / 2) * (past * past)) / (1 - PEAK_AT);
};

const travelled = (t: number) => (t <= PEAK_AT ? rising(t) : rising(PEAK_AT) + falling(t));

const move = (t: number) => travelled(t) / travelled(1);

export const endAzimuth = (camera: BillboardReaderProps['camera']) =>
  (START.azimuth + camera.orbit + DRIFT) * RAD;
const RAD = Math.PI / 180;

export type CameraPose = { position: Vec3; target: Vec3; fov: number };

export const cameraAt = (
  camera: BillboardReaderProps['camera'],
  frame: number,
  duration: number,
): CameraPose => {
  const t = clamp01(frame / Math.max(1, duration - 1));
  const p = move(t);
  const azimuth = (START.azimuth + camera.orbit * p + DRIFT * t) * RAD;
  const elevation = (START.elevation + (camera.rise - START.elevation) * p) * RAD;
  const distance = START.distance + (camera.endDistance - START.distance) * p;
  const targetY = START.targetY + (END_TARGET_Y - START.targetY) * p;
  const flat = distance * Math.cos(elevation);
  return {
    position: [flat * Math.sin(azimuth), distance * Math.sin(elevation), flat * Math.cos(azimuth)],
    target: [0.5 * p, targetY, 0],
    fov: camera.fieldOfView,
  };
};

export const lampLevels = (board: BillboardReaderProps['board'], frame: number): number[] =>
  LAMP_XS.map((_x, index) => smooth(clamp01((frame - board.lampsAt - index * 6) / 18)));

export const flipAt = (reader: BillboardReaderProps['reader'], frame: number): number =>
  clamp01((frame - reader.flipAt) / 30);

export const lowerAt = (reader: BillboardReaderProps['reader'], frame: number): number =>
  smooth(clamp01((frame - reader.flipAt - 48) / 30));
