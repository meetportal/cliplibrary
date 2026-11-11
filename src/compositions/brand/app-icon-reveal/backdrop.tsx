import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mix } from './color';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

export const Backdrop = ({
  center,
  edge,
  width,
  height,
  focusY,
}: {
  center: string;
  edge: string;
  width: number;
  height: number;
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
            cx={width / 2}
            cy={focusY}
            r={width * 0.62}
            gradientTransform={`translate(0 ${focusY}) scale(1 0.78) translate(0 ${-focusY})`}
          >
            {STOPS.map((offset, index) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={mix(center, edge, index / (STOPS.length - 1))}
              />
            ))}
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
