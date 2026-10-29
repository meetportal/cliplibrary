import type { ArchSaveTheDateProps } from '@/schemas';
import { WALL_TOP } from './arch-geometry';
import { fixed, seeded } from './camera';

type Chandeliers = ArchSaveTheDateProps['chandeliers'];

export interface ChandelierIds {
  bowl: string;
  drop: string;
  brass: string;
}

export const ChandelierDefs = ({
  ids,
  chandeliers,
  tint,
}: {
  ids: ChandelierIds;
  chandeliers: Chandeliers;
  tint: string;
}) => (
  <>
    <linearGradient id={ids.bowl} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={chandeliers.crystal} />
      <stop offset="0.45" stopColor={tint} />
      <stop offset="0.6" stopColor={chandeliers.crystal} />
      <stop offset="1" stopColor={tint} />
    </linearGradient>
    <linearGradient id={ids.drop} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={tint} />
      <stop offset="0.4" stopColor={chandeliers.crystal} />
      <stop offset="1" stopColor={tint} />
    </linearGradient>
    <linearGradient id={ids.brass} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={chandeliers.crystal} />
      <stop offset="0.35" stopColor={chandeliers.metal} />
      <stop offset="1" stopColor={chandeliers.metal} />
    </linearGradient>
  </>
);

const Glint = ({
  x,
  y,
  size,
  opacity,
  color,
}: Record<'x' | 'y' | 'size' | 'opacity', number> & { color: string }) =>
  opacity <= 0.01 ? null : (
    <path
      d={`M ${fixed(x)} ${fixed(y - size)} Q ${fixed(x)} ${fixed(y)} ${fixed(x + size)} ${fixed(y)} Q ${fixed(x)} ${fixed(y)} ${fixed(x)} ${fixed(y + size)} Q ${fixed(x)} ${fixed(y)} ${fixed(x - size)} ${fixed(y)} Q ${fixed(x)} ${fixed(y)} ${fixed(x)} ${fixed(y - size)} Z`}
      fill={color}
      opacity={opacity}
    />
  );

const ARM_REACH = [0.3, 0.62, 0.95];

const STRANDS = 15;

const SWAGS = 8;

