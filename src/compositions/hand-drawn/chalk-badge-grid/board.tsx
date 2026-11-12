import { useId } from 'react';
import { mixOklab } from './color';

type GridBoardProps = {
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

const lines = (span: number, step: number) => {
  const first = (span / 2) % step;
  return Array.from(
    { length: Math.floor((span - first) / step) + 1 },
    (_, at) => first + at * step,
  );
};

const tinted = (color: string, gain: number, offset: number) => {
  const hex = color.slice(1, 7);
  const [r, g, b] = [0, 2, 4].map((at) =>
    (Number.parseInt(hex.slice(at, at + 2), 16) / 255).toFixed(4),
  );
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${gain} 0 0 0 ${offset}`;
};

export const GridBoard = (props: GridBoardProps) => {
  const id = useId().replace(/:/g, '');
  const { width, height } = props;
  const columns = lines(width, props.gridSize);
  const rows = lines(height, props.gridSize);
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
          id={`${id}-light`}
          gradientUnits="userSpaceOnUse"
          cx={props.light.x.toFixed(2)}
          cy={props.light.y.toFixed(2)}
          r={width * 0.74}
        >
          <stop offset="0" stopColor={props.board} />
          <stop offset="0.42" stopColor={mixOklab(props.board, props.edge, 0.22)} />
          <stop offset="0.74" stopColor={mixOklab(props.board, props.edge, 0.68)} />
          <stop offset="1" stopColor={props.edge} />
        </radialGradient>
        <filter id={`${id}-cloud`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.007" numOctaves={3} seed={11} />
          <feColorMatrix
            type="matrix"
            values={tinted(
              mixOklab(props.board, '#ffffff', 0.2),
              2.1 * props.smudge,
              -1 * props.smudge,
            )}
          />
        </filter>
        <filter id={`${id}-shade`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0052 0.0036"
            numOctaves={2}
            seed={23}
          />
          <feColorMatrix
            type="matrix"
            values={tinted(
              mixOklab(props.edge, '#000000', 0.25),
              2 * props.smudge,
              -0.95 * props.smudge,
            )}
          />
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#${id}-light)`} />
      <g opacity={0.3}>
        <rect width={width} height={height} filter={`url(#${id}-cloud)`} />
      </g>
      <g opacity={0.42}>
        <rect width={width} height={height} filter={`url(#${id}-shade)`} />
      </g>
      <g opacity={props.gridOpacity}>
        <g stroke={props.grid} strokeWidth={1.5} opacity={0.6}>
          {columns.map((x) => (
            <line key={`x${x}`} x1={x} y1={0} x2={x} y2={height} />
          ))}
          {rows.map((y) => (
            <line key={`y${y}`} x1={0} y1={y} x2={width} y2={y} />
          ))}
        </g>
        <g fill={mixOklab(props.grid, '#ffffff', 0.18)}>
          {columns.flatMap((x) =>
            rows.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} />),
          )}
        </g>
      </g>
    </svg>
  );
};

export const ChalkGrain = (props: { id: string; grain: number }) => (
  <filter id={props.id} x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves={2} seed={5} result="noise" />
    <feColorMatrix
      in="noise"
      type="matrix"
      values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${-3.1 * props.grain} 0 0 0 ${1 + 1.45 * props.grain}`}
      result="holes"
    />
    <feComposite in="SourceGraphic" in2="holes" operator="in" result="dusty" />
    <feDisplacementMap
      in="dusty"
      in2="noise"
      scale={2 + 3 * props.grain}
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
);
