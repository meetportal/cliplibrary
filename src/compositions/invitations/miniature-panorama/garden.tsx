import type { MiniaturePanoramaProps } from '@/schemas';
import { mix } from './palette';
import { Glow, layerOffset, Strip, type World } from './strip';

export const GROUND = 1300;

const GARDEN_DEPTH = 0.5;

const GARDEN_TILE = 1800;

const BANK_STEP = 45;

type Colors = {
  stone: string;
  shade: string;
  gold: string;
  opening: string;
  dark: string;
  mid: string;
  light: string;
  trunk: string;
  glow: string;
  lights: number;
};

const archPath = (left: number, right: number, top: number, bottom: number): string => {
  const middle = (left + right) / 2;
  const shoulder = top + (right - left) * 0.42;
  return `M ${left} ${bottom} L ${left} ${shoulder} Q ${left} ${top + 8} ${middle} ${top} Q ${right} ${top + 8} ${right} ${shoulder} L ${right} ${bottom} Z`;
};

const Chhatri = ({ x, size, colors }: { x: number; size: number; colors: Colors }) => (
  <g transform={`translate(${x} ${GROUND}) scale(${size})`}>
    <rect x={-112} y={-30} width={224} height={30} fill={colors.shade} />
    <rect x={-104} y={-36} width={208} height={8} fill={colors.stone} />
    <rect x={-90} y={-150} width={180} height={116} fill={colors.stone} />
    {[-1, 1].map((side) => (
      <g key={side}>
        <path
          d={archPath(side < 0 ? -76 : 10, side < 0 ? -10 : 76, -138, -36)}
          fill={colors.opening}
        />
        <line
          x1={side * 43}
          y1={-130}
          x2={side * 43}
          y2={-106}
          stroke={colors.gold}
          strokeWidth={2}
        />
        <rect x={side * 43 - 5} y={-106} width={10} height={14} rx={3} fill={colors.gold} />
        <Glow x={side * 43} y={-99} radius={30} color={colors.glow} amount={colors.lights} />
      </g>
    ))}
    <path d="M -116 -150 L 116 -150 L 100 -170 L -100 -170 Z" fill={colors.shade} />
    <rect x={-72} y={-190} width={144} height={22} fill={colors.stone} />
    <path
      d="M -74 -188 C -86 -236 -34 -258 0 -300 C 34 -258 86 -236 74 -188 Z"
      fill={colors.stone}
    />
    <path d="M -74 -188 C -60 -204 60 -204 74 -188 Z" fill={colors.shade} />
    <line x1={0} y1={-298} x2={0} y2={-326} stroke={colors.gold} strokeWidth={4} />
    <circle cx={0} cy={-312} r={7} fill={colors.gold} />
  </g>
);

const Cypress = ({ x, height, colors }: { x: number; height: number; colors: Colors }) => (
  <g transform={`translate(${x} ${GROUND})`}>
    <rect x={-5} y={-24} width={10} height={24} fill={colors.trunk} />
    <path
      d={`M 0 ${-height} C 30 ${-height * 0.62} 40 ${-height * 0.3} 26 -18 L -26 -18 C -40 ${-height * 0.3} -30 ${-height * 0.62} 0 ${-height} Z`}
      fill={colors.dark}
    />
    <path
      d={`M 0 ${-height + 16} C 18 ${-height * 0.6} 22 ${-height * 0.32} 14 -26 L 2 -26 C 6 ${-height * 0.34} 6 ${-height * 0.62} 0 ${-height + 16} Z`}
      fill={colors.mid}
    />
  </g>
);

const FRONDS = [-150, -118, -86, -54, -22, 12, 44] as const;

const Palm = ({ x, height, colors }: { x: number; height: number; colors: Colors }) => (
  <g transform={`translate(${x} ${GROUND})`}>
    <path
      d={`M -6 0 Q 14 ${-height * 0.5} 4 ${-height} L 14 ${-height} Q 26 ${-height * 0.5} 8 0 Z`}
      fill={colors.trunk}
    />
    {FRONDS.map((angle, index) => (
      <path
        key={angle}
        transform={`translate(9 ${-height}) rotate(${angle})`}
        d="M 0 0 Q 50 -22 104 0 Q 50 12 0 0 Z"
        fill={index % 2 === 0 ? colors.mid : colors.light}
      />
    ))}
  </g>
);

const CANOPY = [
  { x: 0, y: -170, r: 54, tone: 'dark' },
  { x: -48, y: -132, r: 44, tone: 'dark' },
  { x: 50, y: -128, r: 46, tone: 'dark' },
  { x: -18, y: -196, r: 30, tone: 'mid' },
  { x: 26, y: -150, r: 26, tone: 'mid' },
  { x: -40, y: -150, r: 20, tone: 'light' },
] as const;

const RoundTree = ({ x, colors }: { x: number; colors: Colors }) => (
  <g transform={`translate(${x} ${GROUND})`}>
    <rect x={-8} y={-110} width={16} height={110} fill={colors.trunk} />
    {CANOPY.map((puff) => (
      <circle
        key={`${puff.x}-${puff.y}`}
        cx={puff.x}
        cy={puff.y}
        r={puff.r}
        fill={colors[puff.tone]}
      />
    ))}
  </g>
);

const bankPath = (() => {
  const bumps: string[] = [];
  for (let x = 0; x < GARDEN_TILE; x += BANK_STEP) {
    bumps.push(`Q ${x + BANK_STEP / 2} ${GROUND - 26} ${x + BANK_STEP} ${GROUND - 4}`);
  }
  return `M 0 ${GROUND + 8} L 0 ${GROUND - 4} ${bumps.join(' ')} L ${GARDEN_TILE} ${GROUND + 8} Z`;
})();

export const Garden = ({
  pavilions,
  trees,
  lights,
  world,
}: {
  pavilions: MiniaturePanoramaProps['pavilions'];
  trees: MiniaturePanoramaProps['trees'];
  lights: MiniaturePanoramaProps['lights'];
  world: World;
}) => {
  const shade = world.shade(pavilions.shade);
  const colors: Colors = {
    stone: world.shade(pavilions.stone),
    shade,
    gold: world.shade(pavilions.gold, 0.6),
    opening: mix(shade, lights.glow, world.lights * 0.45),
    dark: world.shade(trees.dark),
    mid: world.shade(trees.mid),
    light: world.shade(trees.light),
    trunk: world.shade(trees.trunk),
    glow: lights.glow,
    lights: world.lights,
  };
  return (
    <Strip offset={layerOffset(world, GARDEN_DEPTH)} width={GARDEN_TILE}>
      <Cypress x={90} height={360} colors={colors} />
      <Chhatri x={290} size={1} colors={colors} />
      <Palm x={500} height={250} colors={colors} />
      <Cypress x={640} height={420} colors={colors} />
      <Cypress x={710} height={330} colors={colors} />
      <RoundTree x={900} colors={colors} />
      <Chhatri x={1150} size={0.78} colors={colors} />
      <Palm x={1330} height={300} colors={colors} />
      <Cypress x={1480} height={380} colors={colors} />
      <RoundTree x={1650} colors={colors} />
      <path d={bankPath} fill={colors.dark} />
    </Strip>
  );
};
