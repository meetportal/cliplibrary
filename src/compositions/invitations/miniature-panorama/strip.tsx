import type { ReactNode } from 'react';
import type { Shade } from './palette';

export const FRAME_WIDTH = 1080;

export const FRAME_HEIGHT = 1920;

export type World = {
  frame: number;
  phase: number;
  shade: Shade;
  lights: number;
  pan: number;
  parallax: number;
};

export const layerOffset = (world: World, depth: number): number =>
  world.pan * Math.max(0, 1 + (depth - 1) * world.parallax);

export const Strip = ({
  offset,
  width,
  children,
}: {
  offset: number;
  width: number;
  children: ReactNode;
}) => {
  const shift = -(((offset % width) + width) % width);
  const copies = Math.ceil(FRAME_WIDTH / width) + 2;
  return (
    <g>
      {Array.from({ length: copies }, (_, index) => (
        <g key={index} transform={`translate(${(shift + (index - 1) * width).toFixed(3)} 0)`}>
          {children}
        </g>
      ))}
    </g>
  );
};

const GLOW_RINGS = [
  { radius: 1, opacity: 0.14 },
  { radius: 0.66, opacity: 0.2 },
  { radius: 0.38, opacity: 0.32 },
] as const;

export const Glow = ({
  x,
  y,
  radius,
  color,
  amount,
}: {
  x: number;
  y: number;
  radius: number;
  color: string;
  amount: number;
}) =>
  amount <= 0 ? null : (
    <g>
      {GLOW_RINGS.map((ring) => (
        <circle
          key={ring.radius}
          cx={x}
          cy={y}
          r={radius * ring.radius}
          fill={color}
          opacity={ring.opacity * amount}
        />
      ))}
    </g>
  );
