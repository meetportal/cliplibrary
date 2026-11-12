import type { ReactNode } from 'react';
import { CARD } from './burn';

const PAD_X = 520;
const PAD_TOP = 1160;
const PAD_BOTTOM = 620;

export const FILTER_REGION = {
  x: -PAD_X,
  y: -PAD_TOP,
  width: CARD.width + PAD_X * 2,
  height: CARD.height + PAD_TOP + PAD_BOTTOM,
} as const;

export const Overlay = ({ children }: { children: ReactNode }) => {
  const width = CARD.width + PAD_X * 2;
  const height = CARD.height + PAD_TOP + PAD_BOTTOM;
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`${-PAD_X} ${-PAD_TOP} ${width} ${height}`}
      style={{ position: 'absolute', left: -PAD_X, top: -PAD_TOP, overflow: 'visible' }}
    >
      {children}
    </svg>
  );
};
