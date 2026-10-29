import type { MiniaturePanoramaProps } from '@/schemas';
import { mix } from './palette';
import type { World } from './strip';

const TORAN_STEP = 27;

const STRING_STEP = 84;

const FLOWER_STEP = 23;

const FLOWER_RADIUS = 11.5;

const LENGTHS = [9, 5, 11, 7, 4, 10, 6, 12, 5, 8, 10, 4, 9] as const;

const NIGHT_WEIGHT = 0.45;

const Flower = ({
  x,
  y,
  petals,
  heart,
}: {
  x: number;
  y: number;
  petals: string;
  heart: string;
}) => (
  <g>
    <circle cx={x} cy={y} r={FLOWER_RADIUS} fill={petals} />
    <circle cx={x} cy={y} r={FLOWER_RADIUS * 0.42} fill={heart} />
  </g>
);

export const Marigolds = ({
  marigolds,
  world,
}: {
  marigolds: MiniaturePanoramaProps['marigolds'];
  world: World;
}) => {
  if (!marigolds.show) {
    return null;
  }
  const orange = world.shade(marigolds.orange, NIGHT_WEIGHT);
  const yellow = world.shade(marigolds.yellow, NIGHT_WEIGHT);
  const leaf = world.shade(marigolds.leaf, NIGHT_WEIGHT);
  const heartOrange = mix(orange, leaf, 0.3);
  const heartYellow = mix(yellow, orange, 0.45);
  const toran = Array.from({ length: Math.ceil(1080 / TORAN_STEP) + 1 }, (_, index) => index);
  return (
    <g>
      {LENGTHS.map((length, string) => {
        const x = 36 + string * STRING_STEP;
        const angle = Math.sin(world.frame * 0.045 + string * 0.8) * marigolds.sway;
        const tip = 22 + length * FLOWER_STEP;
        return (
          <g key={x} transform={`rotate(${angle.toFixed(4)} ${x} 0)`}>
            <line x1={x} y1={0} x2={x} y2={tip} stroke={leaf} strokeWidth={2} />
            {Array.from({ length }, (_, index) => {
              const golden = (index + string) % 2 === 0;
              return (
                <Flower
                  key={index}
                  x={x}
                  y={30 + index * FLOWER_STEP}
                  petals={golden ? yellow : orange}
                  heart={golden ? heartYellow : heartOrange}
                />
              );
            })}
            <path
              d={`M ${x} ${tip} Q ${x - 9} ${tip + 12} ${x} ${tip + 26} Q ${x + 9} ${tip + 12} ${x} ${tip} Z`}
              fill={leaf}
            />
          </g>
        );
      })}
      {toran.map((index) => (
        <Flower
          key={index}
          x={index * TORAN_STEP}
          y={8}
          petals={index % 2 === 0 ? orange : yellow}
          heart={index % 2 === 0 ? heartOrange : heartYellow}
        />
      ))}
    </g>
  );
};
