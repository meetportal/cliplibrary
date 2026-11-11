import type { ArchSaveTheDateProps } from '@/schemas';
import { CENTER_X } from './geometry';
import { mix, seeded, shade, tint } from './paint';

const RAIL_TOP = 1556;
const RAIL_BOTTOM = 1700;
const FLOOR_TOP = 1716;
const POSTS = [-270, 270, 810, 1350] as const;

const hillPath = (base: number, crests: readonly (readonly [number, number])[]) => {
  const parts = [`M -2000 ${base + 400}`, `L -2000 ${base}`];
  let previous = -2000;
  for (const [x, height] of crests) {
    const mid = (previous + x) / 2;
    parts.push(`Q ${mid} ${base - height} ${x} ${base}`);
    previous = x;
  }
  parts.push(`L 3080 ${base}`, `L 3080 ${base + 400} Z`);
  return parts.join(' ');
};

const BACK_HILLS = hillPath(1420, [
  [-900, 140],
  [-200, 180],
  [300, 190],
  [760, 150],
  [1240, 200],
  [1900, 170],
  [3080, 150],
]);

const FRONT_HILLS = hillPath(1500, [
  [-700, 160],
  [100, 150],
  [520, 200],
  [980, 170],
  [1500, 150],
  [3080, 180],
]);

const leaf = (x: number, y: number, length: number, angle: number, width: number) => {
  const radians = (angle * Math.PI) / 180;
  const tipX = x + Math.cos(radians) * length;
  const tipY = y - Math.sin(radians) * length;
  const nx = -Math.sin(radians) * width;
  const ny = -Math.cos(radians) * width;
  const midX = (x + tipX) / 2;
  const midY = (y + tipY) / 2;
  return {
    outer: `M ${x} ${y} Q ${midX + nx} ${midY + ny} ${tipX} ${tipY} Q ${midX - nx} ${midY - ny} ${x} ${y} Z`,
    half: `M ${x} ${y} Q ${midX + nx} ${midY + ny} ${tipX} ${tipY} Z`,
  };
};

const Agave = ({ x, flip, color }: { x: number; flip: boolean; color: string }) => {
  const angles = [28, 44, 58, 72, 86, 100, 116, 134, 150];
  return (
    <g transform={flip ? `translate(${x * 2} 0) scale(-1 1)` : undefined}>
      {angles.map((angle, index) => {
        const shape = leaf(x, 1540, 240 + ((index * 53) % 120), angle, 30);
        return (
          <g key={angle}>
            <path d={shape.outer} fill={shade(color, 0.12)} />
            <path d={shape.half} fill={tint(color, 0.22)} />
          </g>
        );
      })}
    </g>
  );
};

const Stems = ({ color }: { color: string }) => {
  const random = seeded(7);
  const stems = Array.from({ length: 10 }, (_, index) => {
    const x = index < 5 ? 150 + random() * 140 : 790 + random() * 140;
    const top = 900 + random() * 260;
    const lean = (random() - 0.5) * 90;
    return { x, top, lean, key: index };
  });
  return (
    <>
      {stems.map((stem) => (
        <path
          key={stem.key}
          d={`M ${stem.x} 1560 Q ${stem.x + stem.lean * 0.3} ${(stem.top + 1560) / 2} ${stem.x + stem.lean} ${stem.top}`}
          fill="none"
          stroke={shade(color, 0.1)}
          strokeWidth={3}
        />
      ))}
    </>
  );
};

const Baluster = ({ x, stone }: { x: number; stone: string }) => (
  <path
    d={`M ${x - 10} ${RAIL_TOP + 18} L ${x + 10} ${RAIL_TOP + 18} C ${x + 6} ${RAIL_TOP + 40} ${x + 18} ${RAIL_TOP + 70} ${x + 12} ${RAIL_TOP + 100} L ${x + 14} ${RAIL_BOTTOM - 10} L ${x - 14} ${RAIL_BOTTOM - 10} L ${x - 12} ${RAIL_TOP + 100} C ${x - 18} ${RAIL_TOP + 70} ${x - 6} ${RAIL_TOP + 40} ${x - 10} ${RAIL_TOP + 18} Z`}
    fill={stone}
  />
);

