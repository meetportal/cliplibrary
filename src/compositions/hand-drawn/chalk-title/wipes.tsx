import type { CSSProperties, ReactNode } from 'react';
import { Fragment } from 'react';
import { lerp } from '../../kit/motion';
import type { Face } from './fonts';
import { type Piece, WIPE } from './layout';

const UNIT = Math.hypot(WIPE.x, WIPE.y);
const dx = WIPE.x / UNIT;
const dy = WIPE.y / UNIT;

export const WORD_SOFT = 1.3;
export const AMP_SOFT = 0.45;
const WRITE_MARGIN = 40;
export const PAD = 260;

export const softOf = (piece: Piece, share: number) =>
  Math.max(share * piece.size, 0.25 * (piece.span[1] - piece.span[0]));

export const writeEdge = (piece: Piece, soft: number, done: number) =>
  lerp(piece.span[0], piece.span[1] + soft + WRITE_MARGIN, done);

type Edge = { edge: number; soft: number; keep: 'before' | 'after' };
export type Edges = Record<string, Edge>;

const Wipe = (props: Edge & { id: string }) => (
  <linearGradient
    id={props.id}
    gradientUnits="userSpaceOnUse"
    x1={dx * (props.edge - props.soft)}
    y1={dy * (props.edge - props.soft)}
    x2={dx * props.edge}
    y2={dy * props.edge}
  >
    <stop offset="0" stopColor={props.keep === 'before' ? '#ffffff' : '#000000'} />
    <stop offset="1" stopColor={props.keep === 'before' ? '#000000' : '#ffffff'} />
  </linearGradient>
);

export const WipeDefs = (props: {
  prefix: string;
  edges: Edges;
  width: number;
  height: number;
}) => {
  const area = { x: -PAD, y: -PAD, width: props.width + 2 * PAD, height: props.height + 2 * PAD };
  return (
    <>
      {Object.entries(props.edges).map(([name, edge]) => (
        <Fragment key={name}>
          <Wipe id={`${props.prefix}-${name}-g`} {...edge} />
          <mask id={`${props.prefix}-${name}`} maskUnits="userSpaceOnUse" {...area}>
            <rect {...area} fill={`url(#${props.prefix}-${name}-g)`} />
          </mask>
        </Fragment>
      ))}
    </>
  );
};

export const faceStyle = (face: Face): CSSProperties => ({
  fontFamily: `"${face.family}"`,
  fontWeight: face.weight,
  fontStyle: face.style,
});

export type Written = {
  name: string;
  done: number;
  transform: string;
  grain: string;
  rough: string;
  content: ReactNode;
};

export const Ink = (props: { piece: Written; prefix: string }) =>
  props.piece.done <= 0 ? null : (
    <g transform={props.piece.transform}>
      <g filter={`url(#${props.piece.rough})`}>
        <g mask={`url(#${props.piece.grain})`}>
          <g mask={`url(#${props.prefix}-${props.piece.name})`}>{props.piece.content}</g>
        </g>
      </g>
    </g>
  );

export const grow = (
  piece: Piece,
  rise: number,
  lift: number,
  from: number,
  anchor: 'left' | 'center',
) => {
  const ax = anchor === 'left' ? piece.box.x0 : (piece.box.x0 + piece.box.x1) / 2;
  const ay = (piece.box.y0 + piece.box.y1) / 2;
  const scale = lerp(from, 1, rise);
  const down = (1 - rise) * lift * piece.size;
  return `translate(${ax.toFixed(3)} ${(ay + down).toFixed(3)}) scale(${scale.toFixed(5)}) translate(${(-ax).toFixed(3)} ${(-ay).toFixed(3)})`;
};
