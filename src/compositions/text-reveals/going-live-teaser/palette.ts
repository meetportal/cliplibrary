import type { GoingLiveTeaserProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

export type Palette = {
  text: string;
  accent: string;
  secondary: string;
  surface: string;
  background: string;
  edge: string;
  panel: string;
  underline: string;
  muted: string;
  sheet: string;
  sheetLine: string;
  glow: string;
  plateRim: string | null;
  echoes: string[];
  wipe: string;
  split: string;
  accentMark: boolean;
};

const ACCENT_CONTRAST = 3;
const TEXT_CONTRAST = 4.5;
const MARK_CONTRAST = 2;
const SHEET_CONTRAST = 1.8;
const PLATE_CONTRAST = 1.6;
const DISTINCT = 0.12;
const CRISP_TEXT = 8;
const MIN_CHROMA = 0.1;
const HUED = 0.02;
const BOOSTS = [1.5, 2, 2.5, 3, 4];
const WIPE_CONTRAST = 1.25;
const DARK_WIPE = 1.5;

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

const distinctFrom = (color: string, text: string, background: string) => {
  if (distance(color, text) >= DISTINCT) {
    return color;
  }
  const boosted = BOOSTS.map((amount) => vivid(color, amount)).find(
    (candidate) =>
      distance(candidate, text) >= DISTINCT && contrast(candidate, background) >= ACCENT_CONTRAST,
  );
  if (boosted !== undefined) {
    return boosted;
  }
  const deeper = mixLab(color, background, 0.35);
  return contrast(deeper, background) >= ACCENT_CONTRAST ? deeper : color;
};

export const buildPalette = (colors: GoingLiveTeaserProps['colors']): Palette => {
  const background = colors.background;
  const text =
    contrast(colors.text, background) >= TEXT_CONTRAST
      ? colors.text
      : legibleOn(colors.text, background, CRISP_TEXT);
  const primary = toLab(colors.primary);
  const achromatic = Math.hypot(primary.a, primary.b) < HUED;
  const accent = achromatic
    ? text
    : distinctFrom(
        saturated(legibleOn(colors.primary, background, ACCENT_CONTRAST)),
        text,
        background,
      );
  const glow = legibleOn(colors.secondary, background, MARK_CONTRAST);
  const sheet = legibleOn(colors.surface, background, SHEET_CONTRAST);
  const muted = mixLab(text, background, 0.35);
  const darkWipe =
    contrast(colors.primary, background) >= WIPE_CONTRAST
      ? colors.primary
      : legibleOn(colors.primary, background, DARK_WIPE);
  return {
    text,
    accent,
    secondary: colors.secondary,
    surface: colors.surface,
    background,
    edge: colors.backgroundEdge,
    panel: colors.panel,
    underline: glow,
    muted,
    sheet,
    sheetLine: mixLab(sheet, glow, 0.45),
    glow,
    plateRim: contrast(colors.surface, background) < PLATE_CONTRAST ? muted : null,
    echoes: achromatic ? [glow, sheet, mixLab(glow, sheet, 0.5)] : [accent, glow, sheet],
    wipe: achromatic ? darkWipe : accent,
    split: achromatic ? muted : accent,
    accentMark: achromatic,
  };
};
