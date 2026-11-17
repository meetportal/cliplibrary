import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ShredRows } from './line';
import { hash } from './noise';

const SLICES = 11;

export const Shred = ({
  amount,
  frame,
  center,
  span,
  height,
  shift,
  color,
  children,
}: {
  amount: number;
  frame: number;
  center: number;
  span: number;
  height: number;
  shift: number;
  color: string;
  children: ReactNode;
}) => {
  const active = amount > 0.02;
  const top = center - span / 2;
  const slice = span / SLICES;
  const tick = Math.floor(frame);
  const rows = Array.from({ length: active ? SLICES : 0 }, (_, index) => {
    const from = index === 0 ? 0 : top + index * slice;
    const to = index === SLICES - 1 ? height : top + (index + 1) * slice;
    const offset = (hash(index, tick, 17) - 0.5) * 2 * shift * amount;
    return { from, to, offset };
  });
  const scratches = Array.from({ length: active ? 5 : 0 }, (_, index) => ({
    y: top + hash(index, tick, 29) * span,
    x: (hash(index, tick, 31) - 0.5) * shift * 3,
    width: shift * (1 + hash(index, tick, 37) * 3),
  }));
  return (
    <AbsoluteFill>
      <ShredRows.Provider value={active ? rows : null}>{children}</ShredRows.Provider>
      {scratches.map((scratch) => (
        <div
          key={`${scratch.y}-${scratch.x}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${(scratch.x - scratch.width / 2).toFixed(2)}px)`,
            top: scratch.y,
            width: scratch.width,
            height: 2,
            backgroundColor: color,
            opacity: 0.55 * Math.min(1, amount),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
