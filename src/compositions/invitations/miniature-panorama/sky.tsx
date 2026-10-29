import { random } from 'remotion';
import type { MiniaturePanoramaProps } from '@/schemas';
import { acrossDay, nightAmount, smoothstep, starAmount } from './palette';
import { FRAME_WIDTH, layerOffset, Strip, type World } from './strip';

type Sky = MiniaturePanoramaProps['sky'];

const SKY_HEIGHT = 1320;

const CLOUD_DEPTH = 0.1;

const CLOUD_TILE = 1500;

const STAR_DEPTH = 0.04;

const STAR_TILE = 1300;

const BIRD_DEPTH = 0.16;

const BIRD_LOOP = 1320;

const CLOUDS = [
  { x: 140, y: 330, size: 1 },
  { x: 1060, y: 250, size: 1.2 },
  { x: 700, y: 1010, size: 0.85 },
  { x: 1350, y: 820, size: 0.7 },
  { x: 420, y: 1090, size: 0.6 },
  { x: 940, y: 520, size: 0.65 },
] as const;

export type Band = readonly [number, number] | null;

const spread = (unit: number, from: number, to: number, band: Band): number => {
  const top = band === null ? to : Math.min(to, Math.max(from, band[0]));
  const bottom = band === null ? to : Math.min(to, Math.max(from, band[1]));
  const y = from + unit * (to - from - (bottom - top));
  return y > top ? y + bottom - top : y;
};

const PUFFS = [
  { x: 0, y: 0, r: 40 },
  { x: 48, y: -24, r: 52 },
  { x: 104, y: -8, r: 44 },
  { x: 146, y: 8, r: 30 },
] as const;

export const SkyGradient = ({ sky, phase }: { sky: Sky; phase: number }) => {
  const top = acrossDay(sky.dayTop, sky.duskTop, sky.nightTop, phase);
  const horizon = acrossDay(sky.dayHorizon, sky.duskHorizon, sky.nightHorizon, phase);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: horizon }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: SKY_HEIGHT,
          backgroundImage: `linear-gradient(to bottom, ${top} 0%, ${horizon} 100%)`,
        }}
      />
    </>
  );
};

export const Clouds = ({ sky, world }: { sky: Sky; world: World }) => {
  const fill = world.shade(sky.clouds, 0.9);
  return (
    <Strip offset={layerOffset(world, CLOUD_DEPTH)} width={CLOUD_TILE}>
      {CLOUDS.slice(0, sky.cloudCount).map((cloud) => (
        <g
          key={`${cloud.x}-${cloud.y}`}
          transform={`translate(${cloud.x} ${cloud.y}) scale(${cloud.size})`}
          opacity={0.88}
        >
          {PUFFS.map((puff) => (
            <circle key={puff.x} cx={puff.x} cy={puff.y} r={puff.r} fill={fill} />
          ))}
          <rect x={-32} y={0} width={210} height={34} rx={17} fill={fill} />
        </g>
      ))}
    </Strip>
  );
};

export const Stars = ({
  stars,
  world,
  band,
}: {
  stars: MiniaturePanoramaProps['stars'];
  world: World;
  band: Band;
}) => {
  const amount = starAmount(world.phase);
  if (amount <= 0 || stars.count === 0) {
    return null;
  }
  return (
    <Strip offset={layerOffset(world, STAR_DEPTH)} width={STAR_TILE}>
      {Array.from({ length: stars.count }, (_, index) => {
        const twinkle = 0.7 + 0.3 * Math.sin(world.frame / 17 + index * 1.7);
        return (
          <circle
            key={index}
            cx={random(`star-x-${index}`) * STAR_TILE}
            cy={spread(random(`star-y-${index}`), 30, 1030, band)}
            r={1.6 + random(`star-r-${index}`) * 2.2}
            fill={stars.color}
            opacity={amount * twinkle}
          />
        );
      })}
    </Strip>
  );
};

const wingPath = (span: number, lift: number): string =>
  `M ${-span} ${-lift * 0.4} Q ${-span * 0.5} ${-lift} 0 0 Q ${span * 0.5} ${-lift} ${span} ${-lift * 0.4} Q ${span * 0.5} ${-lift * 0.55} 0 ${span * 0.18} Q ${-span * 0.5} ${-lift * 0.55} ${-span} ${-lift * 0.4} Z`;

export const Birds = ({
  birds,
  world,
  heading,
  band,
}: {
  birds: MiniaturePanoramaProps['birds'];
  world: World;
  heading: number;
  band: Band;
}) => {
  const opacity = 1 - smoothstep((nightAmount(world.phase) - 0.2) / 0.5);
  if (birds.count === 0 || opacity <= 0) {
    return null;
  }
  const drift = layerOffset(world, BIRD_DEPTH);
  const fill = world.shade(birds.color, 0.4);
  return (
    <g opacity={opacity}>
      {Array.from({ length: birds.count }, (_, index) => {
        const speed = 0.9 + random(`bird-v-${index}`) * 0.6;
        const travel =
          random(`bird-x-${index}`) * BIRD_LOOP + world.frame * speed * heading - drift;
        const x = (((travel % BIRD_LOOP) + BIRD_LOOP) % BIRD_LOOP) - 120;
        const y =
          spread(random(`bird-y-${index}`), 260, 980, band) +
          Math.sin(world.frame / 40 + index) * 6;
        const span = 13 + random(`bird-s-${index}`) * 7;
        const flap = Math.sin(world.frame * 0.36 + index * 2.1);
        return (
          <path
            key={index}
            transform={`translate(${x.toFixed(3)} ${y.toFixed(3)})`}
            d={wingPath(span, span * (0.35 + 0.45 * flap))}
            fill={fill}
          />
        );
      })}
    </g>
  );
};
