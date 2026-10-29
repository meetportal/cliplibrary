import type { BotanicalSaveTheDateProps } from '@/schemas';
import {
  DEG,
  easeOutQuad,
  type Point,
  type Polyline,
  pathData,
  pointAlong,
  polyline,
  sampleCubic,
  timeToReach,
} from './geometry';
import { Leaf, type LeafInk, leafOpening } from './leaf';

type SprigKind = 'eucalyptus' | 'olive';

interface LeafSpec {
  at: number;
  side: 1 | -1;
  length: number;
  width: number;
  spread: number;
}

interface Branch {
  line: Polyline;
  path: string;
  leaves: LeafSpec[];
  berries: number[];
  weight: number;
  startsAt: number;
  share: number;
}

const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount;

const pairedLeaves = (
  stops: number[],
  [longest, shortest]: [number, number],
  ratio: number,
): LeafSpec[] =>
  stops.flatMap((at) => {
    const length = lerp(longest, shortest, at);
    const leaf = { at, length, width: length * ratio, spread: 58 };
    return [
      { ...leaf, side: 1 as const },
      { ...leaf, side: -1 as const },
    ];
  });

const alternateLeaves = (
  count: number,
  [longest, shortest]: [number, number],
  ratio: number,
): LeafSpec[] =>
  Array.from({ length: count }, (_, index) => {
    const at = lerp(0.12, 0.93, index / (count - 1));
    const length = lerp(longest, shortest, at);
    return {
      at,
      side: index % 2 === 0 ? 1 : -1,
      length,
      width: length * ratio,
      spread: 38,
    };
  });

const tipLeaf = (length: number, ratio: number): LeafSpec => ({
  at: 1,
  side: 1,
  length,
  width: length * ratio,
  spread: 0,
});

const branchFrom = (
  controls: readonly [Point, Point, Point, Point],
  leaves: LeafSpec[],
  berries: number[],
  weight: number,
  startsAt = 0,
  share = 1,
): Branch => {
  const line = polyline(sampleCubic(controls));
  return { line, path: pathData(line.points), leaves, berries, weight, startsAt, share };
};

const offshoot = (
  parent: Branch,
  anchor: number,
  turn: number,
  length: number,
  bend: number,
): readonly [Point, Point, Point, Point] => {
  const { point, angle } = pointAlong(parent.line, anchor);
  const heading = angle + turn * DEG;
  const across = heading + Math.PI / 2;
  const at = (along: number, side: number): Point => [
    point[0] + Math.cos(heading) * along + Math.cos(across) * side,
    point[1] + Math.sin(heading) * along + Math.sin(across) * side,
  ];
  return [point, at(length * 0.35, bend * 0.4), at(length * 0.7, bend), at(length, bend * 0.8)];
};

const buildSprig = (kind: SprigKind): Branch[] => {
  if (kind === 'eucalyptus') {
    const main = branchFrom(
      [
        [0, 0],
        [190, 40],
        [390, 112],
        [580, 120],
      ],
      [...pairedLeaves([0.16, 0.3, 0.44, 0.57, 0.69, 0.8, 0.9], [76, 44], 0.78), tipLeaf(46, 0.72)],
      [],
      1.4,
    );
    const side = branchFrom(
      offshoot(main, 0.36, 40, 250, 26),
      [...pairedLeaves([0.28, 0.5, 0.7, 0.86], [56, 36], 0.78), tipLeaf(36, 0.72)],
      [],
      1.1,
      timeToReach(0.36),
      0.6,
    );
    return [main, side];
  }
  const main = branchFrom(
    [
      [0, 0],
      [200, 22],
      [410, 84],
      [600, 72],
    ],
    [...alternateLeaves(13, [108, 64], 0.26), tipLeaf(66, 0.26)],
    [0.34, 0.6],
    1.4,
  );
  const side = branchFrom(
    offshoot(main, 0.46, 34, 230, 20),
    [...alternateLeaves(7, [78, 52], 0.26), tipLeaf(50, 0.26)],
    [0.62],
    1.1,
    timeToReach(0.46),
    0.6,
  );
  return [main, side];
};

const SPRIGS: Record<SprigKind, Branch[]> = {
  eucalyptus: buildSprig('eucalyptus'),
  olive: buildSprig('olive'),
};

interface Corner {
  kind: SprigKind;
  x: (width: number) => number;
  y: (height: number) => number;
  angle: number;
  mirror: boolean;
  scale: number;
}

