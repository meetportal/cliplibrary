import { random } from 'remotion';
import type { MiniaturePanoramaProps } from '@/schemas';
import { mix } from './palette';
import { RAIL_BASE } from './railing';
import { FRAME_HEIGHT, layerOffset, Strip, type World } from './strip';

export const PATH_FEET = 1676;

const PATH_TILE = 900;

const PEBBLES = 14;

const FOLIAGE_DEPTH = 1.4;

const FOLIAGE_TILE = 1300;

const HEDGE_STEP = 100;

const BUSHES = [
  { x: 60, y: 1770, r: 70 },
  { x: 330, y: 1790, r: 84 },
  { x: 620, y: 1764, r: 66 },
  { x: 900, y: 1784, r: 90 },
  { x: 1170, y: 1770, r: 72 },
] as const;

const LEAVES = [
  { x: 180, angle: -62, length: 150 },
  { x: 200, angle: -100, length: 170 },
  { x: 220, angle: -130, length: 140 },
  { x: 760, angle: -58, length: 160 },
  { x: 782, angle: -92, length: 190 },
  { x: 806, angle: -124, length: 150 },
  { x: 1040, angle: -76, length: 130 },
  { x: 1060, angle: -108, length: 140 },
] as const;

const FLOWERS = [
  { x: 120, y: 1734 },
  { x: 360, y: 1722 },
  { x: 410, y: 1748 },
  { x: 640, y: 1716 },
  { x: 940, y: 1714 },
  { x: 990, y: 1740 },
  { x: 1210, y: 1718 },
] as const;

const hedgePath = (() => {
  const bumps: string[] = [];
  for (let x = 0; x < FOLIAGE_TILE; x += HEDGE_STEP) {
    bumps.push(`Q ${x + HEDGE_STEP / 2} 1700 ${x + HEDGE_STEP} 1756`);
  }
  return `M 0 ${FRAME_HEIGHT} L 0 1756 ${bumps.join(' ')} L ${FOLIAGE_TILE} ${FRAME_HEIGHT} Z`;
})();

export const GardenPath = ({
  path,
  world,
}: {
  path: MiniaturePanoramaProps['path'];
  world: World;
}) => {
  const sand = world.shade(path.sand, 0.8);
  const pebbles = world.shade(path.pebbles, 0.8);
  return (
    <Strip offset={layerOffset(world, 1)} width={PATH_TILE}>
      <rect
        x={-1}
        y={RAIL_BASE}
        width={PATH_TILE + 2}
        height={FRAME_HEIGHT - RAIL_BASE}
        fill={sand}
      />
      <rect x={-1} y={RAIL_BASE} width={PATH_TILE + 2} height={12} fill={mix(sand, pebbles, 0.7)} />
      {Array.from({ length: PEBBLES }, (_, index) => (
        <ellipse
          key={index}
          cx={random(`pebble-x-${index}`) * PATH_TILE}
          cy={RAIL_BASE + 26 + random(`pebble-y-${index}`) * 120}
          rx={4 + random(`pebble-r-${index}`) * 5}
          ry={2.5 + random(`pebble-r-${index}`) * 2}
          fill={pebbles}
        />
      ))}
    </Strip>
  );
};

export const Foliage = ({
  trees,
  flower,
  world,
}: {
  trees: MiniaturePanoramaProps['trees'];
  flower: string;
  world: World;
}) => {
  const dark = world.shade(trees.dark);
  const mid = world.shade(trees.mid);
  const light = world.shade(trees.light);
  const bloom = world.shade(flower, 0.7);
  return (
    <Strip offset={layerOffset(world, FOLIAGE_DEPTH)} width={FOLIAGE_TILE}>
      {LEAVES.map((leaf, index) => (
        <path
          key={`${leaf.x}-${leaf.angle}`}
          transform={`translate(${leaf.x} 1790) rotate(${leaf.angle})`}
          d={`M 0 0 Q ${leaf.length * 0.5} -26 ${leaf.length} 0 Q ${leaf.length * 0.5} 26 0 0 Z`}
          fill={index % 2 === 0 ? mid : light}
        />
      ))}
      <path d={hedgePath} fill={dark} />
      {BUSHES.map((bush) => (
        <g key={bush.x}>
          <circle cx={bush.x} cy={bush.y} r={bush.r} fill={mid} />
          <circle
            cx={bush.x - bush.r * 0.3}
            cy={bush.y - bush.r * 0.35}
            r={bush.r * 0.42}
            fill={light}
          />
        </g>
      ))}
      {FLOWERS.map((item) => (
        <g key={item.x}>
          <circle cx={item.x} cy={item.y} r={11} fill={bloom} />
          <circle cx={item.x} cy={item.y} r={4} fill={light} />
        </g>
      ))}
    </Strip>
  );
};
