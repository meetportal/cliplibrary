import { useId } from 'react';
import { cn } from '@/lib/utils';
import { SERIF } from './fonts';

const LEAF = 'M0 0 C7 -7 19 -7 26 0 C19 7 7 7 0 0 Z';

const Leaf = ({
  x,
  y,
  angle,
  scale = 1,
}: {
  x: number;
  y: number;
  angle: number;
  scale?: number;
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <path d={LEAF} fill="var(--er-leaf)" />
    <path d="M2 0 L22 0" stroke="var(--er-leaf-vein)" strokeWidth="0.8" />
  </g>
);

const PETALS = [0, 72, 144, 216, 288].map((degrees) => {
  const angle = (degrees * Math.PI) / 180;
  return { x: Math.round(Math.cos(angle) * 650) / 100, y: Math.round(Math.sin(angle) * 650) / 100 };
});

const Rose = ({
  x,
  y,
  r,
  fill,
  ink,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
  ink: string;
}) => (
  <g transform={`translate(${x} ${y}) scale(${r / 14})`}>
    {PETALS.map((petal) => (
      <circle
        key={`${petal.x}-${petal.y}`}
        cx={petal.x}
        cy={petal.y}
        r="7.5"
        fill={fill}
        stroke={ink}
        strokeWidth="0.6"
        strokeOpacity="0.6"
      />
    ))}
    <circle r="8.5" fill={fill} />
    <path
      d="M0 -1 a1.8 1.8 0 1 1 2 1.7 a4 4 0 1 1 -4.2 -3.9 a6.4 6.4 0 1 1 6.7 6.3"
      fill="none"
      stroke={ink}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </g>
);

export const FloralCluster = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 160 120" aria-hidden className={cn('pointer-events-none', className)}>
    <Leaf x={70} y={70} angle={200} scale={1.4} />
    <Leaf x={78} y={64} angle={-35} scale={1.5} />
    <Leaf x={64} y={58} angle={235} scale={1.2} />
    <Leaf x={92} y={72} angle={15} scale={1.3} />
    <Leaf x={58} y={78} angle={160} scale={1.1} />
    <Leaf x={88} y={56} angle={-70} scale={1.1} />
    <circle cx="112" cy="40" r="3" fill="var(--er-secondary)" />
    <circle cx="119" cy="47" r="2.4" fill="var(--er-secondary)" />
    <circle cx="40" cy="44" r="2.6" fill="var(--er-secondary)" />
    <circle cx="34" cy="52" r="2" fill="var(--er-secondary)" />
    <Rose x={60} y={66} r={17} fill="var(--er-secondary)" ink="var(--er-rose-ink)" />
    <Rose x={92} y={60} r={20} fill="var(--er-ivory-rose)" ink="var(--er-ivory-ink)" />
    <Rose x={110} y={78} r={13} fill="var(--er-secondary)" ink="var(--er-rose-ink)" />
  </svg>
);

const Rings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 28" aria-hidden className={className}>
    <circle cx="18" cy="15" r="10" fill="none" stroke="var(--er-accent)" strokeWidth="2.6" />
    <circle cx="30" cy="13" r="10" fill="none" stroke="var(--er-accent)" strokeWidth="2.6" />
    <path d="M30 3 l2.5 -2.5 l2.5 2.5 l-2.5 2.5 z" fill="var(--er-accent)" />
  </svg>
);

const scallop = (points: number, outer: number, inner: number): string => {
  const step = (Math.PI * 2) / points;
  const commands = Array.from({ length: points }, (_value, index) => {
    const angle = index * step;
    const middle = angle + step / 2;
    const next = angle + step;
    const mx = Math.cos(middle) * outer;
    const my = Math.sin(middle) * outer;
    const nx = Math.cos(next) * inner;
    const ny = Math.sin(next) * inner;
    return `Q ${mx.toFixed(2)} ${my.toFixed(2)} ${nx.toFixed(2)} ${ny.toFixed(2)}`;
  });
  return `M ${inner} 0 ${commands.join(' ')} Z`;
};

const SEAL_EDGE = scallop(14, 52, 46);

export const WaxSeal = ({ monogram, className }: { monogram: string; className?: string }) => {
  const gradient = useId();
  return (
    <svg viewBox="-56 -56 112 112" role="img" aria-label={monogram} className={className}>
      <defs>
        <radialGradient id={gradient} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="var(--er-seal-light)" />
          <stop offset="100%" stopColor="var(--er-secondary)" />
        </radialGradient>
      </defs>
      <path d={SEAL_EDGE} fill={`url(#${gradient})`} />
      <circle r="34" fill="none" stroke="var(--er-seal-ink)" strokeWidth="1.5" />
      <circle r="29" fill="none" stroke="var(--er-seal-ink)" strokeWidth="0.6" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--er-seal-ink)"
        fontSize={monogram.length > 3 ? 17 : 24}
        className={SERIF}
        fontStyle="italic"
      >
        {monogram}
      </text>
    </svg>
  );
};

export const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 22" aria-hidden className={className}>
    <path
      d="M12 21 C5 15 1 11 1 6.5 C1 3.4 3.4 1 6.4 1 C8.6 1 10.6 2.3 12 4.3 C13.4 2.3 15.4 1 17.6 1 C20.6 1 23 3.4 23 6.5 C23 11 19 15 12 21 Z"
      fill="var(--er-secondary)"
    />
  </svg>
);

export const RingsBand = () => (
  <div className="flex h-12 items-center justify-center bg-(--er-primary)">
    <Rings className="h-6 w-10" />
  </div>
);
