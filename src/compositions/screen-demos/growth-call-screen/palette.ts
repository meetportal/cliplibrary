import type { GrowthCallScreenProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

export type Palette = {
  background: string;
  glow: string;
  text: string;
  lines: string;
  muted: string;
  highlight: string;
  ripple: string;
  surface: string;
  surfaceTop: string;
  label: string;
  shimmer: string;
  fill: string;
  websiteInk: string;
  gloss: string;
  knob: string;
  knobEdge: string;
  accent: string;
  plate: string;
  plateRim: string | null;
};

const TEXT_CONTRAST = 4.5;
const CRISP_TEXT = 8;
const HIGHLIGHT_CONTRAST = 3.8;
const RIPPLE_CONTRAST = 2;
const BAR_CONTRAST = 1.18;
const LABEL_CONTRAST = 2.4;
const FILL_CONTRAST = 1.6;
const GLYPH_CONTRAST = 2.6;
const PLATE_CONTRAST = 1.35;
const MUTED_MIX = 0.3;
const QUIET_LINES = 0.22;
const MIN_CHROMA = 0.1;
const HUED = 0.02;
const DISTINCT = 0.12;
const BOOSTS = [1.4, 1.8, 2.4, 3.2];
const DARK_INK = '#0b0b0c';
const LIGHT_INK = '#ffffff';

const distance = (a: string, b: string) => {
  const left = toLab(a);
  const right = toLab(b);
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
};

const vivid = (color: string, amount: number) => {
  const lab = toLab(color);
  return fromLab(fitGamut({ l: lab.l, a: lab.a * amount, b: lab.b * amount }));
};

const saturated = (color: string) => {
  const lab = toLab(color);
  const chroma = Math.hypot(lab.a, lab.b);
  return chroma > HUED && chroma < MIN_CHROMA ? vivid(color, MIN_CHROMA / chroma) : color;
};

const atLeast = (color: string, against: string, ratio: number) =>
  contrast(color, against) >= ratio ? color : legibleOn(color, against, ratio);

const distinctFrom = (color: string, text: string, background: string) => {
  if (distance(color, text) >= DISTINCT) {
    return color;
  }
  const boosted = BOOSTS.map((amount) => vivid(color, amount)).find(
    (candidate) =>
      distance(candidate, text) >= DISTINCT &&
      contrast(candidate, background) >= HIGHLIGHT_CONTRAST,
  );
  return boosted ?? mixLab(color, background, 0.3);
};

const inkOn = (preferred: string, fill: string) => {
  if (contrast(preferred, fill) >= TEXT_CONTRAST) {
    return preferred;
  }
  return contrast(LIGHT_INK, fill) >= contrast(DARK_INK, fill) ? LIGHT_INK : DARK_INK;
};

export const buildPalette = (colors: GrowthCallScreenProps['colors']): Palette => {
  const background = colors.background;
  const text =
    contrast(colors.text, background) >= TEXT_CONTRAST
      ? colors.text
      : legibleOn(colors.text, background, CRISP_TEXT);
  const mutedMix = mixLab(text, background, MUTED_MIX);
  const muted = contrast(mutedMix, background) >= TEXT_CONTRAST ? mutedMix : text;
  const accented = distinctFrom(
    saturated(atLeast(colors.primary, background, HIGHLIGHT_CONTRAST)),
    text,
    background,
  );
  const primary = toLab(colors.primary);
  const fadesBehind =
    Math.hypot(primary.a, primary.b) < HUED &&
    contrast(accented, background) < contrast(text, background);
  const highlight = fadesBehind ? text : accented;
  const quieter = mixLab(text, background, QUIET_LINES);
  const lines = fadesBehind && contrast(quieter, background) >= TEXT_CONTRAST ? quieter : text;
  const surface = atLeast(colors.surface, background, BAR_CONTRAST);
  const fill = saturated(atLeast(colors.primary, surface, FILL_CONTRAST));
  const knob = colors.knob;
  return {
    background,
    glow: colors.primary,
    text,
    lines,
    muted,
    highlight,
    ripple: atLeast(highlight, background, RIPPLE_CONTRAST),
    surface,
    surfaceTop: mixLab(surface, text, 0.06),
    label: atLeast(colors.label, surface, LABEL_CONTRAST),
    shimmer: atLeast(colors.shimmer, surface, TEXT_CONTRAST),
    fill,
    websiteInk: inkOn(text, fill),
    gloss: contrast(LIGHT_INK, fill) >= 1.4 ? LIGHT_INK : mixLab(fill, DARK_INK, 0.5),
    knob,
    knobEdge: mixLab(knob, DARK_INK, 0.22),
    accent: atLeast(colors.accent, knob, GLYPH_CONTRAST),
    plate: colors.plate,
    plateRim: contrast(colors.plate, background) < PLATE_CONTRAST ? muted : null,
  };
};
