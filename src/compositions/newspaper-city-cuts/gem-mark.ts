type Point = readonly [number, number];

export const GEM_ASPECT = 0.82;

const LEFT_TABLE: Point = [0.27, 0];
const RIGHT_TABLE: Point = [0.73, 0];
const MIDDLE_TABLE: Point = [0.5, 0];
const LEFT_GIRDLE: Point = [0, 0.3];
const RIGHT_GIRDLE: Point = [1, 0.3];
const LEFT_FACET: Point = [0.36, 0.3];
const RIGHT_FACET: Point = [0.64, 0.3];
const CULET: Point = [0.5, 1];

const GEM_PATHS: { points: Point[]; closed: boolean }[] = [
  { points: [LEFT_TABLE, RIGHT_TABLE, RIGHT_GIRDLE, CULET, LEFT_GIRDLE], closed: true },
  { points: [LEFT_GIRDLE, RIGHT_GIRDLE], closed: false },
  { points: [LEFT_TABLE, LEFT_FACET, MIDDLE_TABLE, RIGHT_FACET, RIGHT_TABLE], closed: false },
  { points: [LEFT_FACET, CULET, RIGHT_FACET], closed: false },
];

export const gemSvgPath = (width: number): string =>
  GEM_PATHS.map(({ points, closed }) => {
    const [first, ...rest] = points.map(([x, y]) => `${x * width} ${y * width * GEM_ASPECT}`);
    return `M${first}${rest.map((point) => ` L${point}`).join('')}${closed ? ' Z' : ''}`;
  }).join(' ');

export const drawGem = (
  context: CanvasRenderingContext2D,
  [left, top]: [number, number],
  width: number,
  lineWidth: number,
) => {
  context.save();
  context.translate(left, top);
  context.lineWidth = lineWidth;
  context.lineJoin = 'miter';
  context.lineCap = 'butt';
  context.stroke(new Path2D(gemSvgPath(width)));
  context.restore();
};
