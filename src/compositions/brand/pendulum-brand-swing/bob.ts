import { FRAME, PIVOT } from './swing';

export type BobShape = {
  width: number;
  height: number;
  ring: number;
  logoWidth: number;
  logoHeight: number;
};

const RING = 0.12;
const ROUND_LOGO = 0.9;
const CAPSULE_HEIGHT = 0.84;
const CAPSULE_LOGO = 0.56;
const CAPSULE_PAD = 0.7;
const MAX_LOGO_WIDTH = 1.7;
const WIDE = 1.5;
const EDGE_MARGIN = 14;

export const bobShape = (size: number, aspect: number | null, reach: number): BobShape => {
  const ratio = aspect ?? 1;
  const ring = size * RING;
  if (ratio <= WIDE) {
    const plate = size - 2 * ring;
    const logoWidth = (plate * ROUND_LOGO) / Math.max(reach, 1);
    return { width: size, height: size, ring, logoWidth, logoHeight: logoWidth / ratio };
  }
  const height = size * CAPSULE_HEIGHT;
  const plateHeight = height - 2 * ring;
  const wanted = plateHeight * CAPSULE_LOGO * ratio;
  const logoWidth = Math.min(wanted, size * MAX_LOGO_WIDTH);
  const plateWidth = logoWidth + plateHeight * CAPSULE_PAD;
  return {
    width: plateWidth + 2 * ring,
    height,
    ring,
    logoWidth,
    logoHeight: logoWidth / ratio,
  };
};

const horizontalReach = (shape: BobShape, angle: number) =>
  ((shape.width - shape.height) / 2) * Math.abs(Math.cos(angle)) + shape.height / 2;

export const verticalReach = (shape: BobShape, angle: number) =>
  ((shape.width - shape.height) / 2) * Math.abs(Math.sin(angle)) + shape.height / 2;

const fits = (shape: BobShape, length: number, angle: number) =>
  PIVOT.x + length * Math.sin(angle) + horizontalReach(shape, angle) <= FRAME.width - EDGE_MARGIN;

export const safeAmplitude = (shape: BobShape, length: number, wanted: number): number => {
  if (fits(shape, length, wanted)) {
    return wanted;
  }
  let low = 0;
  let high = wanted;
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (fits(shape, length, middle)) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return low;
};
