import type { PendulumBrandSwingProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, toLab } from '../../kit/lab-color';

export type Palette = {
  text: string;
  accent: string;
  website: string;
  cord: string;
  plate: string;
  monogram: string;
  center: string;
  edge: string;
};

const TEXT_CONTRAST = 4.5;
const CRISP_TEXT = 7;
const CRISP_ON_LIGHT = 12;
const LIGHT_BACKGROUND = 9;
const ACCENT_CONTRAST = 3;
const WEBSITE_CONTRAST = 4.5;
const CORD_CONTRAST = 2.4;
const MONOGRAM_CONTRAST = 3;
const MIN_CHROMA = 0.1;
const HUED = 0.02;
const DISTINCT = 0.12;
const BOOSTS = [1.5, 2, 2.5, 3, 4];

const chroma = (color: string) => {
  const lab = toLab(color);
  return Math.hypot(lab.a, lab.b);
};

const vivid = (color: string, amount: number) => {
  const lab = toLab(color);
  return fromLab(fitGamut({ l: lab.l, a: lab.a * amount, b: lab.b * amount }));
};

const saturated = (color: string) => {
  const amount = chroma(color);
  return amount > HUED && amount < MIN_CHROMA ? vivid(color, MIN_CHROMA / amount) : color;
};

const distance = (a: string, b: string) => {
  const left = toLab(a);
  const right = toLab(b);
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
};

const apartFrom = (color: string, text: string, background: string, ratio: number) => {
  if (distance(color, text) >= DISTINCT) {
    return color;
  }
  return (
    BOOSTS.map((amount) => vivid(color, amount)).find(
      (candidate) =>
        distance(candidate, text) >= DISTINCT && contrast(candidate, background) >= ratio,
    ) ?? color
  );
};

const atLeast = (color: string, background: string, ratio: number) =>
  contrast(color, background) >= ratio ? color : legibleOn(color, background, ratio);

export const buildPalette = (colors: PendulumBrandSwingProps['colors']): Palette => {
  const background = colors.background;
  const text =
    contrast(colors.text, background) >= TEXT_CONTRAST
      ? colors.text
      : legibleOn(
          colors.text,
          background,
          contrast(background, '#000000') >= LIGHT_BACKGROUND ? CRISP_ON_LIGHT : CRISP_TEXT,
        );
  const primary = saturated(colors.primary);
  const accent = apartFrom(atLeast(primary, background, ACCENT_CONTRAST), text, background, 3);
  return {
    text,
    accent,
    website: atLeast(accent, background, WEBSITE_CONTRAST),
    cord: atLeast(primary, background, CORD_CONTRAST),
    plate: colors.surface,
    monogram: atLeast(primary, colors.surface, MONOGRAM_CONTRAST),
    center: background,
    edge: colors.backgroundEdge,
  };
};
