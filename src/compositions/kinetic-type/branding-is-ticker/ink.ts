import {
  type Color,
  clampChroma,
  converter,
  formatHex,
  interpolate,
  parse,
  wcagContrast,
} from 'culori';

const toOklch = converter('oklch');

const STEPS = 30;

const BLACK: Color = { mode: 'rgb', r: 0, g: 0, b: 0 };

const solid = (color: string): Color => parse(color) ?? BLACK;

const hex = (color: Color): string => formatHex(color) ?? '#000000';

const lightnessOf = (color: string) => toOklch(solid(color))?.l ?? 0;

export const mixOklab = (from: string, to: string, amount: number): string => {
  const blend = interpolate([solid(from), solid(to)], 'oklab');
  return hex(blend(Math.max(0, Math.min(1, amount))));
};

const contrastOf = (first: string, second: string) => wcagContrast(solid(first), solid(second));

const shifted = (color: string, lightness: number, hue = 0): string => {
  const lch = toOklch(solid(color));
  return hex(
    clampChroma(
      {
        mode: 'oklch',
        l: Math.max(0, Math.min(1, lightness)),
        c: lch?.c ?? 0,
        h: ((lch?.h ?? 0) + hue + 360) % 360,
      },
      'oklch',
    ),
  );
};

export const legible = (color: string, ground: string, floor: number): string => {
  if (contrastOf(color, ground) >= floor) {
    return hex(solid(color));
  }
  const base = lightnessOf(color);
  const darker = lightnessOf(ground) > 0.5;
  let best = hex(solid(color));
  for (let step = 1; step <= STEPS; step++) {
    const candidate = shifted(color, base + ((darker ? -1 : 1) * step * 0.7) / STEPS);
    best = candidate;
    if (contrastOf(candidate, ground) >= floor) {
      return candidate;
    }
  }
  return best;
};

export const gradientStops = (primary: string): [string, string] => {
  const lightness = lightnessOf(primary);
  const start = shifted(primary, Math.max(0.24, lightness - 0.14));
  const end = shifted(primary, Math.max(0.18, lightness - 0.32), -55);
  return [start, end];
};

export const inkOn = (fill: string, light: string, dark: string) =>
  contrastOf(light, fill) >= contrastOf(dark, fill) ? light : dark;

export const hueTint = (surface: string, primary: string, depth: number, strength: number) => {
  const base = toOklch(solid(surface));
  const hue = toOklch(solid(primary));
  return hex(
    clampChroma(
      {
        mode: 'oklch',
        l: Math.max(0, (base?.l ?? 1) - depth),
        c: Math.min(hue?.c ?? 0, 0.1) * strength,
        h: hue?.h ?? 0,
      },
      'oklch',
    ),
  );
};
