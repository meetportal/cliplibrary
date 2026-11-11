import { Easing, interpolate } from 'remotion';

export const CENTER_X = 540;
const VANISH_Y = 1350;
export const SPRING_Y = 940;
export const FLOOR_Y = 1920;
const OPENING_HALF = 350;
const OPENING_APEX = 480;
export const COLUMN_X = 430;

const FOCAL = 1;
const GAP = 0.75;
const LAST_START_SCALE = 0.64;
const TERRACE_DEPTH = 4;
const CULL_DEPTH = 0.09;

type Point = readonly [number, number];

const bezier = (a: Point, b: Point, c: Point, d: Point, t: number): Point => {
  const u = 1 - t;
  const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
  const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
  return [x, y];
};

const round = (value: number) => Math.round(value * 10) / 10;

const sideCusps = (half: number, apex: number, lobes: number): Point[] => {
  const rise = SPRING_Y - apex;
  const start: Point = [CENTER_X - half, SPRING_Y];
  const c1: Point = [CENTER_X - half, SPRING_Y - rise * 0.62];
  const c2: Point = [CENTER_X - half * 0.42, apex + rise * 0.1];
  const end: Point = [CENTER_X, apex];
  const points: Point[] = [];
  for (let index = 0; index <= lobes; index++) {
    points.push(bezier(start, c1, c2, end, index / lobes));
  }
  return points;
};

export const cuspedOutline = (half: number, apex: number, closed = true, lobes = 4): string => {
  const left = sideCusps(half, apex, lobes);
  const right = [...left].reverse().map(([x, y]): Point => [CENTER_X * 2 - x, y]);
  const parts = [`M ${round(CENTER_X - half)} ${round(SPRING_Y)}`];
  const lobe = (from: Point, to: Point) => {
    const radius = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.56;
    parts.push(`A ${round(radius)} ${round(radius)} 0 0 1 ${round(to[0])} ${round(to[1])}`);
  };
  for (let index = 1; index < left.length; index++) {
    lobe(left[index - 1] as Point, left[index] as Point);
  }
  for (let index = 1; index < right.length; index++) {
    lobe(right[index - 1] as Point, right[index] as Point);
  }
  if (closed) {
    parts.push('Z');
  }
  return parts.join(' ');
};

export const BANDS = [
  { half: OPENING_HALF + 150, apex: OPENING_APEX - 225 },
  { half: OPENING_HALF + 100, apex: OPENING_APEX - 150 },
  { half: OPENING_HALF + 50, apex: OPENING_APEX - 75 },
  { half: OPENING_HALF, apex: OPENING_APEX },
] as const;

const dollyEase = Easing.bezier(0.25, 0.55, 0.35, 1);

export type Dolly = { travelled: number; total: number };

export const dollyAt = (frame: number, arches: number, dollyFrames: number): Dolly => {
  const total = Math.max(0, arches - 2) * GAP + FOCAL / LAST_START_SCALE - FOCAL;
  const progress = interpolate(frame, [0, Math.max(1, dollyFrames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: dollyEase,
  });
  return { travelled: total * progress, total };
};

export const archDepth = (index: number, arches: number, dolly: Dolly): number =>
  FOCAL + (index - (arches - 1)) * GAP + (dolly.total - dolly.travelled);

export const scaleAtDepth = (depth: number): number | null =>
  depth <= CULL_DEPTH ? null : FOCAL / depth;

export const terraceScale = (dolly: Dolly): number =>
  TERRACE_DEPTH / (TERRACE_DEPTH + dolly.total - dolly.travelled);

export const aboutVanish = (scale: number): string =>
  `translate(${CENTER_X} ${VANISH_Y}) scale(${scale}) translate(${-CENTER_X} ${-VANISH_Y})`;
