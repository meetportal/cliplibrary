import { useId } from 'react';
import { mixLab, unitRgb } from './color';

type BoardProps = {
  width: number;
  height: number;
  board: string;
  edge: string;
  grid: string;
  gridSize: number;
  gridOpacity: number;
  smudge: number;
  light: { x: number; y: number };
};

const positions = (span: number, step: number) => {
  const first = (span / 2) % step;
  return Array.from(
    { length: Math.floor((span - first) / step) + 1 },
    (_, at) => first + at * step,
  );
};

const tint = (color: string, gain: number, offset: number) => {
  const [r, g, b] = unitRgb(color);
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${gain} 0 0 0 ${offset}`;
};

export const Board = (props: BoardProps) => {
  const id = useId().replace(/:/g, '');
  const { width, height, gridSize } = props;
  const columns = positions(width, gridSize);
  const rows = positions(height, gridSize);
  const light = mixLab(props.board, '#ffffff', 0.18);
  const dark = mixLab(props.edge, '#000000', 0.25);
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <radialGradient
          id={`${id}-glow`}
          gradientUnits="userSpaceOnUse"
          cx={props.light.x.toFixed(2)}
          cy={props.light.y.toFixed(2)}
          r={width * 0.72}
        >
          <stop offset="0" stopColor={props.board} />
          <stop offset="0.45" stopColor={mixLab(props.board, props.edge, 0.25)} />
          <stop offset="0.75" stopColor={mixLab(props.board, props.edge, 0.7)} />
          <stop offset="1" stopColor={props.edge} />
        </radialGradient>
        <filter id={`${id}-smudge`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0065" numOctaves={3} seed={7} />
          <feColorMatrix
            type="matrix"
            values={tint(light, 2.2 * props.smudge, -1.05 * props.smudge)}
          />
        </filter>
        <filter id={`${id}-shade`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.0035" numOctaves={2} seed={19} />
          <feColorMatrix
            type="matrix"
            values={tint(dark, 2 * props.smudge, -0.95 * props.smudge)}
          />
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#${id}-glow)`} />
      <g opacity={0.32}>
        <rect width={width} height={height} filter={`url(#${id}-smudge)`} />
      </g>
      <g opacity={0.45}>
        <rect width={width} height={height} filter={`url(#${id}-shade)`} />
      </g>
      <g opacity={props.gridOpacity}>
        <g stroke={props.grid} strokeWidth={1.5} opacity={0.55}>
          {columns.map((x) => (
            <line key={`c${x}`} x1={x} y1={0} x2={x} y2={height} />
          ))}
          {rows.map((y) => (
            <line key={`r${y}`} x1={0} y1={y} x2={width} y2={y} />
          ))}
        </g>
        <g fill={mixLab(props.grid, '#ffffff', 0.2)}>
          {columns.flatMap((x) =>
            rows.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3} />),
          )}
        </g>
      </g>
    </svg>
  );
};
