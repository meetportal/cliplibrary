export type Point = { x: number; y: number };

export type Box = { width: number; height: number; radius: number };

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export const hermite = (
  frame: number,
  [start, end]: readonly [number, number],
  [from, to]: readonly [number, number],
  startSpeed: number,
  endSpeed: number,
): number => {
  if (frame <= start) {
    return from;
  }
  if (frame >= end || end <= start) {
    return to;
  }
  const frames = end - start;
  const distance = to - from;
  if (distance === 0) {
    return to;
  }
  const limit = 2.9;
  const m0 = clamp((startSpeed * frames) / distance, 0, limit);
  const m1 = clamp((endSpeed * frames) / distance, 0, limit);
  const t = (frame - start) / frames;
  const t2 = t * t;
  const t3 = t2 * t;
  const shape = (t3 - 2 * t2 + t) * m0 + (3 * t2 - 2 * t3) + (t3 - t2) * m1;
  return from + distance * shape;
};

export const fitBox = (aspect: number, maxWidth: number, maxHeight: number) =>
  aspect >= maxWidth / maxHeight
    ? { width: maxWidth, height: maxWidth / aspect }
    : { width: maxHeight * aspect, height: maxHeight };

const cornerClear = (
  inner: { width: number; height: number },
  outer: { width: number; height: number },
  radius: number,
) => {
  const centerX = outer.width / 2 - radius;
  const centerY = outer.height / 2 - radius;
  const dx = Math.max(0, inner.width / 2 - centerX);
  const dy = Math.max(0, inner.height / 2 - centerY);
  return Math.hypot(dx, dy) <= radius + 0.5;
};

export const plateBox = (
  logo: { width: number; height: number },
  padding: number,
  roundness: number,
): Box => {
  for (let extra = 0; extra < 600; extra += 2) {
    const width = logo.width + 2 * (padding + extra);
    const height = logo.height + 2 * (padding + extra);
    const radius = (roundness / 100) * (Math.min(width, height) / 2);
    if (cornerClear(logo, { width, height }, radius)) {
      return { width, height, radius };
    }
  }
  const side = Math.hypot(logo.width, logo.height) + 2 * padding;
  return { width: side, height: side, radius: side / 2 };
};

type Cubic = readonly [Point, Point, Point, Point];

const cubicAt = ([a, b, c, d]: Cubic, t: number): Point => {
  const u = 1 - t;
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;
  return {
    x: w0 * a.x + w1 * b.x + w2 * c.x + w3 * d.x,
    y: w0 * a.y + w1 * b.y + w2 * c.y + w3 * d.y,
  };
};

const SAMPLES = 96;

export type Curve = { cubic: Cubic; lengths: number[]; length: number };

export const curve = (cubic: Cubic): Curve => {
  const lengths = [0];
  let previous = cubic[0];
  let total = 0;
  for (let step = 1; step <= SAMPLES; step++) {
    const point = cubicAt(cubic, step / SAMPLES);
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    lengths.push(total);
    previous = point;
  }
  return { cubic, lengths, length: total };
};

export const curveAt = ({ cubic, lengths, length }: Curve, distance: number): Point => {
  const target = clamp(distance, 0, length);
  let low = 0;
  let high = SAMPLES;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if ((lengths[middle] ?? 0) < target) {
      low = middle;
    } else {
      high = middle;
    }
  }
  const from = lengths[low] ?? 0;
  const to = lengths[high] ?? length;
  const local = to > from ? (target - from) / (to - from) : 0;
  return cubicAt(cubic, (low + local) / SAMPLES);
};

export const curveD = ({ cubic: [, b, c, d] }: Curve): string =>
  `C ${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;

export const ringStartAngle = -Math.PI / 2;

export const ringPoint = (center: Point, radius: number, distance: number): Point => {
  const angle = ringStartAngle - distance / radius;
  return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
};

export const ringD = (center: Point, radius: number): string => {
  const top = { x: center.x, y: center.y - radius };
  const bottom = { x: center.x, y: center.y + radius };
  return `M ${top.x} ${top.y} A ${radius} ${radius} 0 1 0 ${bottom.x} ${bottom.y} A ${radius} ${radius} 0 1 0 ${top.x} ${top.y}`;
};

export const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const roundedRectD = (
  center: Point,
  width: number,
  height: number,
  corner: number,
): string => {
  const r = Math.max(0, Math.min(corner, width / 2, height / 2));
  const left = center.x - width / 2;
  const top = center.y - height / 2;
  const right = left + width;
  const bottom = top + height;
  return [
    `M ${left + r} ${top}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${left + r}`,
    `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
    'Z',
  ].join(' ');
};
