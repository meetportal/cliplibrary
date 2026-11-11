import { useId } from 'react';
import { AbsoluteFill } from 'remotion';

const STOPS = [0, 0.05, 0.15, 0.3, 0.5, 0.7, 0.85, 0.95, 1];

const channels = (hex: string) =>
  [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16) || 0);

const mix = (from: string, to: string, amount: number) => {
  const start = channels(from);
  const end = channels(to);
  return `#${start
    .map((value, index) =>
      Math.round(value + ((end[index] ?? value) - value) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

export const Backdrop = ({
  center,
  edge,
  width,
  height,
  focusX,
  focusY,
}: {
  center: string;
  edge: string;
  width: number;
  height: number;
  focusX: number;
  focusY: number;
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <AbsoluteFill style={{ backgroundColor: edge }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <radialGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            cx={focusX}
            cy={focusY}
            r={width * 0.64}
            gradientTransform={`translate(0 ${focusY}) scale(1 0.74) translate(0 ${-focusY})`}
          >
            {STOPS.map((offset) => (
              <stop key={offset} offset={offset} stopColor={mix(center, edge, smooth(offset))} />
            ))}
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
