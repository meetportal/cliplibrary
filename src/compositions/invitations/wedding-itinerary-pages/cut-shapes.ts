import { interpolateColors } from 'remotion';

export type CutShape = {
  d: string;
  fill: string;
  opacity?: number;
  flat?: boolean;
  stroke?: number;
};

export type CutLayers = readonly [CutShape[], CutShape[], CutShape[]];

export const SCENE_WIDTH = 1080;

export const SCENE_HEIGHT = 640;

const round = (value: number): string => value.toFixed(2);

export const tone = (from: string, to: string, amount: number): string =>
  interpolateColors(amount, [0, 1], [from, to]);

export const circle = (cx: number, cy: number, r: number): string =>
  `M${round(cx - r)} ${round(cy)}a${round(r)} ${round(r)} 0 1 0 ${round(2 * r)} 0a${round(r)} ${round(r)} 0 1 0 ${round(-2 * r)} 0Z`;

export const ellipse = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${round(cx - rx)} ${round(cy)}a${round(rx)} ${round(ry)} 0 1 0 ${round(2 * rx)} 0a${round(rx)} ${round(ry)} 0 1 0 ${round(-2 * rx)} 0Z`;

export const rect = (x: number, y: number, w: number, h: number, r = 0): string => {
  const radius = Math.min(r, w / 2, h / 2);
  if (radius <= 0) {
    return `M${round(x)} ${round(y)}h${round(w)}v${round(h)}h${round(-w)}Z`;
  }
  return [
    `M${round(x + radius)} ${round(y)}`,
    `h${round(w - 2 * radius)}`,
    `a${round(radius)} ${round(radius)} 0 0 1 ${round(radius)} ${round(radius)}`,
    `v${round(h - 2 * radius)}`,
    `a${round(radius)} ${round(radius)} 0 0 1 ${round(-radius)} ${round(radius)}`,
    `h${round(-(w - 2 * radius))}`,
    `a${round(radius)} ${round(radius)} 0 0 1 ${round(-radius)} ${round(-radius)}`,
    `v${round(-(h - 2 * radius))}`,
    `a${round(radius)} ${round(radius)} 0 0 1 ${round(radius)} ${round(-radius)}Z`,
  ].join('');
};

export const polygon = (points: readonly (readonly [number, number])[]): string =>
  `${points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join('')}Z`;

export const polyline = (points: readonly (readonly [number, number])[]): string =>
  points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join('');

export const leaf = (
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
): string => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (along: number, across: number): string =>
    `${round(x + along * cos - across * sin)} ${round(y + along * sin + across * cos)}`;
  return `M${at(0, 0)}Q${at(length * 0.45, width)} ${at(length, 0)}Q${at(length * 0.45, -width)} ${at(0, 0)}Z`;
};

export const swagPoints = (
  [x0, y0]: readonly [number, number],
  [x1, y1]: readonly [number, number],
  sag: number,
  count: number,
): [number, number][] =>
  Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)];
  });

const SCENE_REACH = 600;

export const hedge = (
  top: number,
  bumps: number,
  height: number,
  phase: number,
  bottom = SCENE_HEIGHT,
): string => {
  const step = (SCENE_WIDTH + 80) / bumps;
  const left = -SCENE_REACH;
  const count = Math.ceil((SCENE_WIDTH + 2 * SCENE_REACH) / step);
  const crest = Array.from({ length: count }, (_, index) => {
    const lift = height * (0.6 + 0.4 * Math.sin(index * 1.7 + phase));
    const x = left + step * (index + 1);
    return `Q${round(x - step / 2)} ${round(top - lift)} ${round(x)} ${round(top)}`;
  });
  const right = left + step * count;
  return `M${left} ${round(bottom)}L${left} ${round(top)}${crest.join('')}L${round(right)} ${round(bottom)}Z`;
};

export const widenSwag = (
  from: readonly [number, number],
  to: readonly [number, number],
  sag: number,
): { start: [number, number]; end: [number, number]; sag: number } => {
  const at = (x: number): number => {
    const t = (x - from[0]) / (to[0] - from[0]);
    return from[1] + (to[1] - from[1]) * t + sag * 4 * t * (1 - t);
  };
  const left = -SCENE_REACH;
  const right = SCENE_WIDTH + SCENE_REACH;
  const start: [number, number] = [left, at(left)];
  const end: [number, number] = [right, at(right)];
  return { start, end, sag: at((left + right) / 2) - (start[1] + end[1]) / 2 };
};

export const swing = (
  pivot: readonly [number, number],
  angle: number,
  [x, y]: readonly [number, number],
): [number, number] => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - pivot[0];
  const dy = y - pivot[1];
  return [pivot[0] + dx * cos - dy * sin, pivot[1] + dx * sin + dy * cos];
};
