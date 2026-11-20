import { AbsoluteFill } from 'remotion';

const SHAPES = [
  { x: -260, y: -330, size: 820, rotate: -12, dx: 0.55, dy: 0.2, spin: 0.036 },
  { x: 1470, y: -210, size: 660, rotate: 17, dx: -0.3, dy: 0.35, spin: -0.044 },
  { x: 220, y: 770, size: 600, rotate: 9, dx: 0.4, dy: -0.25, spin: 0.04 },
  { x: 1540, y: 720, size: 720, rotate: -7, dx: -0.45, dy: -0.15, spin: -0.032 },
] as const;

export const Backdrop = ({
  background,
  shape,
  frame,
  drift,
}: {
  background: string;
  shape: string;
  frame: number;
  drift: number;
}) => (
  <AbsoluteFill style={{ backgroundColor: background }}>
    {SHAPES.map((item) => (
      <div
        key={`${item.x}-${item.y}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: item.size,
          height: item.size,
          borderRadius: item.size * 0.26,
          backgroundColor: shape,
          transform: `translate(${item.x + item.dx * frame * drift}px, ${item.y + item.dy * frame * drift}px) rotate(${item.rotate + item.spin * frame * drift}deg)`,
        }}
      />
    ))}
  </AbsoluteFill>
);
