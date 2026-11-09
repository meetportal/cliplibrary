import { smooth, tween } from './motion';
import { fixed, type Point, shade } from './paint';

const ARCH = { left: 120, right: 960, top: 380, bottom: 1590 };

const archPath = (arch: typeof ARCH): string => {
  const radius = (arch.right - arch.left) / 2;
  const shoulder = arch.top + radius;
  return [
    `M${fixed(arch.left)} ${fixed(arch.bottom)}`,
    `L${fixed(arch.left)} ${fixed(shoulder)}`,
    `A${fixed(radius)} ${fixed(radius)} 0 0 1 ${fixed(arch.right)} ${fixed(shoulder)}`,
    `L${fixed(arch.right)} ${fixed(arch.bottom)}`,
    'Z',
  ].join(' ');
};

export const ArchCard = ({
  fill,
  border,
  width,
}: {
  fill: string;
  border: string;
  width: number;
}) => (
  <g>
    <path d={archPath(ARCH)} fill={fill} stroke={border} strokeWidth={width * 2} />
    <path d={archPath(ARCH)} fill={fill} />
    <path
      d={archPath(ARCH)}
      fill="none"
      stroke={shade(border, 0.08)}
      strokeOpacity={0.45}
      strokeWidth={1.5}
    />
  </g>
);

const TOP: Point = [540, 380];
const BOTTOM: Point = [540, 1590];
const RIGHT_SIDE: Point[] = [
  [985, 640],
  [985, 1330],
];
const LEFT_SIDE: Point[] = [
  [95, 640],
  [95, 1330],
];

const polyline = (points: Point[]): string =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point[0])} ${fixed(point[1])}`)
    .join(' ');

const pathLength = (points: Point[]): number =>
  points.slice(1).reduce((sum, point, index) => {
    const before = points[index] ?? point;
    return sum + Math.hypot(point[0] - before[0], point[1] - before[1]);
  }, 0);

const HALVES = [
  [TOP, ...RIGHT_SIDE, BOTTOM],
  [TOP, ...LEFT_SIDE, BOTTOM],
];

const CLOSED = `${polyline([TOP, ...RIGHT_SIDE, BOTTOM, ...[...LEFT_SIDE].reverse()])} Z`;

const CLOSE_AT = 0.995;

export const HexagonFrame = ({
  frame,
  start,
  frames,
  fill,
  line,
  width,
}: {
  frame: number;
  start: number;
  frames: number;
  fill: string;
  line: string;
  width: number;
}) => {
  const drawn = tween(frame, [start, start + frames], [0, 1], smooth);
  const shown = tween(frame, [start, start + 4], [0, 1], smooth);
  return (
    <g>
      <path d={CLOSED} fill={fill} />
      {drawn >= CLOSE_AT ? (
        <path d={CLOSED} fill="none" stroke={line} strokeWidth={width} strokeLinejoin="miter" />
      ) : (
        HALVES.map((half) => {
          const length = pathLength(half);
          return (
            <path
              key={polyline(half)}
              d={polyline(half)}
              fill="none"
              stroke={line}
              strokeWidth={width}
              strokeLinejoin="miter"
              strokeOpacity={shown}
              strokeDasharray={`${fixed(length * drawn)} ${fixed(length)}`}
            />
          );
        })
      )}
    </g>
  );
};
