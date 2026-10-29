export type Point = readonly [number, number];

export interface Polyline {
  points: Point[];
  cumulative: number[];
  total: number;
}

export const DEG = Math.PI / 180;

const cubicPoint = ([p0, p1, p2, p3]: readonly [Point, Point, Point, Point], t: number): Point => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
};

export const sampleCubic = (
  controls: readonly [Point, Point, Point, Point],
  segments = 48,
): Point[] => Array.from({ length: segments + 1 }, (_, i) => cubicPoint(controls, i / segments));

export const sampleArc = (
  center: Point,
  radius: number,
  from: number,
  to: number,
  segments = 40,
): Point[] =>
  Array.from({ length: segments + 1 }, (_, i) => {
    const angle = from + ((to - from) * i) / segments;
    return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius];
  });

export const polyline = (points: Point[]): Polyline => {
  const cumulative = [0];
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1] ?? [0, 0];
    const current = points[index] ?? [0, 0];
    cumulative.push(
      (cumulative[index - 1] ?? 0) + Math.hypot(current[0] - previous[0], current[1] - previous[1]),
    );
  }
  return { points, cumulative, total: cumulative.at(-1) ?? 0 };
};

export const pointAlong = (line: Polyline, fraction: number): { point: Point; angle: number } => {
  const target = Math.min(1, Math.max(0, fraction)) * line.total;
  let index = 1;
  while (index < line.points.length - 1 && (line.cumulative[index] ?? 0) < target) {
    index++;
  }
  const start = line.points[index - 1] ?? [0, 0];
  const end = line.points[index] ?? start;
  const startLength = line.cumulative[index - 1] ?? 0;
  const span = (line.cumulative[index] ?? startLength) - startLength;
  const local = span > 0 ? (target - startLength) / span : 0;
  return {
    point: [start[0] + (end[0] - start[0]) * local, start[1] + (end[1] - start[1]) * local],
    angle: Math.atan2(end[1] - start[1], end[0] - start[0]),
  };
};

export const pathData = (points: Point[]): string =>
  points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');

export const leafPath = (length: number, width: number): string => {
  const half = width / 2;
  return [
    'M0 0',
    `C${length * 0.28} ${-half * 1.25} ${length * 0.74} ${-half * 1.05} ${length} 0`,
    `C${length * 0.74} ${half * 1.05} ${length * 0.28} ${half * 1.25} 0 0`,
    'Z',
  ].join(' ');
};

export const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x);

export const timeToReach = (fraction: number): number =>
  1 - Math.sqrt(Math.max(0, 1 - Math.min(1, fraction)));