const Rose = ({
  x,
  height,
  flowers,
  leafColor,
}: {
  x: number;
  height: number;
  flowers: string;
  leafColor: string;
}) => {
  const top = 1770 - height;
  return (
    <g>
      <path
        d={`M ${x} 1770 L ${x} ${top}`}
        stroke={shade(leafColor, 0.25)}
        strokeWidth={3}
        fill="none"
      />
      <path d={leaf(x, top + 70, 34, 20, 9).outer} fill={leafColor} />
      <path d={leaf(x, top + 110, 34, 160, 9).outer} fill={leafColor} />
      <circle cx={x} cy={top} r={11} fill={flowers} />
      <circle cx={x - 3} cy={top - 3} r={5} fill={tint(flowers, 0.35)} />
      <circle cx={x + 16} cy={top + 40} r={8} fill={shade(flowers, 0.1)} />
      <circle cx={x - 15} cy={top + 58} r={8} fill={flowers} />
    </g>
  );
};

const Floor = ({ stone }: { stone: string }) => {
  const lines = [0, 30, 70, 125, 200, 300, 440];
  const rays = Array.from({ length: 23 }, (_, index) => (index - 11) * 150);
  return (
    <g>
      <rect x={-3000} y={FLOOR_TOP} width={7080} height={3000} fill={tint(stone, 0.4)} />
      {lines.map((offset) => (
        <rect
          key={offset}
          x={-3000}
          y={FLOOR_TOP + offset}
          width={7080}
          height={2}
          fill={shade(stone, 0.07)}
        />
      ))}
      {rays.map((offset) => (
        <path
          key={offset}
          d={`M ${CENTER_X + offset * 0.5} ${FLOOR_TOP} L ${CENTER_X + offset * 6} ${FLOOR_TOP + 2200}`}
          stroke={shade(stone, 0.06)}
          strokeWidth={2}
        />
      ))}
    </g>
  );
};

export const Garden = ({ props }: { props: ArchSaveTheDateProps }) => {
  const { colors } = props;
  const balusters = Array.from({ length: 104 }, (_, index) => -1500 + index * 40);
  const roses = [140, 205, 380, 440, 500, 630, 690, 870, 935, -100, 1180];
  return (
    <g>
      <path d={BACK_HILLS} fill={mix(tint(colors.foliage, 0.45), '#cfe5d4', 0.25)} />
      <path d={FRONT_HILLS} fill={tint(colors.foliage, 0.25)} />
      <Stems color={colors.foliage} />
      <Agave x={70} flip={false} color={colors.foliage} />
      <Agave x={1010} flip={true} color={colors.foliage} />
      <rect
        x={-3000}
        y={RAIL_TOP + 150}
        width={7080}
        height={40}
        fill={tint(colors.foliage, 0.1)}
      />
      {balusters.map((x) => (
        <Baluster key={x} x={x} stone={shade(colors.stone, 0.04)} />
      ))}
      <rect x={-3000} y={RAIL_TOP} width={7080} height={20} fill={colors.stone} />
      <rect x={-3000} y={RAIL_TOP + 18} width={7080} height={4} fill={shade(colors.stone, 0.1)} />
      <rect x={-3000} y={RAIL_BOTTOM - 12} width={7080} height={18} fill={colors.stone} />
      {POSTS.map((x) => (
        <g key={x}>
          <rect
            x={x - 34}
            y={RAIL_TOP - 24}
            width={68}
            height={RAIL_BOTTOM - RAIL_TOP + 30}
            fill={colors.stone}
          />
          <rect
            x={x - 42}
            y={RAIL_TOP - 34}
            width={84}
            height={14}
            fill={shade(colors.stone, 0.05)}
          />
          <path
            d={`M ${x - 26} ${RAIL_TOP - 76} L ${x + 26} ${RAIL_TOP - 76} L ${x + 16} ${RAIL_TOP - 36} L ${x - 16} ${RAIL_TOP - 36} Z`}
            fill={tint(colors.stone, 0.3)}
          />
          <circle cx={x - 14} cy={RAIL_TOP - 86} r={14} fill={colors.foliage} />
          <circle cx={x + 14} cy={RAIL_TOP - 88} r={14} fill={shade(colors.foliage, 0.1)} />
          <circle cx={x} cy={RAIL_TOP - 98} r={11} fill={colors.flowers} />
        </g>
      ))}
      <Floor stone={colors.stone} />
      {roses.map((x, index) => (
        <Rose
          key={x}
          x={x}
          height={120 + ((index * 41) % 70)}
          flowers={colors.flowers}
          leafColor={colors.foliage}
        />
      ))}
    </g>
  );
};
