import { contrast, fromLab, legibleOn, toLab } from '../../kit/lab-color';

const BOARD_CONTRAST = 2.6;
const MIN_FLOOR = 1.9;
const MIN_DISTANCE = 0.14;
const STEPS = 24;

const distance = (a: string, b: string) => {
  const x = toLab(a);
  const y = toLab(b);
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b);
};

const shifted = (color: string, direction: number, t: number) => {
  const lab = toLab(color);
  const target = direction < 0 ? 0.3 : 1;
  return fromLab({
    l: lab.l + (target - lab.l) * t,
    a: lab.a * (1 + 0.6 * t),
    b: lab.b * (1 + 0.6 * t),
  });
};

const awayFrom = (color: string, text: string, background: string, direction: number) => {
  for (let step = 1; step <= STEPS; step++) {
    const candidate = shifted(color, direction, step / STEPS);
    if (contrast(candidate, background) < MIN_FLOOR) {
      return null;
    }
    if (distance(candidate, text) >= MIN_DISTANCE) {
      return candidate;
    }
  }
  return null;
};

export const accentColor = (primary: string, background: string, text: string): string => {
  const legible = legibleOn(primary, background, BOARD_CONTRAST);
  if (distance(legible, text) >= MIN_DISTANCE) {
    return legible;
  }
  const textLight = toLab(text).l > toLab(legible).l;
  const first = textLight ? -1 : 1;
  return (
    awayFrom(legible, text, background, first) ??
    awayFrom(legible, text, background, -first) ??
    legible
  );
};
