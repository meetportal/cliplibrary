import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
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
  if (amount <= 0.02) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const top = center - span / 2;
  const slice = span / SLICES;
  const tick = Math.floor(frame);
  const rows = Array.from({ length: SLICES }, (_, index) => {
    const from = index === 0 ? 0 : top + index * slice;
    const to = index === SLICES - 1 ? height : top + (index + 1) * slice;
    const offset = Math.round((hash(index, tick, 17) - 0.5) * 2 * shift * amount);
    return { from, to, offset };
  });
  const scratches = Array.from({ length: 5 }, (_, index) => ({
    y: Math.round(top + hash(index, tick, 29) * span),
    x: Math.round((hash(index, tick, 31) - 0.5) * shift * 3),
    width: Math.round(shift * (1 + hash(index, tick, 37) * 3)),
  }));
  return (
    <AbsoluteFill>
      {rows.map((row) => (
        <AbsoluteFill
          key={row.from}
          style={{
            clipPath: `inset(${Math.max(0, row.from)}px 0 ${Math.max(0, height - row.to)}px 0)`,
            transform: `translateX(${row.offset}px)`,
          }}
        >
          {children}
        </AbsoluteFill>
      ))}
      {scratches.map((scratch) => (
        <div
          key={`${scratch.y}-${scratch.x}`}
          style={{
            position: 'absolute',
            left: `calc(50% + ${scratch.x - scratch.width / 2}px)`,
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
