import type { MiniaturePanoramaProps } from '@/schemas';
import { Glow, layerOffset, Strip, type World } from './strip';

const RAIL_TOP = 1452;

export const RAIL_BASE = 1566;

const RAIL_TILE = 1440;

const POST_STEP = 180;

const BALUSTER_STEP = 22;

const PEACOCK_X = 820;

const EYES = [
  { x: -34, y: 1470 },
  { x: -62, y: 1494 },
  { x: -92, y: 1522 },
  { x: -122, y: 1552 },
  { x: -66, y: 1520 },
  { x: -100, y: 1550 },
] as const;

const Diya = ({
  x,
  bowl,
  flame,
  glow,
  amount,
}: {
  x: number;
  bowl: string;
  flame: string;
  glow: string;
  amount: number;
}) => (
  <g transform={`translate(${x} ${RAIL_TOP - 18})`}>
    <Glow x={0} y={-14} radius={40} color={glow} amount={amount} />
    <path d="M -14 -6 Q 0 10 14 -6 Z" fill={bowl} />
    {amount > 0 ? (
      <path d="M 0 -28 Q 7 -14 0 -6 Q -7 -14 0 -28 Z" fill={flame} opacity={amount} />
    ) : null}
  </g>
);

const Peacock = ({
  body,
  tail,
  eyes,
  beak,
}: {
  body: string;
  tail: string;
  eyes: string;
  beak: string;
}) => (
  <g transform={`translate(${PEACOCK_X} 0)`}>
    <path
      d={`M -2 ${RAIL_TOP - 14} C -40 ${RAIL_TOP + 2} -96 1512 -150 1576 L -96 1580 C -62 1530 -26 1488 10 ${RAIL_TOP - 2} Z`}
      fill={tail}
    />
    {EYES.map((eye) => (
      <g key={`${eye.x}-${eye.y}`}>
        <ellipse cx={eye.x} cy={eye.y} rx={8} ry={6} fill={eyes} />
        <ellipse cx={eye.x} cy={eye.y} rx={4} ry={3} fill={body} />
      </g>
    ))}
    <path
      d={`M -24 ${RAIL_TOP - 4} Q -30 ${RAIL_TOP - 40} 6 ${RAIL_TOP - 46} Q 30 ${RAIL_TOP - 40} 26 ${RAIL_TOP - 4} Z`}
      fill={body}
    />
    <path
      d={`M 8 ${RAIL_TOP - 40} Q 10 ${RAIL_TOP - 70} 22 ${RAIL_TOP - 92} L 34 ${RAIL_TOP - 88} Q 24 ${RAIL_TOP - 66} 24 ${RAIL_TOP - 38} Z`}
      fill={body}
    />
    <circle cx={30} cy={RAIL_TOP - 92} r={9} fill={body} />
    <path d={`M 37 ${RAIL_TOP - 96} L 48 ${RAIL_TOP - 90} L 37 ${RAIL_TOP - 87} Z`} fill={beak} />
    {[-8, 0, 8].map((tilt) => (
      <g key={tilt} transform={`rotate(${tilt} 30 ${RAIL_TOP - 100})`}>
        <line
          x1={30}
          y1={RAIL_TOP - 100}
          x2={30}
          y2={RAIL_TOP - 116}
          stroke={body}
          strokeWidth={2}
        />
        <circle cx={30} cy={RAIL_TOP - 118} r={3.5} fill={eyes} />
      </g>
    ))}
  </g>
);

export const Railing = ({
  railing,
  peacock,
  lights,
  gold,
  world,
}: {
  railing: MiniaturePanoramaProps['railing'];
  peacock: MiniaturePanoramaProps['peacock'];
  lights: MiniaturePanoramaProps['lights'];
  gold: string;
  world: World;
}) => {
  const marble = world.shade(railing.marble, 0.8);
  const shade = world.shade(railing.shade, 0.8);
  const bowl = world.shade(gold, 0.6);
  const posts = Array.from({ length: RAIL_TILE / POST_STEP }, (_, index) => index * POST_STEP);
  const balusters = Array.from(
    { length: RAIL_TILE / BALUSTER_STEP },
    (_, index) => index * BALUSTER_STEP,
  );
  return (
    <Strip offset={layerOffset(world, 1)} width={RAIL_TILE}>
      {balusters.map((x) => (
        <rect key={x} x={x + 7} y={RAIL_TOP + 14} width={8} height={70} fill={marble} />
      ))}
      <rect x={-1} y={RAIL_TOP} width={RAIL_TILE + 2} height={16} fill={marble} />
      <rect x={-1} y={RAIL_TOP + 16} width={RAIL_TILE + 2} height={4} fill={shade} />
      <rect x={-1} y={RAIL_TOP + 84} width={RAIL_TILE + 2} height={16} fill={marble} />
      <rect
        x={-1}
        y={RAIL_TOP + 100}
        width={RAIL_TILE + 2}
        height={RAIL_BASE - RAIL_TOP - 100}
        fill={shade}
      />
      {posts.map((x) => (
        <g key={x}>
          <rect
            x={x - 12}
            y={RAIL_TOP - 12}
            width={24}
            height={RAIL_BASE - RAIL_TOP + 12}
            fill={marble}
          />
          <rect
            x={x - 12}
            y={RAIL_TOP + 8}
            width={4}
            height={RAIL_BASE - RAIL_TOP - 8}
            fill={shade}
          />
          <rect x={x - 17} y={RAIL_TOP - 18} width={34} height={8} fill={marble} />
          <Diya x={x} bowl={bowl} flame={lights.flame} glow={lights.glow} amount={world.lights} />
        </g>
      ))}
      {peacock.show ? (
        <Peacock
          body={world.shade(peacock.body, 0.6)}
          tail={world.shade(peacock.tail, 0.6)}
          eyes={world.shade(peacock.eyes, 0.6)}
          beak={bowl}
        />
      ) : null}
    </Strip>
  );
};
