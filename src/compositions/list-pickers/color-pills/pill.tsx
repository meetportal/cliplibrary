import { withAlpha } from './palette';

export type PillMetrics = {
  height: number;
  padding: number;
  fontSize: number;
  family: string;
  weight: number;
  bullet: boolean;
};

export const Pill = ({
  label,
  fill,
  glow,
  ink,
  metrics,
  x,
  y,
  opacity,
  hover,
  grow,
  lift,
  halo,
}: {
  label: string;
  fill: string;
  glow: string;
  ink: string;
  metrics: PillMetrics;
  x: number;
  y: number;
  opacity: number;
  hover: number;
  grow: number;
  lift: number;
  halo: number;
}) => {
  const swell = (metrics.height * grow * hover) / 2;
  const reach = pillReach(metrics.height, grow, hover);
  const dot = Math.round(metrics.fontSize * 0.24);
  const haloBlur = metrics.height * 0.24;
  const liftDepth = metrics.height * 0.12 * lift * hover;
  const shadow = [
    `0 0 ${haloBlur.toFixed(2)}px ${withAlpha(glow, halo * 0.6)}`,
    `0 ${liftDepth.toFixed(2)}px ${(liftDepth * 2.4).toFixed(2)}px ${withAlpha(glow, 0.45 * lift * hover)}`,
  ].join(', ');
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: metrics.height,
        padding: `0 ${metrics.padding}px`,
        opacity,
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -reach,
          right: -reach,
          top: 0,
          bottom: 0,
          borderRadius: metrics.height / 2,
          transform: `scaleY(${(1 + (swell * 2) / metrics.height).toFixed(5)})`,
          backgroundColor: fill,
          boxShadow: shadow,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(metrics.fontSize * 0.28),
          color: ink,
          fontFamily: metrics.family,
          fontWeight: metrics.weight,
          fontSize: metrics.fontSize,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {metrics.bullet ? (
          <div
            style={{
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: ink,
              flexShrink: 0,
            }}
          />
        ) : null}
        <span>{label}</span>
      </div>
    </div>
  );
};

export const pillReach = (height: number, grow: number, hover: number) =>
  ((height * grow * hover) / 2) * 1.6;
