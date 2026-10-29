import type { InviteFrameShape } from '@/schemas';
import { type Point, type Polyline, polyline, sampleArc } from './geometry';

interface FrameAnchor {
  index: number;
  direction: number;
  size: number;
}

export interface FrameShape {
  line: Polyline;
  anchors: FrameAnchor[];
  textShift: number;
}

const rectangle = (width: number, height: number): FrameShape => {
  const x = width / 2;
  const y = height / 2;
  const points: Point[] = [
    [0, -y],
    [x, -y],
    [x, y],
    [-x, y],
    [-x, -y],
    [0, -y],
  ];
  return {
    line: polyline(points),
    anchors: [
      { index: 1, direction: -45, size: 1 },
      { index: 2, direction: 45, size: 1 },
      { index: 3, direction: 135, size: 1 },
      { index: 4, direction: -135, size: 1 },
    ],
    textShift: 0,
  };
};

const hexagon = (width: number, height: number): FrameShape => {
  const x = width / 2;
  const shoulder = width * 0.3;
  const y = height / 2;
  const points: Point[] = [
    [0, -y],
    [shoulder, -y],
    [x, 0],
    [shoulder, y],
    [0, y],
    [-shoulder, y],
    [-x, 0],
    [-shoulder, -y],
    [0, -y],
  ];
  return {
    line: polyline(points),
    anchors: [
      { index: 2, direction: 0, size: 1 },
      { index: 4, direction: 90, size: 1.15 },
      { index: 6, direction: 180, size: 1 },
    ],
    textShift: 0,
  };
};

const arch = (width: number, height: number): FrameShape => {
  const radius = width / 2;
  const y = height / 2;
  const spring = -y + radius;
  const top = sampleArc([0, spring], radius, -Math.PI / 2, 0);
  const closing = sampleArc([0, spring], radius, Math.PI, Math.PI * 1.5);
  const points: Point[] = [...top, [radius, y], [-radius, y], ...closing];
  return {
    line: polyline(points),
    anchors: [
      { index: top.length, direction: -50, size: 0.9 },
      { index: top.length + 1, direction: -128, size: 1.3 },
    ],
    textShift: height * 0.06,
  };
};

export const frameShape = (shape: InviteFrameShape, width: number, height: number): FrameShape => {
  if (shape === 'hexagon') {
    return hexagon(width, height);
  }
  if (shape === 'arch') {
    return arch(width, height);
  }
  return rectangle(width, height);
};
