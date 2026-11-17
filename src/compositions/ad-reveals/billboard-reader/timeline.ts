import { Easing } from 'remotion';
import type { BillboardReaderProps } from '@/schemas';
import { clamp01, LAMP_XS, type Vec3 } from './layout';

const smooth = Easing.inOut(Easing.sin);
const FLIP_FRAMES = 34;

const START = { azimuth: 0, elevation: -10, distance: 54, targetY: -4 } as const;
const END_TARGET_Y = 5.2;
const SPEED_KNOTS = [
  [0, 0.32],
  [0.18, 0.67],
  [0.89, 1.26],
  [1, 0.74],
] as const;

const travelled = (t: number) => {
  let total = 0;
  for (let index = 1; index < SPEED_KNOTS.length; index++) {
    const [from, speedFrom] = SPEED_KNOTS[index - 1] ?? [0, 0];
    const [to, speedTo] = SPEED_KNOTS[index] ?? [1, 0];
    const span = to - from;
    const u = clamp01((t - from) / span);
    total +=
      span *
      (speedFrom * u + (speedTo - speedFrom) * (u / 2 - Math.sin(Math.PI * u) / (2 * Math.PI)));
  }
  return total;
};

const move = (t: number) => travelled(t) / travelled(1);

export const endAzimuth = (camera: BillboardReaderProps['camera']) =>
  (START.azimuth + camera.orbit) * RAD;
const RAD = Math.PI / 180;

export type CameraPose = { position: Vec3; target: Vec3; fov: number };

export const cameraAt = (
  camera: BillboardReaderProps['camera'],
  frame: number,
  duration: number,
): CameraPose => {
  const t = clamp01(frame / Math.max(1, duration - 1));
  const p = move(t);
  const azimuth = (START.azimuth + camera.orbit * p) * RAD;
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
  clamp01((frame - reader.flipAt) / FLIP_FRAMES);

export const lowerAt = (reader: BillboardReaderProps['reader'], frame: number): number =>
  smooth(clamp01((frame - reader.flipAt - 48) / 30));
