import type { ArchSaveTheDateProps } from '@/schemas';
import { type ArchShape, CENTER_X } from './geometry';

type Balcony = ArchSaveTheDateProps['balcony'];

const COPING = 24;
const PLINTH = 34;
const POST = 50;
const END_POST_INSET = 52;
const BALUSTER_PITCH = 34;
const SWAG_SAG = 46;
const BEAD = 8.5;

const baluster = (x: number, top: number, bottom: number): string => {
  const h = bottom - top;
  return [
    `M ${x - 6} ${top}`,
    `L ${x + 6} ${top}`,
    `C ${x + 6} ${top + h * 0.22} ${x + 12} ${top + h * 0.42} ${x + 12} ${top + h * 0.62}`,
    `C ${x + 12} ${top + h * 0.82} ${x + 6} ${bottom - 8} ${x + 10} ${bottom}`,
    `L ${x - 10} ${bottom}`,
    `C ${x - 6} ${bottom - 8} ${x - 12} ${top + h * 0.82} ${x - 12} ${top + h * 0.62}`,
    `C ${x - 12} ${top + h * 0.42} ${x - 6} ${top + h * 0.22} ${x - 6} ${top}`,
    'Z',
  ].join(' ');
};

const Bead = ({ x, y, color, deep }: { x: number; y: number; color: string; deep: string }) => (
  <g>
    <circle cx={x} cy={y} r={BEAD} fill={color} />
    <circle cx={x} cy={y} r={BEAD * 0.45} fill={deep} />
  </g>
);

const Plant = ({
  x,
  y,
  size,
  balcony,
  time,
  index,
}: {
  x: number;
  y: number;
  size: number;
  balcony: Balcony;
  time: number;
  index: number;
}) => {
  const s = size;
  const leaves = [-68, -46, -24, -6, 12, 32, 54, 72];
  return (
    <g>
      {leaves.map((angle, leafIndex) => {
        const sway = Math.sin(time / 46 + leafIndex * 0.9 + index * 2.1) * 1.6;
        const length = (78 + ((leafIndex * 37) % 40)) * s;
        return (
          <path
            key={angle}
            d={`M 0 0 Q ${length * 0.28} ${-length * 0.5} 0 ${-length} Q ${-length * 0.28} ${-length * 0.5} 0 0 Z`}
            fill={leafIndex % 2 === 0 ? balcony.leaf : balcony.leafDark}
            transform={`translate(${x} ${y - 40 * s}) rotate(${(angle + sway).toFixed(3)})`}
          />
        );
      })}
      {[-22, 4, 26].map((offset, flower) => (
        <Bead
          key={offset}
          x={x + offset * s}
          y={y - (58 + flower * 14) * s}
          color={balcony.marigold}
          deep={balcony.marigoldDeep}
        />
      ))}
      <path
        d={`M ${x - 32 * s} ${y - 44 * s} H ${x + 32 * s} Q ${x + 34 * s} ${y - 8 * s} ${x + 14 * s} ${y} H ${x - 14 * s} Q ${x - 34 * s} ${y - 8 * s} ${x - 32 * s} ${y - 44 * s} Z`}
        fill={balcony.pot}
      />
      <rect
        x={x - 36 * s}
        y={y - 50 * s}
        width={72 * s}
        height={9 * s}
        rx={3 * s}
        fill={balcony.pot}
      />
      <path
        d={`M ${x - 26 * s} ${y - 28 * s} H ${x + 26 * s}`}
        stroke={balcony.shade}
        strokeWidth={2 * s}
        opacity={0.6}
      />
    </g>
  );
};

const plantPosts = (posts: number, plants: number): number[] => {
  const order: number[] = [];
  for (let step = 0; order.length < posts; step++) {
    order.push(step);
    if (order.length < posts && posts - 1 - step !== step) {
      order.push(posts - 1 - step);
    }
  }
  return order.slice(0, Math.min(plants, posts));
};

