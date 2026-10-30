import track from '@/footage/elevator-newspaper.track.json';
import { PLATE_STAMP } from '@/footage/footage-spec';
import type { Quad } from './homography';

export type TrackedFrame = {
  doors: readonly [number, number];
  left: Quad;
  right: Quad;
};

const quad = (points: number[][]): Quad => {
  const [p0, p1, p2, p3] = points.map(([x = 0, y = 0]) => [x, y] as const);
  if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined) {
    throw new Error('A tracked page needs four corners');
  }
  return [p0, p1, p2, p3];
};

const FRAMES: TrackedFrame[] = track.frames.map((frame) => ({
  doors: [frame.doors[0] ?? 0, frame.doors[1] ?? 0],
  left: quad(frame.left),
  right: quad(frame.right),
}));

export const PLATE = {
  src: 'footage/elevator-newspaper/plate.mp4',
  width: track.width,
  height: track.height,
  stampRows: PLATE_STAMP.rows,
  frames: FRAMES.length,
};

export const trackedFrame = (frame: number): TrackedFrame => {
  const index = Math.min(FRAMES.length - 1, Math.max(0, Math.round(frame)));
  const found = FRAMES[index];
  if (found === undefined) {
    throw new Error('The footage track is empty');
  }
  return found;
};
