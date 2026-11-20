import type { PillStickerCollageProps } from '@/schemas';
import { contrast, legibleOn, mixLab } from '../../kit/lab-color';
import type { StickerStyle } from './layout';

type Paint = { fill: string; ink: string; line: string | null; ring: number };

export type Palette = Record<StickerStyle, Paint> & {
  burst: string;
  glow: string;
  background: string;
};

const FILL_SEPARATION = 1.7;
const RING_SEPARATION = 2.2;
const SEPARATION_RING = 2;
const SURFACE_SEPARATION = 1.4;
const TEXT_RATIO = 4.5;
const ACCENT_RATIO = 3;
const LARGE_TEXT_RATIO = 3;
const DARK_GLOW_CAP = 2.4;
const LIGHT_GLOW_CAP = 1.5;

const readableOn = (fill: string, first: string, second: string, ratio = LARGE_TEXT_RATIO) => {
  if (contrast(first, fill) >= ratio) {
    return first.slice(0, 7);
  }
  const pick = contrast(first, fill) >= contrast(second, fill) ? first : second;
  return legibleOn(pick, fill, ratio);
};

const worseOf = (color: string, grounds: string[]) =>
  grounds.reduce((worst, ground) =>
    contrast(color, ground) < contrast(color, worst) ? ground : worst,
  );

const readableOnAll = (grounds: string[], first: string, second: string, ratio: number) => {
  let ink = readableOn(grounds[0] ?? first, first, second, ratio);
  for (let pass = 0; pass < 3; pass++) {
    const worst = worseOf(ink, grounds);
    if (contrast(ink, worst) >= ratio) {
      return ink;
    }
    ink = legibleOn(ink, worst, ratio);
  }
  return ink;
};

const separated = (color: string, grounds: string[]) => {
  const worst = worseOf(color.slice(0, 7), grounds);
  return contrast(color, worst) >= FILL_SEPARATION
    ? color.slice(0, 7)
    : legibleOn(color, worst, FILL_SEPARATION);
};

const glowTint = (
  background: string,
  toward: string,
  strength: number,
  keeps: (glow: string) => boolean,
) => {
  const cap =
    contrast(background, '#000000') > contrast(background, '#ffffff')
      ? LIGHT_GLOW_CAP
      : DARK_GLOW_CAP;
  const allowed = (amount: number) => {
    const glow = mixLab(background, toward, amount);
    return contrast(glow, background) <= cap && keeps(glow);
  };
  if (allowed(strength)) {
    return mixLab(background, toward, strength);
  }
  let low = 0;
  let high = strength;
  for (let step = 0; step < 18; step++) {
    const middle = (low + high) / 2;
    if (allowed(middle)) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return mixLab(background, toward, low);
};

export const planPalette = (props: PillStickerCollageProps): Palette => {
  const { colors, backdrop } = props;
  const background = colors.background.slice(0, 7);
  const baseInk = readableOn(background, colors.text, colors.ink, TEXT_RATIO);
  const baseAccent = readableOn(background, colors.primary, colors.primary, ACCENT_RATIO);
  const baseFill = separated(colors.primary, [background]);
  const glow = glowTint(
    background,
    colors.glow.slice(0, 7),
    backdrop.glow,
    (tint) =>
      contrast(baseInk, tint) >= TEXT_RATIO &&
      contrast(baseAccent, tint) >= ACCENT_RATIO &&
      contrast(baseFill, tint) >= FILL_SEPARATION,
  );
  const grounds = [background, glow];
  const primary = separated(colors.primary, grounds);
  const surface = colors.surface.slice(0, 7);
  const onBackground = readableOnAll(grounds, colors.text, colors.ink, TEXT_RATIO);
  const accent = readableOnAll(grounds, colors.primary, colors.primary, ACCENT_RATIO);
  const surfaceInk = readableOn(surface, colors.ink, colors.text);
  const surfaceLine =
    contrast(surface, worseOf(surface, grounds)) < SURFACE_SEPARATION ? onBackground : null;
  return {
    primary: {
      fill: primary,
      ink: readableOn(primary, colors.text, colors.ink),
      line: null,
      ring: contrast(primary, worseOf(primary, grounds)) < RING_SEPARATION ? SEPARATION_RING : 0,
    },
    surface: { fill: surface, ink: surfaceInk, line: surfaceLine, ring: 0 },
    outline: { fill: 'transparent', ink: onBackground, line: onBackground, ring: 0 },
    'outline-accent': { fill: 'transparent', ink: accent, line: onBackground, ring: 0 },
    burst: legibleOn(colors.primary, surface, ACCENT_RATIO),
    glow,
    background,
  };
};