export const MarigoldBalcony = ({
  shape,
  balcony,
  time,
  gradientId,
}: {
  shape: ArchShape;
  balcony: Balcony;
  time: number;
  gradientId: string;
}) => {
  const left = CENTER_X - shape.halfWidth - 12;
  const right = CENTER_X + shape.halfWidth + 12;
  const top = balcony.rail;
  const bottom = shape.sillY;
  const first = CENTER_X - shape.halfWidth + END_POST_INSET;
  const last = CENTER_X + shape.halfWidth - END_POST_INSET;
  const posts = Array.from(
    { length: balcony.posts },
    (_, index) => first + ((last - first) * index) / (balcony.posts - 1),
  );
  const bays = [left - POST / 2, ...posts, right + POST / 2];
  const balusters: number[] = [];
  bays.slice(0, -1).forEach((post, index) => {
    const next = bays[index + 1] ?? post;
    const inner = next - post - POST;
    const count = Math.max(0, Math.floor(inner / BALUSTER_PITCH));
    const pitch = inner / Math.max(1, count);
    for (let item = 0; item < count; item++) {
      balusters.push(post + POST / 2 + pitch * (item + 0.5));
    }
  });
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor={balcony.stone} />
          <stop offset={0.45} stopColor={balcony.stone} />
          <stop offset={1} stopColor={balcony.shade} />
        </linearGradient>
      </defs>
      {balusters.map((x) => (
        <path key={x} d={baluster(x, top + COPING, bottom - PLINTH)} fill={`url(#${gradientId})`} />
      ))}
      <rect
        x={left}
        y={bottom - PLINTH}
        width={right - left}
        height={PLINTH}
        fill={balcony.stone}
      />
      <rect x={left} y={bottom - PLINTH} width={right - left} height={6} fill={balcony.shade} />
      {posts.map((x) => (
        <g key={x}>
          <rect
            x={x - POST / 2}
            y={top - 8}
            width={POST}
            height={bottom - top + 8}
            fill={`url(#${gradientId})`}
          />
          <rect
            x={x - POST / 2 + 10}
            y={top + 30}
            width={POST - 20}
            height={bottom - top - 76}
            fill="none"
            stroke={balcony.shade}
            strokeWidth={2}
          />
        </g>
      ))}
      <rect x={left} y={top} width={right - left} height={COPING} fill={balcony.stone} />
      <rect x={left} y={top + COPING - 6} width={right - left} height={6} fill={balcony.shade} />
      {posts.map((x) => (
        <rect
          key={x}
          x={x - POST / 2 - 6}
          y={top - 14}
          width={POST + 12}
          height={12}
          rx={3}
          fill={balcony.stone}
          stroke={balcony.shade}
          strokeWidth={1.5}
        />
      ))}
      {balcony.garland
        ? posts.slice(0, -1).map((post, index) => {
            const next = posts[index + 1] ?? post;
            const count = Math.max(2, Math.round((next - post) / (BEAD * 1.9)));
            return (
              <g key={post}>
                {Array.from({ length: count + 1 }, (_, bead) => {
                  const t = bead / count;
                  return (
                    <Bead
                      key={bead}
                      x={post + (next - post) * t}
                      y={top + 4 + SWAG_SAG * 4 * t * (1 - t)}
                      color={bead % 3 === 1 ? balcony.marigoldDeep : balcony.marigold}
                      deep={balcony.marigoldDeep}
                    />
                  );
                })}
              </g>
            );
          })
        : null}
      {balcony.garland
        ? posts.map((x) =>
            [1, 2, 3, 4].map((bead) => (
              <Bead
                key={`${x}-${bead}`}
                x={x}
                y={top + 4 + bead * BEAD * 1.8}
                color={bead === 4 ? balcony.marigoldDeep : balcony.marigold}
                deep={balcony.marigoldDeep}
              />
            )),
          )
        : null}
      {plantPosts(balcony.posts, balcony.plants).map((index) => {
        const x = posts[index] ?? CENTER_X;
        return (
          <Plant
            key={index}
            x={x}
            y={top - 14}
            size={balcony.plantSize}
            balcony={balcony}
            time={time}
            index={index}
          />
        );
      })}
    </g>
  );
};
