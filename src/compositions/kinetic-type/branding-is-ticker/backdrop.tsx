import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mixOklab } from './ink';

const STOPS = [0, 0.1, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

export const Glow = ({
  center,
  edge,
  width,
  height,
  focusX,
  focusY,
  radius,
  opacity = 1,
}: {
  center: string;
  edge: string;
  width: number;
  height: number;
  focusX: number;
  focusY: number;
  radius: number;
  opacity?: number;
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <AbsoluteFill style={{ backgroundColor: edge, opacity }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <radialGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            cx={focusX}
            cy={focusY}
            r={radius}
            gradientTransform={`translate(0 ${focusY}) scale(1 1.25) translate(0 ${-focusY})`}
          >
            {STOPS.map((offset) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={mixOklab(center, edge, smooth(offset))}
              />
            ))}
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
