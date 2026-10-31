import type { Corners, Plane } from './plane-track';

type Point = [number, number];
type Line = { point: Point; direction: Point };
type Pose = Record<string, Corners>;

export type EdgeSpread = { left: string; right: string };

const SEARCH = 20;
const STEP = 4;
const INSET = 0.08;
const MIN_POINTS = 8;
const EDGE_CONTRAST = 4;
const FOLD_CONTRAST = 1.5;
const MIN_SPAN = 24;
const KEEP_WITHIN = 1.5;
const SMOOTHING = [1, 4, 6, 4, 1];

const pixel = (plane: Plane, x: number, y: number) => plane.gray[y * plane.width + x] ?? 0;

const sample = (plane: Plane, x: number, y: number): number => {
  const x0 = Math.min(plane.width - 2, Math.max(0, Math.floor(x)));
  const y0 = Math.min(plane.height - 2, Math.max(0, Math.floor(y)));
  const fx = x - x0;
  const fy = y - y0;
  const top = pixel(plane, x0, y0) * (1 - fx) + pixel(plane, x0 + 1, y0) * fx;
  const bottom = pixel(plane, x0, y0 + 1) * (1 - fx) + pixel(plane, x0 + 1, y0 + 1) * fx;
  return top * (1 - fy) + bottom * fy;
};

const unit = ([x, y]: Point): Point => {
  const length = Math.hypot(x, y) || 1;
  return [x / length, y / length];
};

const strongestStep = (
  plane: Plane,
  base: Point,
  normal: Point,
  along: Point,
  contrast: number,
): number | null => {
  const profile: number[] = [];
  for (let offset = -SEARCH - 1; offset <= SEARCH + 1; offset += 1) {
    const x = base[0] + normal[0] * offset;
    const y = base[1] + normal[1] * offset;
    let sum = 0;
    for (let k = -2; k <= 2; k += 1) {
      sum += sample(plane, x + along[0] * k, y + along[1] * k);
    }
    profile.push(sum / 5);
  }
  const steps = profile
    .slice(1, -1)
    .map((_, index) => Math.abs((profile[index + 2] ?? 0) - (profile[index] ?? 0)) / 2);
  let best = 0;
  steps.forEach((value, index) => {
    if (value > (steps[best] ?? 0)) {
      best = index;
    }
  });
  const peak = steps[best] ?? 0;
  if (peak < contrast || best === 0 || best === steps.length - 1) {
    return null;
  }
  const before = steps[best - 1] ?? 0;
  const after = steps[best + 1] ?? 0;
  const curve = before - 2 * peak + after;
  const shift = curve === 0 ? 0 : (0.5 * (before - after)) / curve;
  return best + shift - SEARCH;
};

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};

type Hit = { distance: number; offset: number };

const robustFit = (hits: Hit[]): { slope: number; intercept: number } | null => {
  if (hits.length < MIN_POINTS) {
    return null;
  }
  const slopes: number[] = [];
  hits.forEach((first, at) => {
    for (const second of hits.slice(at + 1)) {
      if (Math.abs(second.distance - first.distance) > MIN_SPAN) {
        slopes.push((second.offset - first.offset) / (second.distance - first.distance));
      }
    }
  });
  let slope = median(slopes);
  let intercept = median(hits.map(({ distance, offset }) => offset - slope * distance));
  const kept = hits.filter(
    ({ distance, offset }) => Math.abs(offset - slope * distance - intercept) <= KEEP_WITHIN,
  );
  if (kept.length < MIN_POINTS) {
    return null;
  }
  const md = kept.reduce((sum, hit) => sum + hit.distance, 0) / kept.length;
  const mo = kept.reduce((sum, hit) => sum + hit.offset, 0) / kept.length;
  const spread = kept.reduce((sum, hit) => sum + (hit.distance - md) ** 2, 0);
  slope =
    spread === 0
      ? slope
      : kept.reduce((sum, hit) => sum + (hit.distance - md) * (hit.offset - mo), 0) / spread;
  intercept = mo - slope * md;
  return { slope, intercept };
};

