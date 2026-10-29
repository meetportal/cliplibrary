import type { ArchSaveTheDateProps } from '@/schemas';
import { TAU } from '../../promo/timing';
import { type ArchShape, archYAt, CENTER_X } from './geometry';

type Lanterns = ArchSaveTheDateProps['lanterns'];

const Lantern = ({
  lanterns,
  glassId,
  haloId,
}: {
  lanterns: Lanterns;
  glassId: string;
  haloId: string;
}) => {
  const metal = lanterns.metal;
  return (
    <g>
      {lanterns.glow > 0 ? (
        <circle
          cx={0}
          cy={88}
          r={74}
          fill={lanterns.glass}
          opacity={lanterns.glow}
          filter={`url(#${haloId})`}
        />
      ) : null}
      <circle cx={0} cy={4} r={5} fill="none" stroke={metal} strokeWidth={2.5} />
      <circle cx={0} cy={14} r={4} fill={metal} />
      <path d="M -30 42 Q -26 22 0 16 Q 26 22 30 42 Z" fill={metal} />
      <rect x={-36} y={40} width={72} height={8} rx={2} fill={metal} />
      <path d="M -29 48 H 29 L 25 126 H -25 Z" fill={`url(#${glassId})`} />
      <path d="M -29 48 H 29 L 25 126 H -25 Z" fill="none" stroke={metal} strokeWidth={3} />
      <path d="M -10 48 L -8.5 126 M 10 48 L 8.5 126" stroke={metal} strokeWidth={2} />
      <path d="M -27 72 H 27 M -26 100 H 26" stroke={metal} strokeWidth={1.2} opacity={0.7} />
      <rect x={-32} y={124} width={64} height={8} rx={2} fill={metal} />
      <path d="M -24 132 H 24 L 0 158 Z" fill={metal} />
      <circle cx={0} cy={164} r={5} fill={metal} />
    </g>
  );
};

const lanternXs = (shape: ArchShape, lanterns: Lanterns): number[] => {
  if (lanterns.count === 1) {
    return [CENTER_X];
  }
  const reach = shape.halfWidth * lanterns.spread;
  return Array.from(
    { length: lanterns.count },
    (_, index) => CENTER_X - reach + (2 * reach * index) / (lanterns.count - 1),
  );
};

export const BrassLanterns = ({
  shape,
  lanterns,
  time,
  ids,
}: {
  shape: ArchShape;
  lanterns: Lanterns;
  time: number;
  ids: { glass: string; halo: string };
}) => {
  if (lanterns.count === 0) {
    return null;
  }
  return (
    <g>
      <defs>
        <linearGradient id={ids.glass} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor={lanterns.metal} stopOpacity={0.55} />
          <stop offset={0.5} stopColor={lanterns.glass} />
          <stop offset={1} stopColor={lanterns.metal} stopOpacity={0.55} />
        </linearGradient>
        <filter id={ids.halo} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={20} />
        </filter>
      </defs>
      {lanternXs(shape, lanterns).map((x, index) => {
        const anchor = archYAt(shape, x) - 60;
        const hookY = Math.max(anchor + 80, lanterns.hang);
        const phase = index * 1.7;
        const angle = lanterns.sway * Math.sin((TAU * time) / lanterns.swayFrames + phase);
        return (
          <g key={x} transform={`rotate(${angle.toFixed(4)} ${x.toFixed(2)} ${anchor.toFixed(2)})`}>
            <line x1={x} y1={anchor} x2={x} y2={hookY} stroke={lanterns.metal} strokeWidth={1.6} />
            <line
              x1={x}
              y1={anchor}
              x2={x}
              y2={hookY}
              stroke={lanterns.metal}
              strokeWidth={4.5}
              strokeDasharray="7 5"
            />
            <g transform={`translate(${x.toFixed(2)} ${hookY.toFixed(2)}) scale(${lanterns.size})`}>
              <Lantern lanterns={lanterns} glassId={ids.glass} haloId={ids.halo} />
            </g>
          </g>
        );
      })}
    </g>
  );
};
