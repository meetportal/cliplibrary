import { withAlpha } from './palette';

export const Cursor = ({
  x,
  y,
  size,
  color,
  ring,
  opacity,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  ring: string;
  opacity: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity,
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`,
      boxShadow: `0 0 0 ${(size * 0.12).toFixed(2)}px ${withAlpha(ring, 0.85)}, 0 ${(size * 0.15).toFixed(2)}px ${(size * 0.4).toFixed(2)}px ${withAlpha(color, 0.3)}`,
    }}
  />
);
