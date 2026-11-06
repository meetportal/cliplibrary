import { wcagContrast } from 'culori';
import { Easing, interpolate } from 'remotion';
import type { ChevronMarkAssembleProps } from '@/schemas';
import type { PieceStyles } from './mark-layer';
import { BEATS } from './poses';

type Colors = ChevronMarkAssembleProps['colors'];

export const inkOn = (field: string, colors: Colors): string =>
  wcagContrast(colors.lightField, field) >= wcagContrast(colors.darkField, field)
    ? colors.lightField
    : colors.darkField;

const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const progress = (frame: number, start: number, frames: number, easing = smooth) =>
  interpolate(frame, [start, start + Math.max(1, frames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

const flipOver = (frame: number, start: number, frames = 10): number =>
  progress(frame, start, frames);

const keystoneOn = (field: string, colors: Colors): string =>
  wcagContrast(colors.primary, field) >= 1.25 ? colors.primary : inkOn(field, colors);

export const piecesOn = (field: string, colors: Colors): PieceStyles => {
  const ink = inkOn(field, colors);
  return {
    chevron: { ink, flip: 1 },
    first: { ink, flip: 1 },
    second: { ink, flip: 1 },
    keystone: keystoneOn(field, colors),
  };
};

export const turnedPieces = (
  frame: number,
  starts: { chevron: number; first: number; second: number },
  colors: Colors,
): PieceStyles => {
  const piece = (start: number) => {
    const turn = flipOver(frame, start);
    return {
      ink: inkOn(turn < 0.5 ? colors.lightField : colors.endField, colors),
      flip: Math.abs(Math.cos(Math.PI * turn)),
    };
  };
  const keystoneTurn = flipOver(frame, starts.second);
  return {
    chevron: piece(starts.chevron),
    first: piece(starts.first),
    second: piece(starts.second),
    keystone: keystoneOn(keystoneTurn < 0.5 ? colors.lightField : colors.endField, colors),
  };
};

export type Point = { x: number; y: number };

type Overlay = {
  color: string;
  opacity: number;
  iris: (Point & { radius: number }) | null;
};

export type FieldState = { base: string; overlay: Overlay | null };

const irisReach = (origin: Point, width: number, height: number): number =>
  1.02 * (Math.max(origin.x, width - origin.x) + Math.max(origin.y, height - origin.y));

type Step = {
  at: number;
  frames: number;
  style: 'snap' | 'fade' | 'diamond';
  to: string;
  origin: Point;
  seed: number;
};

export const fieldAt = (
  frame: number,
  props: ChevronMarkAssembleProps,
  origins: { first: Point; corner: Point; center: Point },
  size: { width: number; height: number },
): FieldState => {
  const { colors, flips, ending } = props;
  const steps: Step[] = [
    {
      at: BEATS.flipToDark,
      frames: flips.frames,
      style: flips.style,
      to: colors.darkField,
      origin: origins.first,
      seed: 0,
    },
    {
      at: BEATS.flipToLight,
      frames: flips.frames,
      style: flips.style,
      to: colors.lightField,
      origin: origins.corner,
      seed: 1.7 * props.mark.cell,
    },
    {
      at: BEATS.endStart,
      frames: ending.frames,
      style: ending.style,
      to: colors.endField,
      origin: origins.center,
      seed: 0,
    },
  ];
  let base = colors.lightField;
  let overlay: Overlay | null = null;
  for (const step of steps) {
    if (frame < step.at) {
      break;
    }
    const easing = step.style === 'diamond' ? Easing.bezier(0.5, 0, 0.75, 1) : smooth;
    const t = progress(frame, step.at, step.frames, easing);
    if (t >= 1) {
      base = step.to;
      overlay = null;
      continue;
    }
    overlay = {
      color: step.to,
      opacity: step.style === 'diamond' ? 1 : t,
      iris:
        step.style === 'diamond'
          ? {
              ...step.origin,
              radius: step.seed + t * (irisReach(step.origin, size.width, size.height) - step.seed),
            }
          : null,
    };
  }
  return { base, overlay };
};
