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

const GRAIN_TILE = 240;
const GRAIN_PAD = 80;
const BADGE_AREA = { x: -340, y: -240, width: 680, height: 480 };

export const ChalkGrain = (props: { id: string; grain: number; width: number; height: number }) => {
  const { id, grain } = props;
  const area = {
    x: -GRAIN_PAD,
    y: -GRAIN_PAD,
    width: props.width + GRAIN_PAD * 2,
    height: props.height + GRAIN_PAD * 2,
  };
  return (
    <>
      <filter
        id={`${id}-noise`}
        filterUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={GRAIN_TILE}
        height={GRAIN_TILE}
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.62"
          numOctaves={2}
          seed={5}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${-3.1 * grain} 0 0 0 ${1 + 1.45 * grain}`}
        />
      </filter>
      <pattern
        id={`${id}-tile`}
        patternUnits="userSpaceOnUse"
        width={GRAIN_TILE}
        height={GRAIN_TILE}
      >
        <rect width={GRAIN_TILE} height={GRAIN_TILE} filter={`url(#${id}-noise)`} />
      </pattern>
      <mask id={id} maskUnits="userSpaceOnUse" {...BADGE_AREA}>
        <rect {...BADGE_AREA} fill={`url(#${id}-tile)`} />
      </mask>
      <filter id={`${id}-rough`} filterUnits="userSpaceOnUse" {...area}>
        <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves={2} seed={5} />
        <feDisplacementMap
          in="SourceGraphic"
          scale={2 + 3 * grain}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </>
  );
};
