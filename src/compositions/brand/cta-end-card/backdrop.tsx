import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mixLab } from '../../kit/lab-color';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

export const Backdrop = ({
  center,
  edge,
  width,
  height,
  focusY,
  phase,
  drift,
}: {
  center: string;
  edge: string;
  width: number;
  height: number;
  focusY: number;
  phase: number;
  drift: number;
}) => {
  const id = useId().replace(/:/g, '');
  const turn = phase * Math.PI * 2;
  const cx = width / 2 + Math.sin(turn) * width * 0.18 * drift;
  const cy = focusY + Math.sin(turn * 2) * height * 0.08 * drift;
  return (
    <AbsoluteFill style={{ backgroundColor: edge }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <radialGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            cx={cx}
            cy={cy}
            r={width * 0.6}
            gradientTransform={`translate(0 ${cy}) scale(1 0.74) translate(0 ${-cy})`}
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
