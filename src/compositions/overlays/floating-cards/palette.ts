import type { FloatingCardsProps, FloatingCardsTone } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const TILE_TINT = 0.12;
const ICON_CONTRAST = 2.4;
const HIGHLIGHT_CONTRAST = 3.2;
const LABEL_CONTRAST = 3;
const VALUE_CONTRAST = 7;
const SHADOW_INK = '#1b1d2a';
const HIGHLIGHT_SEPARATION = 0.25;
const SEPARATION_STEPS = 24;
const HUE_WEIGHT = 2;
const MARK_CHROMA = 0.08;
const MARK_LIGHTNESS: [number, number] = [0.45, 0.6];
const TILE_CHROMA = 0.016;
const ANY_LIGHTNESS: [number, number] = [0, 1];
const LABEL_MIX = 0.45;

type CardTone = { tile: string; icon: string; highlight: string };

export type CardPalette = {
  tones: Record<FloatingCardsTone, CardTone>;
  value: string;
  label: string;
  surface: string;
  shadow: string;
};

const labDistance = (one: string, two: string) => {
  const a = toLab(one);
  const b = toLab(two);
  return Math.hypot(a.l - b.l, (a.a - b.a) * HUE_WEIGHT, (a.b - b.b) * HUE_WEIGHT);
};

const apartFrom = (color: string, ink: string, surface: string): string => {
  const start = toLab(color);
  const away = toLab(surface).l > toLab(ink).l ? 1 : 0;
  let best = color;
  for (let step = 0; step <= SEPARATION_STEPS; step++) {
    if (labDistance(best, ink) >= HIGHLIGHT_SEPARATION) {
      return best;
    }
    const candidate = fromLab({
      l: start.l + (away - start.l) * (step / SEPARATION_STEPS),
      a: start.a,
      b: start.b,
    });
    if (contrast(candidate, surface) < HIGHLIGHT_CONTRAST) {
      return best;
    }
    best = candidate;
  }
  return best;
};

const withChroma = (color: string, floor: number, lightness: [number, number]): string => {
  const lab = toLab(color);
  if (Math.hypot(lab.a, lab.b) >= floor) {
    return color;
  }
  const hue = Math.atan2(lab.b, lab.a);
  return fromLab(
    fitGamut({
      l: Math.min(lightness[1], Math.max(lightness[0], lab.l)),
      a: Math.cos(hue) * floor,
      b: Math.sin(hue) * floor,
    }),
  );
};

const tone = (color: string, surface: string, value: string): CardTone => {
  const mark = withChroma(color, MARK_CHROMA, MARK_LIGHTNESS);
  const tile = withChroma(
    mixLab(surface, legibleOn(mark, surface, ICON_CONTRAST), TILE_TINT),
    TILE_CHROMA,
    ANY_LIGHTNESS,
  );
  return {
    tile,
    icon: legibleOn(mark, tile, ICON_CONTRAST),
    highlight: apartFrom(legibleOn(color, surface, HIGHLIGHT_CONTRAST), value, surface),
  };
};

const quieter = (label: string, value: string, surface: string): string =>
  contrast(label, surface) < contrast(value, surface)
    ? label
    : legibleOn(mixLab(value, surface, LABEL_MIX), surface, LABEL_CONTRAST);

export const cardPalette = ({ colors }: FloatingCardsProps): CardPalette => {
  const value = legibleOn(colors.value, colors.surface, VALUE_CONTRAST);
  return {
    tones: {
      primary: tone(colors.primary, colors.surface, value),
      secondary: tone(colors.secondary, colors.surface, value),
      accent: tone(colors.accent, colors.surface, value),
    },
    value,
    label: quieter(legibleOn(colors.label, colors.surface, LABEL_CONTRAST), value, colors.surface),
    surface: colors.surface,
    shadow: mixLab(SHADOW_INK, colors.background, 0.2),
  };
};
