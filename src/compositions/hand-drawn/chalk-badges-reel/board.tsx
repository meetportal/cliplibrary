import { useId } from 'react';
import { mixOklab } from './color';

type ReelBoardProps = {
  width: number;
  height: number;
  board: string;
  edge: string;
  grid: string;
  gridSize: number;
  gridOpacity: number;
  smudge: number;
  light: { x: number; y: number };
  dustShift: number;
  shadeShift: number;
};

const lines = (span: number, step: number) => {
  const first = (span / 2) % step;
  return Array.from(
    { length: Math.floor((span - first) / step) + 1 },
    (_, at) => first + at * step,
  );
};

const tint = (color: string, gain: number, offset: number) => {
  const hex = color.slice(1, 7);
  const [r, g, b] = [0, 2, 4].map((at) =>
    (Number.parseInt(hex.slice(at, at + 2), 16) / 255).toFixed(4),
  );
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${gain.toFixed(3)} 0 0 0 ${offset.toFixed(3)}`;
};

export const ReelBoard = (props: ReelBoardProps) => {
  const id = useId().replace(/:/g, '');
  const { width, height } = props;
  const columns = lines(width, props.gridSize);
  const rows = lines(height, props.gridSize);
  const pad = Math.ceil(Math.max(Math.abs(props.dustShift), Math.abs(props.shadeShift) * 1.4)) + 4;
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
          r={width * 0.78}
        >
          <stop offset="0" stopColor={props.board} />
          <stop offset="0.4" stopColor={mixOklab(props.board, props.edge, 0.2)} />
          <stop offset="0.72" stopColor={mixOklab(props.board, props.edge, 0.64)} />
          <stop offset="1" stopColor={props.edge} />
        </radialGradient>
        <filter
          id={`${id}-dust`}
          filterUnits="userSpaceOnUse"
          x={-pad}
          y={0}
          width={width + pad * 2}
          height={height}
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.0065" numOctaves={3} seed={5} />
          <feColorMatrix
            type="matrix"
            values={tint(
              mixOklab(props.board, '#ffffff', 0.18),
              1.1 * props.smudge,
              -0.66 * props.smudge,
            )}
          />
        </filter>
        <filter
          id={`${id}-drift`}
          filterUnits="userSpaceOnUse"
          x={-pad}
          y={0}
          width={width + pad * 2}
          height={height}
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.0046 0.006" numOctaves={3} seed={41} />
          <feColorMatrix
            type="matrix"
            values={tint(
              mixOklab(props.board, '#ffffff', 0.18),
              1.1 * props.smudge,
              -0.66 * props.smudge,
            )}
          />
        </filter>
        <filter
          id={`${id}-shade`}
          filterUnits="userSpaceOnUse"
          x={-pad}
          y={0}
          width={width + pad * 2}
          height={height}
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.0034" numOctaves={2} seed={19} />
          <feColorMatrix
            type="matrix"
            values={tint(
              mixOklab(props.edge, '#000000', 0.2),
              1.3 * props.smudge,
              -0.7 * props.smudge,
            )}
          />
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#${id}-light)`} />
      {props.smudge > 0 ? (
        <>
          <g transform={`translate(${props.shadeShift.toFixed(3)} 0)`}>
            <rect x={-pad} width={width + pad * 2} height={height} filter={`url(#${id}-shade)`} />
          </g>
          <g transform={`translate(${(props.shadeShift * 1.4).toFixed(3)} 0)`}>
            <rect x={-pad} width={width + pad * 2} height={height} filter={`url(#${id}-drift)`} />
          </g>
          <g transform={`translate(${props.dustShift.toFixed(3)} 0)`}>
            <rect x={-pad} width={width + pad * 2} height={height} filter={`url(#${id}-dust)`} />
          </g>
        </>
      ) : null}
      {props.gridOpacity > 0 ? (
        <g stroke={props.grid} strokeWidth={1.5} opacity={props.gridOpacity}>
          {columns.map((x) => (
            <line key={`c${x}`} x1={x} y1={0} x2={x} y2={height} />
          ))}
          {rows.map((y) => (
            <line key={`r${y}`} x1={0} y1={y} x2={width} y2={y} />
          ))}
        </g>
      ) : null}
    </svg>
  );
};
