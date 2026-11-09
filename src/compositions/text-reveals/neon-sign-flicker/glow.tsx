import { useId } from 'react';
import type { LampGeometry } from './pendant-lamp';

const FALLOFF = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const useSvgId = (name: string) => `${name}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const WallGlow = ({
  center,
  radius,
  color,
  strength,
  frame,
}: {
  center: { x: number; y: number };
  radius: { x: number; y: number };
  color: string;
  strength: number;
  frame: { width: number; height: number };
}) => {
  const id = useSvgId('neon-wall-glow');
  return (
    <svg
      aria-hidden="true"
      width={frame.width}
      height={frame.height}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
          {FALLOFF.map((stop) => (
            <stop
              key={stop}
              offset={stop}
              stopColor={color}
              stopOpacity={0.5 + 0.5 * Math.cos(Math.PI * stop)}
            />
          ))}
        </radialGradient>
      </defs>
      <ellipse
        cx={center.x}
        cy={center.y}
        rx={radius.x}
        ry={radius.y}
        fill={`url(#${id})`}
        opacity={Math.max(0, Math.min(1, strength))}
      />
    </svg>
  );
};

const CONE_STOPS = [
  [0, 0.62],
  [0.18, 0.74],
  [0.42, 0.5],
  [0.66, 0.24],
  [0.86, 0.07],
  [1, 0],
];

export const LampLight = ({
  geometry,
  light,
  level,
}: {
  geometry: LampGeometry;
  light: string;
  level: number;
}) => {
  const coneId = useSvgId('neon-lamp-cone');
  const blurId = useSvgId('neon-lamp-blur');
  const spread = geometry.coneSpread;
  const mouth = geometry.shadeWidth * 0.42;
  const softness = spread * 0.12;
  const margin = softness * 3 + geometry.shadeWidth * 0.4;
  const shadeBottom = geometry.shadeTop + geometry.shadeWidth * 0.56;
  const top = shadeBottom - margin;
  const bulb = geometry.shadeWidth * 0.6;
  const shown = Math.max(0, Math.min(1, level));
  return (
    <svg
      aria-hidden="true"
      width={(spread + margin) * 2}
      height={geometry.coneLength + margin * 2}
      style={{ position: 'absolute', left: -spread - margin, top, opacity: shown }}
    >
      <defs>
        <linearGradient id={coneId} x1="0" x2="0" y1="0" y2="1">
          {CONE_STOPS.map(([stop = 0, amount = 0]) => (
            <stop key={stop} offset={stop} stopColor={light} stopOpacity={amount} />
          ))}
        </linearGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={softness} />
        </filter>
      </defs>
      <g transform={`translate(${spread + margin} ${margin - 4})`} filter={`url(#${blurId})`}>
        <polygon
          points={`${-mouth},0 ${mouth},0 ${spread},${geometry.coneLength} ${-spread},${geometry.coneLength}`}
          fill={`url(#${coneId})`}
        />
        <ellipse cx={0} cy={4} rx={bulb} ry={bulb * 0.32} fill={light} opacity={0.55} />
      </g>
    </svg>
  );
};
