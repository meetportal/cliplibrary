import { useId } from 'react';

const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

export type GlowSpot = { x: number; y: number; radius: number; stretch: number; peak: number };

export const Glow = ({
  color,
  strength,
  spot,
}: {
  color: string;
  strength: number;
  spot: GlowSpot;
}) => {
  const id = useId().replace(/:/g, '');
  if (strength <= 0) {
    return null;
  }
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <radialGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          cx={spot.x}
          cy={spot.y}
          r={spot.radius}
          gradientTransform={`translate(${spot.x} ${spot.y}) scale(1 ${spot.stretch}) translate(${-spot.x} ${-spot.y})`}
        >
          {STOPS.map((offset) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={color}
              stopOpacity={Math.min(1, spot.peak * strength * (1 - offset) ** 2)}
            />
          ))}
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#${id})`} />
    </svg>
  );
};