const measureEdge = (plane: Plane, from: Point, to: Point, contrast: number): Line | null => {
  const along = unit([to[0] - from[0], to[1] - from[1]]);
  const normal: Point = [-along[1], along[0]];
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const hits: Hit[] = [];
  for (let distance = length * INSET; distance <= length * (1 - INSET); distance += STEP) {
    const base: Point = [from[0] + along[0] * distance, from[1] + along[1] * distance];
    const offset = strongestStep(plane, base, normal, along, contrast);
    if (offset !== null) {
      hits.push({ distance, offset });
    }
  }
  const fit = robustFit(hits);
  if (fit === null) {
    return null;
  }
  return {
    point: [from[0] + normal[0] * fit.intercept, from[1] + normal[1] * fit.intercept],
    direction: unit([along[0] + normal[0] * fit.slope, along[1] + normal[1] * fit.slope]),
  };
};

const through = (from: Point, to: Point): Line => ({
  point: from,
  direction: unit([to[0] - from[0], to[1] - from[1]]),
});

const meet = (first: Line, second: Line): Point => {
  const [ax, ay] = first.point;
  const [dx, dy] = first.direction;
  const [bx, by] = second.point;
  const [ex, ey] = second.direction;
  const determinant = dx * ey - dy * ex;
  if (Math.abs(determinant) < 1e-9) {
    return [ax, ay];
  }
  const t = ((bx - ax) * ey - (by - ay) * ex) / determinant;
  return [ax + dx * t, ay + dy * t];
};

const middle = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

export const refineSpread = (plane: Plane, guess: Pose, { left, right }: EdgeSpread): Pose => {
  const l = guess[left];
  const r = guess[right];
  if (l === undefined || r === undefined) {
    return guess;
  }
  const edge = (from: Point, to: Point, contrast = EDGE_CONTRAST) =>
    measureEdge(plane, from, to, contrast) ?? through(from, to);
  const topLeft = edge(l[0], l[1]);
  const topRight = edge(r[0], r[1]);
  const bottomLeft = edge(l[3], l[2]);
  const bottomRight = edge(r[3], r[2]);
  const outerLeft = edge(l[0], l[3]);
  const outerRight = edge(r[1], r[2]);
  const fold = edge(l[1], l[2], FOLD_CONTRAST);
  const foldTop = middle(meet(topLeft, fold), meet(topRight, fold));
  const foldBottom = middle(meet(bottomLeft, fold), meet(bottomRight, fold));
  return {
    ...guess,
    [left]: [meet(topLeft, outerLeft), foldTop, foldBottom, meet(bottomLeft, outerLeft)],
    [right]: [foldTop, meet(topRight, outerRight), meet(bottomRight, outerRight), foldBottom],
  };
};

export const smoothRun = (poses: Map<number, Pose>, frames: number[]): void => {
  const original = new Map(frames.map((index) => [index, poses.get(index)]));
  const reach = Math.floor(SMOOTHING.length / 2);
  frames.forEach((index, at) => {
    const pose = original.get(index);
    if (pose === undefined) {
      return;
    }
    const smoothed: Pose = {};
    for (const [name, corners] of Object.entries(pose)) {
      smoothed[name] = corners.map((corner, cornerIndex) =>
        corner.map((_, axis) => {
          let total = 0;
          let weight = 0;
          for (let shift = -reach; shift <= reach; shift += 1) {
            const value = original.get(frames[at + shift] ?? -1)?.[name]?.[cornerIndex]?.[axis];
            const share = SMOOTHING[shift + reach] ?? 0;
            if (value !== undefined) {
              total += value * share;
              weight += share;
            }
          }
          return total / weight;
        }),
      ) as Corners;
    }
    poses.set(index, smoothed);
  });
};
