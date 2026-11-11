import { CENTER_X } from './geometry';
import { shade, tint } from './paint';

type Tier = { top: number; half: number; depth: number; drops: number; dropLength: number };

const TIERS: readonly Tier[] = [
  { top: -10, half: 250, depth: 150, drops: 15, dropLength: 96 },
  { top: 330, half: 165, depth: 110, drops: 11, dropLength: 70 },
];

const bowlPath = (tier: Tier) => {
  const { top, half, depth } = tier;
  const left = CENTER_X - half;
  const right = CENTER_X + half;
  return `M ${left} ${top} C ${left + 10} ${top + depth * 0.7} ${CENTER_X - half * 0.45} ${top + depth} ${CENTER_X} ${top + depth} C ${CENTER_X + half * 0.45} ${top + depth} ${right - 10} ${top + depth * 0.7} ${right} ${top} Z`;
};

const Drop = ({
  x,
  y,
  length,
  crystal,
}: {
  x: number;
  y: number;
  length: number;
  crystal: string;
}) => (
  <g>
    <path d={`M ${x} ${y} L ${x} ${y + length - 18}`} stroke={tint(crystal, 0.4)} strokeWidth={2} />
    <path
      d={`M ${x} ${y + length - 22} L ${x + 7} ${y + length - 8} L ${x} ${y + length + 6} L ${x - 7} ${y + length - 8} Z`}
      fill={tint(crystal, 0.5)}
      stroke={shade(crystal, 0.18)}
      strokeWidth={1.4}
    />
  </g>
);

const BowlTier = ({
  tier,
  id,
  crystal,
  gold,
}: {
  tier: Tier;
  id: string;
  crystal: string;
  gold: string;
}) => {
  const bottom = tier.top + tier.depth;
  const drops = Array.from({ length: tier.drops }, (_, index) => {
    const t = (index + 0.5) / tier.drops;
    const x = CENTER_X - tier.half * 0.62 + t * tier.half * 1.24;
    const sag = Math.sin(t * Math.PI);
    const y = bottom - tier.depth * 0.32 * (1 - sag);
    return { x, y, length: tier.dropLength * (0.55 + sag * 0.45), key: index };
  });
  return (
    <g>
      {drops.map((drop) => (
        <Drop key={drop.key} x={drop.x} y={drop.y} length={drop.length} crystal={crystal} />
      ))}
      <path d={bowlPath(tier)} fill={`url(#${id})`} />
      <path d={bowlPath(tier)} fill="url(#arch-beads)" />
      <ellipse
        cx={CENTER_X}
        cy={tier.top}
        rx={tier.half}
        ry={tier.half * 0.09}
        fill={tint(crystal, 0.5)}
        stroke={gold}
        strokeWidth={5}
      />
      <path
        d={`M ${CENTER_X - tier.half * 0.62} ${tier.top + tier.depth * 0.62} Q ${CENTER_X} ${tier.top + tier.depth * 0.86} ${CENTER_X + tier.half * 0.62} ${tier.top + tier.depth * 0.62}`}
        fill="none"
        stroke={gold}
        strokeWidth={3}
      />
    </g>
  );
};

export const ChandelierDefs = ({ crystal }: { crystal: string }) => (
  <defs>
    <linearGradient id="arch-bowl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={shade(crystal, 0.12)} />
      <stop offset="0.45" stopColor={tint(crystal, 0.55)} />
      <stop offset="1" stopColor={shade(crystal, 0.08)} />
    </linearGradient>
    <pattern id="arch-beads" width={14} height={14} patternUnits="userSpaceOnUse">
      <circle cx={7} cy={7} r={3.4} fill={tint(crystal, 0.8)} />
    </pattern>
  </defs>
);

export const Chandelier = ({ crystal, gold }: { crystal: string; gold: string }) => {
  const [upper, lower] = TIERS as [Tier, Tier];
  const armsY = upper.top + upper.depth + 70;
  return (
    <g>
      <path d={`M ${CENTER_X} -400 L ${CENTER_X} ${lower.top}`} stroke={gold} strokeWidth={5} />
      <BowlTier tier={upper} id="arch-bowl" crystal={crystal} gold={gold} />
      <path
        d={`M ${CENTER_X - 140} ${armsY} Q ${CENTER_X} ${armsY + 70} ${CENTER_X + 140} ${armsY} M ${CENTER_X - 90} ${armsY - 20} Q ${CENTER_X} ${armsY + 30} ${CENTER_X + 90} ${armsY - 20}`}
        fill="none"
        stroke={gold}
        strokeWidth={4}
      />
      {[-140, -70, 70, 140].map((dx) => (
        <g key={dx}>
          <rect
            x={CENTER_X + dx - 5}
            y={armsY - 36}
            width={10}
            height={30}
            fill={tint(crystal, 0.6)}
          />
          <circle cx={CENTER_X + dx} cy={armsY - 40} r={5} fill={tint(gold, 0.5)} />
        </g>
      ))}
      <circle
        cx={CENTER_X}
        cy={armsY + 22}
        r={12}
        fill={tint(crystal, 0.3)}
        stroke={gold}
        strokeWidth={3}
      />
      <BowlTier tier={lower} id="arch-bowl" crystal={crystal} gold={gold} />
    </g>
  );
};
