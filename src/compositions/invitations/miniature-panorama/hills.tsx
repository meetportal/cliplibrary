import type { MiniaturePanoramaProps } from '@/schemas';
import { layerOffset, Strip, type World } from './strip';

const SAMPLE = 20;

const RIDGES = [
  { depth: 0.18, tile: 1400, base: 1330, top: 1125, height: 1, seed: 0.4, weight: 0.95 },
  { depth: 0.3, tile: 1100, base: 1330, top: 1210, height: 0.7, seed: 2.1, weight: 1 },
] as const;

const ridgePath = (tile: number, base: number, top: number, height: number, seed: number) => {
  const turn = (Math.PI * 2) / tile;
  const points: string[] = [];
  for (let x = 0; x <= tile; x += SAMPLE) {
    const swell =
      0.5 +
      0.28 * Math.sin(x * turn * 2 + seed) +
      0.14 * Math.sin(x * turn * 3 + seed * 2.3) +
      0.08 * Math.abs(Math.sin(x * turn * 7 + seed));
    points.push(`L ${x} ${(top + (1 - swell) * 120 * height).toFixed(1)}`);
  }
  return `M 0 ${base} ${points.join(' ')} L ${tile} ${base} Z`;
};

const PATHS = RIDGES.map((ridge) =>
  ridgePath(ridge.tile, ridge.base, ridge.top, ridge.height, ridge.seed),
);

export const Hills = ({
  hills,
  world,
}: {
  hills: MiniaturePanoramaProps['hills'];
  world: World;
}) => (
  <g>
    {RIDGES.map((ridge, index) => (
      <Strip key={ridge.tile} offset={layerOffset(world, ridge.depth)} width={ridge.tile}>
        <path
          d={PATHS[index]}
          fill={world.shade(index === 0 ? hills.far : hills.near, ridge.weight)}
        />
      </Strip>
    ))}
  </g>
);
