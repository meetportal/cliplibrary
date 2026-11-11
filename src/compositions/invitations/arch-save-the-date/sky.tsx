import type { ArchSaveTheDateProps } from '@/schemas';
import { mix, shade, tint, withAlpha } from './paint';

const CLOUDS = [
  { x: 250, y: 900, size: 0.85 },
  { x: 860, y: 780, size: 0.7 },
  { x: 600, y: 1210, size: 1 },
  { x: 90, y: 1280, size: 0.75 },
  { x: 1000, y: 1250, size: 0.8 },
  { x: 470, y: 600, size: 0.55 },
  { x: -360, y: 1020, size: 0.9 },
  { x: 1480, y: 1000, size: 0.85 },
] as const;

const PUFFS = [
  [-120, 10, 58],
  [-60, -26, 72],
  [10, -48, 86],
  [86, -20, 70],
  [140, 12, 52],
  [20, 18, 64],
] as const;

const Cloud = ({ x, y, size, color }: { x: number; y: number; size: number; color: string }) => (
  <g transform={`translate(${x} ${y}) scale(${size})`}>
    {PUFFS.map(([dx, dy, r]) => (
      <circle key={`${dx}:${dy}`} cx={dx} cy={dy + 8} r={r} fill={shade(color, 0.06)} />
    ))}
    {PUFFS.map(([dx, dy, r]) => (
      <circle key={`${dx}:${dy}`} cx={dx} cy={dy} r={r} fill={color} />
    ))}
    <rect x={-150} y={10} width={300} height={56} rx={28} fill={color} />
  </g>
);

export const Sky = ({
  props,
  frame,
  dusk,
}: {
  props: ArchSaveTheDateProps;
  frame: number;
  dusk: number;
}) => {
  const { colors, sky } = props;
  const drift = frame * sky.cloudDrift;
  return (
    <>
      <defs>
        <linearGradient id="arch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(colors.sky, 0.08)} />
          <stop offset="0.45" stopColor={colors.sky} />
          <stop offset="0.8" stopColor={tint(colors.sky, 0.55)} />
          <stop offset="1" stopColor={tint(colors.sky, 0.8)} />
        </linearGradient>
        <linearGradient id="arch-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={withAlpha(colors.dusk, 0)} />
          <stop offset="0.4" stopColor={withAlpha(colors.dusk, 0.05)} />
          <stop offset="0.75" stopColor={withAlpha(colors.dusk, 0.55)} />
          <stop offset="1" stopColor={withAlpha(colors.dusk, 0.85)} />
        </linearGradient>
      </defs>
      <rect x={-4000} y={-4000} width={9080} height={4400} fill={shade(colors.sky, 0.08)} />
      <rect x={-4000} y={400} width={9080} height={1100} fill="url(#arch-sky)" />
      <rect
        x={-4000}
        y={400}
        width={9080}
        height={1100}
        fill="url(#arch-dusk)"
        opacity={dusk * sky.duskStrength}
      />
      {CLOUDS.map((cloud) => (
        <Cloud
          key={`${cloud.x}:${cloud.y}`}
          x={cloud.x + drift * (0.6 + cloud.size * 0.3)}
          y={cloud.y}
          size={cloud.size}
          color={mix(colors.cloud, colors.dusk, dusk * sky.duskStrength * 0.8)}
        />
      ))}
    </>
  );
};

export const Haze = ({ props, amount }: { props: ArchSaveTheDateProps; amount: number }) => (
  <>
    <defs>
      <linearGradient id="arch-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={withAlpha(props.colors.stone, 0)} />
        <stop offset="0.3" stopColor={withAlpha(props.colors.stone, 0.85)} />
        <stop offset="0.75" stopColor={withAlpha(props.colors.stone, 0.85)} />
        <stop offset="1" stopColor={withAlpha(props.colors.stone, 0)} />
      </linearGradient>
      <linearGradient id="arch-haze-sides" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000000" />
        <stop offset="0.3" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#ffffff" />
        <stop offset="1" stopColor="#000000" />
      </linearGradient>
      <mask id="arch-haze-mask" maskUnits="userSpaceOnUse" x={0} y={900} width={1080} height={620}>
        <rect x={0} y={900} width={1080} height={620} fill="url(#arch-haze-sides)" />
      </mask>
    </defs>
    <rect
      x={0}
      y={900}
      width={1080}
      height={620}
      fill="url(#arch-haze)"
      mask="url(#arch-haze-mask)"
      opacity={amount * props.lettering.haze}
    />
  </>
);

const Bird = ({ x, y, flap, color }: { x: number; y: number; flap: number; color: string }) => {
  const lift = -10 - flap * 4;
  return (
    <path
      d={`M ${x - 13} ${y + lift} Q ${x - 6} ${y + lift * 0.25} ${x} ${y} Q ${x + 6} ${y + lift * 0.25} ${x + 13} ${y + lift}`}
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export const Birds = ({
  props,
  frame,
  appear,
}: {
  props: ArchSaveTheDateProps;
  frame: number;
  appear: number;
}) => {
  const count = Math.round(props.sky.birds);
  const color = shade(props.colors.sky, 0.35);
  return (
    <g opacity={appear}>
      {Array.from({ length: count }, (_, index) => {
        const lane = (index * 0.618) % 1;
        const x = ((300 + lane * 420 + frame * (0.9 + lane * 0.5)) % 760) + 160;
        const y = 560 + ((index * 11) % 22) + Math.sin(frame / 40 + index) * 3;
        const flap = Math.sin(frame / 4.5 + index * 1.7);
        return <Bird key={index} x={x} y={y} flap={flap} color={color} />;
      })}
    </g>
  );
};
