import { contrast, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const PLATE_CONTRAST = 4.5;
const MIN_FLOOR = 3.6;
const MIN_DISTANCE = 0.12;
const STEPS = 24;

const distance = (a: string, b: string) => {
  const x = toLab(a);
  const y = toLab(b);
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b);
};

const richer = (color: string, t: number) => {
  const lab = toLab(color);
  return fromLab({ l: lab.l - 0.3 * t, a: lab.a * (1 + 1.2 * t), b: lab.b * (1 + 1.2 * t) });
};

export const accentColor = (primary: string, background: string, text: string): string => {
  const legible = legibleOn(primary, background, PLATE_CONTRAST);
  if (distance(legible, text) >= MIN_DISTANCE) {
    return legible;
  }
  for (let step = 1; step <= STEPS; step++) {
    const candidate = richer(legible, step / STEPS);
    if (contrast(candidate, background) < MIN_FLOOR) {
      break;
    }
    if (distance(candidate, text) >= MIN_DISTANCE) {
      return candidate;
    }
  }
  return legible;
};

const DUST_CONTRAST = 7;
const SPECK_CONTRAST = 3;
const LIGHT_PLATE = 9;

export type MarkInks = { dust: string; dark: string };

const darkSpeckInk = (background: string, edge: string) => {
  if (contrast(background, '#000000') < LIGHT_PLATE) {
    return edge;
  }
  for (let step = 1; step <= STEPS; step++) {
    const candidate = mixLab(background, '#000000', step / STEPS);
    if (contrast(candidate, background) >= SPECK_CONTRAST) {
      return candidate;
    }
  }
  return '#000000';
};

export const markInks = (dust: string, background: string, edge: string): MarkInks => ({
  dust: legibleOn(dust, background, DUST_CONTRAST),
  dark: darkSpeckInk(background, edge),
});