export const Chandelier = ({
  cx,
  chandeliers,
  ids,
  time,
  seed,
  tint,
}: {
  cx: number;
  chandeliers: Chandeliers;
  ids: ChandelierIds;
  time: number;
  seed: number;
  tint: string;
}) => {
  const k = chandeliers.size;
  const bottom = chandeliers.drop;
  const rim = bottom - 178 * k;
  const base = bottom - 86 * k;
  const hub = bottom - 250 * k;
  const crown = bottom - 340 * k;
  const bowlWidth = 158 * k;
  const swing = Math.sin(time / 64 + seed) * 1.1;
  const bowl = `M ${fixed(cx - bowlWidth)} ${fixed(rim)} C ${fixed(cx - bowlWidth)} ${fixed(rim + 60 * k)} ${fixed(cx - 70 * k)} ${fixed(base)} ${fixed(cx)} ${fixed(base)} C ${fixed(cx + 70 * k)} ${fixed(base)} ${fixed(cx + bowlWidth)} ${fixed(rim + 60 * k)} ${fixed(cx + bowlWidth)} ${fixed(rim)} Z`;
  const rows = [0.2, 0.42, 0.64, 0.84];
  const drops = [-3, -2, -1, 0, 1, 2, 3];
  const glints = Array.from({ length: 11 }, (_, index) => ({
    x: cx + (seeded(index, seed + 3) - 0.5) * bowlWidth * 1.5,
    y: rim + seeded(index, seed + 5) * (base - rim + 40 * k),
    phase: seeded(index, seed + 7) * Math.PI * 2,
  }));
  return (
    <g transform={`rotate(${swing.toFixed(4)} ${fixed(cx)} ${fixed(crown)})`}>
      <path
        d={`M ${fixed(cx)} ${WALL_TOP} V ${fixed(crown)}`}
        stroke={chandeliers.metal}
        strokeWidth={fixed(5 * k)}
      />
      <path
        d={`M ${fixed(cx)} ${fixed(crown + 6 * k)} V ${fixed(rim)}`}
        stroke={`url(#${ids.brass})`}
        strokeWidth={fixed(9 * k)}
      />
      {[crown + 20 * k, hub - 24 * k, hub + 30 * k].map((y) => (
        <ellipse
          key={y}
          cx={fixed(cx)}
          cy={fixed(y)}
          rx={fixed(13 * k)}
          ry={fixed(17 * k)}
          fill={`url(#${ids.drop})`}
          stroke={chandeliers.metal}
          strokeWidth={fixed(1.6 * k)}
        />
      ))}
      {[-1, 1].flatMap((direction) =>
        ARM_REACH.map((reach) => {
          const tipX = cx + direction * reach * bowlWidth * 1.05;
          const tipY = hub - (8 + reach * 26) * k;
          return (
            <g key={`${direction}:${reach}`}>
              <path
                d={`M ${fixed(cx)} ${fixed(hub)} C ${fixed(cx + direction * reach * bowlWidth * 0.5)} ${fixed(hub + 60 * k)} ${fixed(tipX)} ${fixed(hub + 40 * k)} ${fixed(tipX)} ${fixed(tipY)}`}
                fill="none"
                stroke={chandeliers.metal}
                strokeWidth={fixed(4.5 * k)}
              />
              <path
                d={`M ${fixed(tipX - 12 * k)} ${fixed(tipY)} Q ${fixed(tipX)} ${fixed(tipY + 12 * k)} ${fixed(tipX + 12 * k)} ${fixed(tipY)} Z`}
                fill={chandeliers.metal}
              />
              <rect
                x={fixed(tipX - 4.5 * k)}
                y={fixed(tipY - 34 * k)}
                width={fixed(9 * k)}
                height={fixed(34 * k)}
                fill={`url(#${ids.drop})`}
              />
              <path
                d={`M ${fixed(cx)} ${fixed(hub + 8 * k)} Q ${fixed((cx + tipX) / 2)} ${fixed(hub + 72 * k)} ${fixed(tipX)} ${fixed(tipY + 6 * k)}`}
                fill="none"
                stroke={chandeliers.crystal}
                strokeWidth={fixed(5 * k)}
                strokeLinecap="round"
                strokeDasharray={`0 ${fixed(9 * k)}`}
              />
            </g>
          );
        }),
      )}
      <path
        d={bowl}
        fill={`url(#${ids.bowl})`}
        stroke={chandeliers.metal}
        strokeWidth={fixed(1.5 * k)}
      />
      <ellipse
        cx={fixed(cx)}
        cy={fixed(rim)}
        rx={fixed(bowlWidth * 0.96)}
        ry={fixed(14 * k)}
        fill={tint}
      />
      {Array.from({ length: STRANDS }, (_strand, index) => {
        const share = index / (STRANDS - 1) - 0.5;
        const topX = cx + share * 2 * bowlWidth * 0.94;
        return (
          <path
            key={share}
            d={`M ${fixed(topX)} ${fixed(rim + 8 * k)} Q ${fixed(cx + share * 2 * bowlWidth * 0.92)} ${fixed(rim + 58 * k)} ${fixed(cx + share * 2 * bowlWidth * 0.3)} ${fixed(base - 2 * k)}`}
            fill="none"
            stroke={chandeliers.crystal}
            strokeWidth={fixed(4.4 * k)}
            strokeLinecap="round"
            strokeDasharray={`0 ${fixed(7.5 * k)}`}
          />
        );
      })}
      <path
        d={Array.from({ length: SWAGS }, (_swag, index) => {
          const from = cx - bowlWidth + (index / SWAGS) * bowlWidth * 2;
          const to = from + (bowlWidth * 2) / SWAGS;
          return `M ${fixed(from)} ${fixed(rim + 4 * k)} Q ${fixed((from + to) / 2)} ${fixed(rim + 30 * k)} ${fixed(to)} ${fixed(rim + 4 * k)}`;
        }).join(' ')}
        fill="none"
        stroke={chandeliers.crystal}
        strokeWidth={fixed(5 * k)}
        strokeLinecap="round"
        strokeDasharray={`0 ${fixed(8 * k)}`}
      />
      {rows.map((share) => {
        const y = rim + (base - rim) * share;
        const half = bowlWidth * (1 - share * 0.62);
        return (
          <path
            key={share}
            d={`M ${fixed(cx - half)} ${fixed(y - 6 * k)} Q ${fixed(cx)} ${fixed(y + 22 * k)} ${fixed(cx + half)} ${fixed(y - 6 * k)}`}
            fill="none"
            stroke={chandeliers.crystal}
            strokeWidth={fixed(6 * k)}
            strokeLinecap="round"
            strokeDasharray={`0 ${fixed(10 * k)}`}
          />
        );
      })}
      <ellipse
        cx={fixed(cx)}
        cy={fixed(rim)}
        rx={fixed(bowlWidth)}
        ry={fixed(16 * k)}
        fill="none"
        stroke={chandeliers.metal}
        strokeWidth={fixed(4.5 * k)}
      />
      <ellipse
        cx={fixed(cx)}
        cy={fixed(rim)}
        rx={fixed(bowlWidth * 0.98)}
        ry={fixed(14 * k)}
        fill="none"
        stroke={chandeliers.crystal}
        strokeWidth={fixed(5 * k)}
        strokeLinecap="round"
        strokeDasharray={`0 ${fixed(11 * k)}`}
      />
      {drops.map((slot) => {
        const length = (86 - Math.abs(slot) * 16) * k;
        const x = cx + slot * 13 * k;
        const top = base - 10 * k + Math.abs(slot) * 4 * k;
        return (
          <path
            key={slot}
            d={`M ${fixed(x)} ${fixed(top)} L ${fixed(x + 6 * k)} ${fixed(top + length * 0.7)} L ${fixed(x)} ${fixed(top + length)} L ${fixed(x - 6 * k)} ${fixed(top + length * 0.7)} Z`}
            fill={`url(#${ids.drop})`}
            stroke={chandeliers.metal}
            strokeOpacity={0.35}
            strokeWidth={fixed(k)}
          />
        );
      })}
      {glints.map((glint) => (
        <Glint
          key={glint.phase}
          x={glint.x}
          y={glint.y}
          size={16 * k}
          color={chandeliers.crystal}
          opacity={chandeliers.sparkle * Math.max(0, Math.sin(time * 0.07 + glint.phase)) ** 6}
        />
      ))}
    </g>
  );
};
