export type Point = { x: number; y: number };

export type Stroke = { points: Point[]; length: number };

const SAMPLES_PER_SPAN = 18;
const BARB_ANGLE = (31 * Math.PI) / 180;

export const WAVY_PATH: readonly Point[] = [
  { x: 470, y: 498 },
  { x: 502, y: 526 },
  { x: 538, y: 540 },
  { x: 576, y: 520 },
  { x: 612, y: 470 },
  { x: 648, y: 438 },
  { x: 686, y: 434 },
  { x: 720, y: 464 },
  { x: 752, y: 506 },
  { x: 784, y: 520 },
  { x: 818, y: 494 },
  { x: 870, y: 428 },
  { x: 922, y: 362 },
  { x: 968, y: 304 },
];

export const STRAIGHT_PATH: readonly Point[] = [
  { x: 858, y: 904 },
  { x: 985, y: 858 },
  { x: 1108, y: 800 },
  { x: 1224, y: 724 },
  { x: 1330, y: 630 },
];

const catmull = (a: Point, b: Point, c: Point, d: Point, t: number): Point => {
  const t2 = t * t;
  const t3 = t2 * t;
  const blend = (p0: number, p1: number, p2: number, p3: number) =>
    0.5 *
    (2 * p1 +
      (p2 - p0) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (3 * p1 - p0 - 3 * p2 + p3) * t3);
  return { x: blend(a.x, b.x, c.x, d.x), y: blend(a.y, b.y, c.y, d.y) };
};

const smooth = (anchors: readonly Point[]): Point[] => {
  const result: Point[] = [];
  const at = (index: number) =>
    anchors[Math.max(0, Math.min(anchors.length - 1, index))] ?? { x: 0, y: 0 };
  for (let span = 0; span < anchors.length - 1; span++) {
    for (let step = 0; step < SAMPLES_PER_SPAN; step++) {
      result.push(
        catmull(at(span - 1), at(span), at(span + 1), at(span + 2), step / SAMPLES_PER_SPAN),
      );
    }
  }
  result.push(at(anchors.length - 1));
  return result;
};

const lengthOf = (points: readonly Point[]) => {
  let total = 0;
  for (let index = 1; index < points.length; index++) {
    const a = points[index - 1];
    const b = points[index];
    if (a !== undefined && b !== undefined) {
      total += Math.hypot(b.x - a.x, b.y - a.y);
    }
  }
  return total;
};

const shake = (points: readonly Point[], amount: number, seed: number): Point[] =>
  points.map((point, index) => {
    const next = points[Math.min(points.length - 1, index + 1)] ?? point;
    const previous = points[Math.max(0, index - 1)] ?? point;
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const norm = Math.hypot(dx, dy) || 1;
    const along = index / Math.max(1, points.length - 1);
    const offset =
      amount *
      (1.1 * Math.sin(along * 23 + seed) +
        0.6 * Math.sin(along * 57 + seed * 2.3) +
        0.35 * Math.sin(along * 131 + seed * 4.1));
    const fade = Math.min(1, along * 12, (1 - along) * 12);
    return { x: point.x - (dy / norm) * offset * fade, y: point.y + (dx / norm) * offset * fade };
  });

const stroke = (points: Point[]): Stroke => ({ points, length: lengthOf(points) });

export const shaft = (anchors: readonly Point[], wobble: number, seed: number): Stroke =>
  stroke(shake(smooth(anchors), wobble * 1.4, seed));

export const head = (shaftStroke: Stroke, size: number): Stroke => {
  const { points } = shaftStroke;
  const tip = points.at(-1) ?? { x: 0, y: 0 };
  const back = points[Math.max(0, points.length - 6)] ?? tip;
  const angle = Math.atan2(tip.y - back.y, tip.x - back.x) + Math.PI;
  const barb = (turn: number, scale: number): Point => ({
    x: tip.x + Math.cos(angle + turn) * size * scale,
    y: tip.y + Math.sin(angle + turn) * size * scale,
  });
  return stroke([barb(BARB_ANGLE, 1), tip, barb(-BARB_ANGLE, 0.92)]);
};

export const line = (from: Point, to: Point, sag: number, wobble: number, seed: number): Stroke => {
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 + sag };
  return stroke(shake(smooth([from, middle, to]), wobble * 0.9, seed));
};

export const pathData = (points: readonly Point[]) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
