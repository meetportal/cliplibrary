import type { ArchSaveTheDateProps } from '@/schemas';

const STAGE_WIDTH = 1080;

export const CENTER_X = STAGE_WIDTH / 2;

export interface WorldBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ArchShape {
  halfWidth: number;
  apexY: number;
  springY: number;
  sillY: number;
}

export const archShape = (arch: ArchSaveTheDateProps['arch']): ArchShape => {
  const halfWidth = arch.width / 2;
  return {
    halfWidth,
    apexY: arch.top,
    springY: Math.min(arch.top + halfWidth * arch.point, arch.sill - 40),
    sillY: arch.sill,
  };
};

const offsetFor = (shape: ArchShape): number => {
  const rise = Math.max(1, shape.springY - shape.apexY);
  const h = shape.halfWidth;
  return Math.max(0, (rise * rise - h * h) / (2 * h));
};

const radiusFor = (shape: ArchShape): number => shape.halfWidth + offsetFor(shape);

const apexAngle = (shape: ArchShape): number => Math.acos(offsetFor(shape) / radiusFor(shape));

const leftPoint = (shape: ArchShape, angle: number): [number, number] => {
  const radius = radiusFor(shape);
  const rise = shape.springY - shape.apexY;
  const yScale = rise < shape.halfWidth ? rise / shape.halfWidth : 1;
  return [
    CENTER_X + offsetFor(shape) - radius * Math.cos(angle),
    shape.springY - radius * Math.sin(angle) * yScale,
  ];
};

const point = ([x, y]: [number, number]): string => `${x.toFixed(2)} ${y.toFixed(2)}`;

const halfCurve = (shape: ArchShape, lobes: number, mirror: boolean): string[] => {
  const top = apexAngle(shape);
  const steps = Math.max(1, lobes);
  const flip = ([x, y]: [number, number]): [number, number] =>
    mirror ? [2 * CENTER_X - x, y] : [x, y];
  const commands: string[] = [];
  for (let index = 1; index <= steps; index++) {
    const from = mirror ? top * (1 - (index - 1) / steps) : top * ((index - 1) / steps);
    const to = mirror ? top * (1 - index / steps) : top * (index / steps);
    const start = flip(leftPoint(shape, from));
    const end = flip(leftPoint(shape, to));
    if (lobes === 0) {
      const radius = radiusFor(shape);
      commands.push(`A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 0 1 ${point(end)}`);
    } else {
      const chord = Math.hypot(end[0] - start[0], end[1] - start[1]);
      const lobe = chord * 0.6;
      commands.push(`A ${lobe.toFixed(2)} ${lobe.toFixed(2)} 0 0 1 ${point(end)}`);
    }
  }
  return commands;
};

export const archPath = (shape: ArchShape, lobes: number, closed = true): string => {
  const left = CENTER_X - shape.halfWidth;
  const right = CENTER_X + shape.halfWidth;
  return [
    `M ${left} ${shape.sillY}`,
    `L ${left} ${shape.springY}`,
    ...halfCurve(shape, lobes, false),
    ...halfCurve(shape, lobes, true),
    `L ${right} ${shape.sillY}`,
    closed ? 'Z' : '',
  ].join(' ');
};

export const growArch = (shape: ArchShape, by: number): ArchShape => ({
  halfWidth: shape.halfWidth + by,
  apexY: shape.apexY - by * 1.15,
  springY: shape.springY,
  sillY: shape.sillY,
});

export const archYAt = (shape: ArchShape, x: number): number => {
  const radius = radiusFor(shape);
  const offset = offsetFor(shape);
  const dx = Math.abs(x - CENTER_X);
  const fromCenter = offset + dx;
  if (fromCenter >= radius) {
    return shape.springY;
  }
  const rise = shape.springY - shape.apexY;
  const yScale = rise < shape.halfWidth ? rise / shape.halfWidth : 1;
  return shape.springY - Math.sqrt(radius * radius - fromCenter * fromCenter) * yScale;
};

export const seeded = (index: number, salt: number): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const wrap = (value: number, span: number): number => ((value % span) + span) % span;