const CORNERS: Corner[] = [
  { kind: 'eucalyptus', x: () => -40, y: () => 104, angle: 19, mirror: false, scale: 1 },
  { kind: 'olive', x: (w) => w + 40, y: (h) => h - 96, angle: 197, mirror: false, scale: 1 },
  { kind: 'olive', x: (w) => w + 40, y: () => 226, angle: 163, mirror: true, scale: 0.74 },
  { kind: 'eucalyptus', x: () => -40, y: (h) => h - 226, angle: -17, mirror: true, scale: 0.74 },
];

const BranchDrawing = ({
  branch,
  frame,
  start,
  drawFrames,
  ink,
  accent,
  berries,
  flutter,
}: {
  branch: Branch;
  frame: number;
  start: number;
  drawFrames: number;
  ink: LeafInk;
  accent: string;
  berries: boolean;
  flutter: (index: number) => number;
}) => {
  const begin = start + drawFrames * branch.startsAt;
  const length = drawFrames * branch.share;
  const progress = easeOutQuad(Math.min(1, Math.max(0, (frame - begin) / length)));
  if (progress <= 0) {
    return null;
  }
  const total = branch.line.total;
  const opensAt = (at: number) => begin + length * timeToReach(at);
  return (
    <g>
      <path
        d={branch.path}
        fill="none"
        stroke={ink.color}
        strokeWidth={ink.lineWidth * branch.weight}
        strokeLinecap="butt"
        strokeDasharray={progress >= 1 ? undefined : `${total} ${total}`}
        strokeDashoffset={progress >= 1 ? undefined : total * (1 - progress)}
      />
      {branch.leaves.map((leaf, index) => {
        const { point, angle } = pointAlong(branch.line, leaf.at);
        return (
          <Leaf
            key={`${leaf.at}-${leaf.side}`}
            at={point}
            angle={angle / DEG + flutter(index)}
            spread={leaf.spread * leaf.side}
            length={leaf.length}
            width={leaf.width}
            open={leafOpening(frame, opensAt(leaf.at))}
            ink={ink}
          />
        );
      })}
      {berries
        ? branch.berries.map((at) => {
            const open = leafOpening(frame, opensAt(at));
            if (open <= 0) {
              return null;
            }
            const { point, angle } = pointAlong(branch.line, at);
            const heading = angle - Math.PI / 2 + 0.5;
            const reach = 34 * open;
            const tip: Point = [
              point[0] + Math.cos(heading) * reach,
              point[1] + Math.sin(heading) * reach,
            ];
            return (
              <g key={`berry-${at}`} opacity={Math.min(1, open * 2)}>
                <path
                  d={pathData([point, tip])}
                  stroke={ink.color}
                  strokeWidth={ink.lineWidth * 0.8}
                  fill="none"
                />
                <circle cx={tip[0]} cy={tip[1]} r={9 * open} fill={accent} />
              </g>
            );
          })
        : null}
    </g>
  );
};

export const Sprigs = ({
  frame,
  width,
  height,
  sprigs,
  color,
  accent,
}: {
  frame: number;
  width: number;
  height: number;
  sprigs: BotanicalSaveTheDateProps['sprigs'];
  color: string;
  accent: string;
}) => {
  const cycle = (Math.PI * 2) / sprigs.swayPeriod;
  return (
    <g>
      {CORNERS.slice(0, Math.round(sprigs.count)).map((corner, index) => {
        const sway = Math.sin(frame * cycle + index * 1.9) * sprigs.sway;
        const flutter = (leaf: number) =>
          Math.sin(frame * cycle * 2.3 + leaf * 1.7 + index) * sprigs.sway * 0.4;
        const scale = corner.scale * sprigs.size;
        const ink: LeafInk = { color, fill: sprigs.leafFill, lineWidth: sprigs.lineWidth / scale };
        return (
          <g
            key={`${corner.kind}-${corner.angle}`}
            transform={`translate(${corner.x(width)} ${corner.y(height)}) rotate(${(corner.angle + sway).toFixed(3)}) scale(${scale} ${corner.mirror ? -scale : scale})`}
          >
            {SPRIGS[corner.kind].map((branch) => (
              <BranchDrawing
                key={`${branch.startsAt}`}
                branch={branch}
                frame={frame}
                start={sprigs.at + index * sprigs.stagger}
                drawFrames={sprigs.drawFrames}
                ink={ink}
                accent={accent}
                berries={sprigs.berries}
                flutter={flutter}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};
