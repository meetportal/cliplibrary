import type { CSSProperties } from 'react';
import { Easing } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { pixelTween, progress, SHARD_FRAMES, SLICE_STAGGER, SLICES, settle } from './timeline';

export type Band = readonly [number, number];

export type Body = { ascent: number; inkTop: number; inkBottom: number; size: number };

export type Piece = {
  band: Band | null;
  pivot: { x: number; y: number };
  radius: number;
  turn: number;
  start: number;
  shard: Band | null;
};

const SLANT = Math.tan((-14 * Math.PI) / 180);
const CUTS = [0.36, 0.66] as const;
const FADE_IN = 6;

export const bandClip = ([from, to]: Band, body: Body, width: number, overlap: number) => {
  const inkTop = body.ascent - body.inkTop;
  const inkHeight = body.inkTop + body.inkBottom;
  const edge = (share: number, x: number) => inkTop + inkHeight * share + (x - width / 2) * SLANT;
  const points = [
    [0, edge(from, 0) - overlap],
    [width, edge(from, width) - overlap],
    [width, edge(to, width) + overlap],
    [0, edge(to, 0) + overlap],
  ] as const;
  return `polygon(${points.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(', ')})`;
};

const sliceBand = (index: number): Band => [
  index === 0 ? -3 : (CUTS[index - 1] ?? 0),
  index === SLICES - 1 ? 3 : (CUTS[index] ?? 1),
];

const shardBand = ([from, to]: Band): Band => [Math.max(from, -0.08), Math.min(to, 1.12)];

export const piecesFor = (
  letter: number,
  start: number,
  width: number,
  body: Body,
  build: ArcBurstWordmarkProps['build'],
  shards: boolean,
): Piece[] => {
  const turn = (build.swing * Math.PI) / 180;
  const centreX = width / 2;
  const baseline = body.ascent;
  if (build.style === 'swing') {
    return [
      {
        band: null,
        pivot: { x: centreX, y: baseline + body.size * 0.9 },
        radius: body.size * 1.25,
        turn: -turn,
        start,
        shard: shards ? [0.42, 1.12] : null,
      },
    ];
  }
  const side = letter % 2 === 0 ? 1 : -1;
  const tinted = letter % 3 === 2 ? 2 : 1;
  return Array.from({ length: SLICES }, (_, index) => {
    const below = index !== 1;
    const radius = body.size * (index === 1 ? 0.95 : 1.2 + index * 0.15);
    const band = sliceBand(index);
    return {
      band,
      pivot: {
        x: centreX,
        y: below ? baseline + radius * 0.8 : baseline - body.inkTop - radius * 0.6,
      },
      radius,
      turn: turn * side * (index === 1 ? -0.85 : 1 - index * 0.15),
      start: start + index * SLICE_STAGGER,
      shard: shards && index === tinted ? shardBand(band) : null,
    };
  });
};

export const motionStyle = (
  piece: Piece,
  frame: number,
  flight: number,
): { shown: number; style: CSSProperties } | null => {
  const shown = progress(frame, [piece.start, piece.start + FADE_IN], Easing.linear);
  if (shown <= 0) {
    return null;
  }
  const land = piece.start + flight;
  const travel = pixelTween(frame, [piece.start, land], [piece.radius * piece.turn, 0], settle);
  const angle = travel / piece.radius;
  return {
    shown,
    style: {
      opacity: shown,
      transformOrigin: `${piece.pivot.x.toFixed(2)}px ${piece.pivot.y.toFixed(2)}px`,
      transform: angle === 0 ? undefined : `rotate(${((angle * 180) / Math.PI).toFixed(3)}deg)`,
    },
  };
};

export const shardBandAt = (piece: Piece, frame: number, flight: number): Band | null => {
  if (piece.shard === null) {
    return null;
  }
  const land = piece.start + flight;
  const thin = progress(frame, [land - 3, land + SHARD_FRAMES - 3], Easing.linear);
  if (thin >= 1) {
    return null;
  }
  const [from, to] = piece.shard;
  const target = piece.band === null ? to : (from + to) / 2;
  return [from + (target - from) * thin, to + (target - to) * thin];
};
