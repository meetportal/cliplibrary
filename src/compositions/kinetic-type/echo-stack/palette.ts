import type { EchoStackProps } from '@/schemas';
import { contrast, legibleOn } from '../../kit/lab-color';

const BAND_FLOOR = 2.2;
const TEXT_FLOOR = 3;
const DARK_INK = '#0b0b0c';
const LIGHT_INK = '#ffffff';

export type Palette = {
  band: string;
  bandInk: string;
  heroText: string;
  text: string;
  background: string;
  backgroundEdge: string;
};

const inkOn = (fill: string, light: string, dark: string) =>
  contrast(light, fill) >= contrast(dark, fill) ? light : dark;

export const buildPalette = (colors: EchoStackProps['colors']): Palette => {
  const band = legibleOn(colors.primary, colors.background, BAND_FLOOR);
  return {
    band,
    bandInk: inkOn(band, LIGHT_INK, DARK_INK),
    heroText: legibleOn(colors.primary, colors.background, TEXT_FLOOR),
    text: colors.text,
    background: colors.background,
    backgroundEdge: colors.backgroundEdge,
  };
};
