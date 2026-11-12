import type { CirclePopProps } from '@/schemas';
import { contrast, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const MIN_DISTANCE = 0.2;

const distance = (a: string, b: string) => {
  const x = toLab(a);
  const y = toLab(b);
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b);
};

const awayFrom = (color: string, avoid: string, backdrop: string, ratio: number): string => {
  if (distance(color, avoid) >= MIN_DISTANCE) {
    return color;
  }
  const start = toLab(color);
  const target = toLab(avoid);
  const directions = target.l < 0.5 ? [1, -1] : [-1, 1];
  for (const direction of directions) {
    for (let step = 1; step <= 40; step++) {
      const candidate = fromLab({ ...start, l: start.l + direction * step * 0.015 });
      if (distance(candidate, avoid) >= MIN_DISTANCE && contrast(candidate, backdrop) >= ratio) {
        return candidate;
      }
    }
  }
  return color;
};

const PALE_FROM = 0.7;
const PALE_RANGE = 0.15;

export const echoTint = (primary: string, surface: string, strength: number): string => {
  const hue = toLab(primary);
  const base = toLab(surface);
  const chroma = Math.hypot(hue.a, hue.b);
  const scale = chroma < 0.001 ? 0 : Math.min(0.09, chroma * strength * 3.2) / chroma;
  const deep = fromLab({ l: base.l - strength * 0.35, a: hue.a * scale, b: hue.b * scale });
  const pale = mixLab(surface, primary, Math.min(1, strength * 2.6));
  return mixLab(deep, pale, Math.max(0, Math.min(1, (hue.l - PALE_FROM) / PALE_RANGE)));
};

const deepened = (primary: string, surface: string, ratio: number): string => {
  const legible = legibleOn(primary, surface, ratio);
  if (legible === primary) {
    return primary;
  }
  const lab = toLab(legible);
  const chroma = Math.hypot(lab.a, lab.b);
  return fromLab({ l: lab.l, a: lab.a * 1.25 + chroma * 0.1, b: lab.b * 1.25 });
};

export type CirclePopPalette = {
  ink: string;
  surface: string;
  background: string;
  ripple: string;
  squiggle: string;
};

export const circlePopPalette = (colors: CirclePopProps['colors']): CirclePopPalette => {
  const ink = legibleOn(colors.text, colors.surface, 4.5);
  const squiggle = awayFrom(
    deepened(colors.primary, colors.surface, 2.4),
    ink,
    colors.surface,
    2.4,
  );
  return {
    ink,
    surface: colors.surface,
    background: colors.background,
    ripple: legibleOn(colors.primary, colors.background, 3),
    squiggle,
  };
};
