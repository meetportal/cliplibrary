import type { MiniaturePanoramaProps } from '@/schemas';
import { GROUND } from './garden';
import { mix } from './palette';
import { layerOffset, Strip, type World } from './strip';

const LAKE_BOTTOM = 1560;

const LAKE_DEPTH = 0.72;

const LAKE_TILE = 1200;

const RIPPLES = [
  { x: 40, y: 1336, w: 110 },
  { x: 300, y: 1352, w: 70 },
  { x: 520, y: 1330, w: 90 },
  { x: 840, y: 1348, w: 130 },
  { x: 1060, y: 1372, w: 60 },
  { x: 160, y: 1400, w: 80 },
  { x: 760, y: 1420, w: 70 },
  { x: 980, y: 1440, w: 100 },
] as const;

const PADS = [
  { x: 80, y: 1430, flower: true },
  { x: 150, y: 1446, flower: false },
  { x: 330, y: 1438, flower: false },
  { x: 880, y: 1432, flower: true },
  { x: 950, y: 1448, flower: false },
  { x: 1110, y: 1428, flower: true },
  { x: 250, y: 1376, flower: false },
  { x: 1000, y: 1388, flower: false },
] as const;

const SWANS = [
  { x: 560, facing: 1, phase: 0 },
  { x: 700, facing: -1, phase: 1.3 },
] as const;

const Lotus = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x} ${y - 4})`}>
    <path d="M 0 0 Q -16 -8 -12 -22 Q -2 -14 0 0 Z" fill={color} />
    <path d="M 0 0 Q 16 -8 12 -22 Q 2 -14 0 0 Z" fill={color} />
    <path d="M 0 0 Q -8 -16 0 -28 Q 8 -16 0 0 Z" fill={color} />
  </g>
);

const Swan = ({
  x,
  y,
  facing,
  body,
  beak,
  wing,
}: {
  x: number;
  y: number;
  facing: number;
  body: string;
  beak: string;
  wing: string;
}) => (
  <g transform={`translate(${x} ${y.toFixed(3)}) scale(${facing} 1)`}>
    <path
      d="M -58 -8 Q -66 -40 -40 -30 Q -10 -40 24 -18 Q 34 -4 18 4 L -40 4 Q -56 2 -58 -8 Z"
      fill={body}
    />
    <path d="M -30 -22 Q -6 -34 14 -16 Q -8 -14 -30 -22 Z" fill={wing} />
    <path
      d="M 14 -14 Q 34 -36 18 -62 Q 8 -84 26 -92 Q 42 -96 44 -82 L 36 -80 Q 28 -86 26 -76 Q 34 -54 26 -14 Z"
      fill={body}
    />
    <path d="M 42 -86 L 58 -80 L 42 -78 Z" fill={beak} />
  </g>
);

export const Lake = ({ lake, world }: { lake: MiniaturePanoramaProps['lake']; world: World }) => {
  const water = world.shade(lake.water, 0.85);
  const ripple = world.shade(lake.ripple, 0.85);
  const pad = world.shade(lake.pad);
  const lotus = world.shade(lake.lotus, 0.7);
  const swan = world.shade(lake.swan, 0.7);
  const wing = mix(swan, water, 0.18);
  const beak = world.shade(lake.beak, 0.7);
  return (
    <Strip offset={layerOffset(world, LAKE_DEPTH)} width={LAKE_TILE}>
      <rect x={-1} y={GROUND} width={LAKE_TILE + 2} height={LAKE_BOTTOM - GROUND} fill={water} />
      <rect x={-1} y={GROUND} width={LAKE_TILE + 2} height={14} fill={mix(water, ripple, 0.25)} />
      {RIPPLES.map((line) => (
        <rect
          key={`${line.x}-${line.y}`}
          x={line.x}
          y={line.y + Math.sin(world.frame / 30 + line.x) * 1.5}
          width={line.w}
          height={4}
          rx={2}
          fill={ripple}
          opacity={0.8}
        />
      ))}
      {PADS.map((item) => (
        <g key={`${item.x}-${item.y}`}>
          <ellipse cx={item.x} cy={item.y} rx={28} ry={9} fill={pad} />
          {item.flower ? <Lotus x={item.x} y={item.y} color={lotus} /> : null}
        </g>
      ))}
      {lake.showSwans
        ? SWANS.map((item) => (
            <Swan
              key={item.x}
              x={item.x}
              y={1418 + Math.sin(world.frame / 26 + item.phase) * 2.5}
              facing={item.facing}
              body={swan}
              beak={beak}
              wing={wing}
            />
          ))
        : null}
    </Strip>
  );
};
