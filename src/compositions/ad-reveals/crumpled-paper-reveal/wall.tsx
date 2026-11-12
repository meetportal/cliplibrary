import { AbsoluteFill } from 'remotion';
import type { Palette } from './palette';

type Shape = readonly (readonly [number, number])[];

const WINDOW: Shape = [
  [-120, 1250],
  [1200, 1010],
  [1200, 1090],
  [245, 1267.3],
  [205, 1460.9],
  [1200, 1280],
  [1200, 2000],
  [-120, 2000],
  [-120, 1520],
  [125, 1475.5],
  [165, 1282.1],
  [-120, 1335],
];

const points = (shape: Shape, dx: number, dy: number) =>
  shape.map(([x, y]) => `${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}`).join(' ');

export const Wall = ({
  palette,
  width,
  height,
  phase,
  drift,
  strength,
}: {
  palette: Palette;
  width: number;
  height: number;
  phase: number;
  drift: number;
  strength: number;
}) => {
  const dx = 54 * drift * Math.sin(phase);
  const dy = 54 * drift * Math.cos(phase);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${palette.wallTop} 0%, ${palette.wallBottom} 100%)`,
      }}
    >
      <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polygon
          points={points(WINDOW, dx, dy)}
          fill={palette.windowShade}
          fillOpacity={strength}
        />
      </svg>
    </AbsoluteFill>
  );
};
