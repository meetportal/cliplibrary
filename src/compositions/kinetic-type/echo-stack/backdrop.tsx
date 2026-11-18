import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mixLab } from '../../kit/lab-color';

const STOPS = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

export const Backdrop = ({
  center,
  edge,
  width,
  height,
}: {
  center: string;
  edge: string;
  width: number;
  height: number;
}) => {
  const id = useId().replace(/:/g, '');
  const radius = Math.hypot(width, height) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: edge }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <radialGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            cx={width / 2}
            cy={height / 2}
            r={radius}
          >
            {STOPS.map((offset) => (
              <stop key={offset} offset={offset} stopColor={mixLab(center, edge, smooth(offset))} />
            ))}
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
