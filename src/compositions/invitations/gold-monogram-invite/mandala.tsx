import { useId, useMemo } from 'react';
import type { MandalaPattern } from '@/schemas';
import type { GoldTones } from './color';
import { mandalaRings } from './patterns';
import { dashOf, ramp } from './timeline';

const SWEEP = 0.5;

const MARGIN = 1.12;

export type MandalaTiming = { start: number; gap: number; draw: number };

const progressOf = (ring: number, frame: number, timing: MandalaTiming) =>
  ramp(
    frame,
    timing.start + ring * timing.gap,
    timing.start + ring * timing.gap + timing.draw,
    (t) => t,
  );

const sweepOf = (count: number) => {
  if (count <= 1) {
    return 0;
  }
  return count <= 3 ? 0.2 : SWEEP;
};

const sine = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

const elementShare = (progress: number, index: number, count: number) => {
  const sweep = sweepOf(count);
  const lead = count <= 1 ? 0 : (index / (count - 1)) * sweep;
  return sine(Math.max(0, Math.min(1, (progress - lead) / (1 - sweep))));
};

export const sheenStops = (gold: GoldTones): [number, string][] => [
  [0, gold.deep],
  [0.18, gold.mid],
  [0.34, gold.light],
  [0.42, gold.highlight],
  [0.5, gold.light],
  [0.66, gold.mid],
  [0.82, gold.deep],
  [1, gold.mid],
];

export const Mandala = ({
  pattern,
  radius,
  withCore,
  center,
  frame,
  timing,
  angle,
  gold,
  lineWidth,
  mirror,
}: {
  pattern: MandalaPattern;
  radius: number;
  withCore: boolean;
  center: [number, number];
  frame: number;
  timing: MandalaTiming;
  angle: number;
  gold: GoldTones;
  lineWidth: number;
  mirror: boolean;
}) => {
  const id = `mandala${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const rings = useMemo(() => mandalaRings(pattern, radius, withCore), [pattern, radius, withCore]);
  const half = Math.ceil(radius * MARGIN);
  return (
    <svg
      aria-hidden="true"
      width={half * 2}
      height={half * 2}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{
        position: 'absolute',
        left: Math.round(center[0]) - half,
        top: Math.round(center[1]) - half,
      }}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={-radius}
          y1={-radius}
          x2={radius}
          y2={radius}
          gradientTransform={`rotate(${(-angle).toFixed(3)})`}
        >
          {sheenStops(gold).map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <g transform={`${mirror ? 'scale(-1 1) ' : ''}rotate(${angle.toFixed(3)})`}>
        {rings.map((ring, ringIndex) => {
          const progress = progressOf(ringIndex, frame, timing);
          if (progress <= 0) {
            return null;
          }
          return (
            <g key={ringIndex.toString()}>
              {ring.strokes.map((d, index) => {
                const share = elementShare(progress, index, ring.strokes.length);
                if (share <= 0.002) {
                  return null;
                }
                return (
                  <path
                    key={`s${index.toString()}`}
                    d={d}
                    fill="none"
                    stroke={`url(#${id})`}
                    strokeWidth={ring.width * lineWidth}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    {...dashOf(share)}
                  />
                );
              })}
              {ring.fills.map((d, index) => {
                const share = elementShare(progress, index, ring.fills.length);
                if (share <= 0.002) {
                  return null;
                }
                return (
                  <path key={`f${index.toString()}`} d={d} fill={`url(#${id})`} opacity={share} />
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
