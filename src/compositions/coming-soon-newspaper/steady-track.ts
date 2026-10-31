import type { FootageTrack, TrackFrame } from '../footage/footage-track';
import type { Quad } from '../footage/homography';
import { tween } from '../promo/timing';

const HOLD_SIGMA = 7;
const FOLD_SIGMA = 0.8;
const HOLD_ENDS = 88;
const FOLD_STARTS = 106;
const HOLD_MEDIAN_REACH = 12;

const sigmaAt = (index: number) =>
  tween(index, [HOLD_ENDS, FOLD_STARTS], [HOLD_SIGMA, FOLD_SIGMA], (progress) => progress);

const medianReachAt = (index: number) =>
  Math.round(
    tween(index, [HOLD_ENDS, FOLD_STARTS], [HOLD_MEDIAN_REACH, 0], (progress) => progress),
  );

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[middle] ?? 0)
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
};

const medianFrame = (frames: TrackFrame[], index: number, frame: TrackFrame): TrackFrame => {
  const reach = medianReachAt(index);
  const quads = Object.fromEntries(
    Object.keys(frame.quads).map((name) => {
      const window: Quad[] = [];
      for (let other = index - reach; other <= index + reach; other += 1) {
        const quad = frames[other]?.quads[name];
        if (quad !== undefined) {
          window.push(quad);
        }
      }
      const corner = (at: 0 | 1 | 2 | 3): readonly [number, number] => [
        median(window.map((sample) => sample[at][0])),
        median(window.map((sample) => sample[at][1])),
      ];
      const quad: Quad = [corner(0), corner(1), corner(2), corner(3)];
      return [name, quad];
    }),
  );
  return { ...frame, quads };
};

const averageQuad = (quads: { quad: Quad; weight: number }[]): Quad => {
  const total = quads.reduce((sum, entry) => sum + entry.weight, 0);
  const corner = (index: 0 | 1 | 2 | 3): readonly [number, number] => [
    quads.reduce((sum, entry) => sum + entry.quad[index][0] * entry.weight, 0) / total,
    quads.reduce((sum, entry) => sum + entry.quad[index][1] * entry.weight, 0) / total,
  ];
  return [corner(0), corner(1), corner(2), corner(3)];
};

const steadyFrame = (frames: TrackFrame[], index: number, frame: TrackFrame): TrackFrame => {
  const sigma = sigmaAt(index);
  const reach = Math.ceil(sigma * 3);
  const quads = Object.fromEntries(
    Object.keys(frame.quads).map((name) => {
      const window: { quad: Quad; weight: number }[] = [];
      for (let other = index - reach; other <= index + reach; other += 1) {
        const quad = frames[other]?.quads[name];
        if (quad !== undefined) {
          window.push({ quad, weight: Math.exp(-((other - index) ** 2) / (2 * sigma * sigma)) });
        }
      }
      return [name, averageQuad(window)];
    }),
  );
  return { ...frame, quads };
};

export const steadyTrack = (track: FootageTrack): FootageTrack => {
  const robust = track.frames.map((frame, index) => medianFrame(track.frames, index, frame));
  return {
    ...track,
    frames: robust.map((frame, index) => steadyFrame(robust, index, frame)),
  };
};
