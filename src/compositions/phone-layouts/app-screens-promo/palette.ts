import type { AppScreensPromoProps } from '@/schemas';
import { contrast, legibleOn, mixLab, toLab } from '../../kit/lab-color';

export type Palette = {
  background: string;
  shape: string;
  text: string;
  line: string;
  accent: string;
  tile: string;
  tileAccent: string;
  tileInk: string;
  phone: string;
  phoneRim: string;
  island: string;
  screenFrom: string;
  screenTo: string;
  badge: string;
  badgeInk: string;
  badgeRim: string;
  shadow: string;
};

const isDark = (color: string) => toLab(color).l < 0.6;

const awayFrom = (color: string) => (isDark(color) ? '#ffffff' : '#000000');

const rgba = (hex: string, alpha: number) => {
  const channel = (at: number) => Number.parseInt(hex.slice(at, at + 2), 16);
  return `rgba(${channel(1)}, ${channel(3)}, ${channel(5)}, ${alpha.toFixed(3)})`;
};

const flipped = (color: string, background: string, amount: number) =>
  isDark(background) && isDark(color) ? mixLab(color, '#ffffff', amount) : color;

const MIN_CHROMA = 0.045;

const vivid = (color: string, against: string, ratio: number) => {
  const lab = toLab(color);
  const chroma = Math.hypot(lab.a, lab.b);
  const legible = legibleOn(color, against, ratio);
  return chroma < MIN_CHROMA ? legibleOn(color, against, Math.max(ratio, 3)) : legible;
};

export const paletteFor = ({ colors, backdrop, phones }: AppScreensPromoProps): Palette => {
  const { background } = colors;
  const shape = mixLab(background, awayFrom(background), backdrop.shapeDepth);
  const phoneRim = mixLab(colors.phone, awayFrom(colors.phone), 0.14);
  const phoneEdge = contrast(colors.phone, background) < 1.25 ? awayFrom(background) : phoneRim;
  return {
    background,
    shape,
    text: legibleOn(flipped(colors.text, background, 0.85), background, 4.5),
    line: legibleOn(flipped(colors.line, background, 0.7), background, 4.5),
    accent: vivid(colors.primary, background, 2),
    tile: colors.tile,
    tileAccent: vivid(colors.primary, colors.tile, 2),
    tileInk: legibleOn(colors.primary, colors.tile, 3),
    phone: colors.phone,
    phoneRim: phoneEdge === phoneRim ? phoneRim : mixLab(colors.phone, phoneEdge, 0.3),
    island: mixLab(colors.phone, '#000000', 0.55),
    screenFrom: colors.primary,
    screenTo: mixLab(colors.primary, '#ffffff', 0.5),
    badge: colors.badge,
    badgeInk: legibleOn('#ffffff', colors.badge, 4.5),
    badgeRim:
      contrast(colors.badge, background) < 1.4
        ? mixLab(colors.badge, awayFrom(background), 0.4)
        : colors.badge,
    shadow: rgba(mixLab(background, '#000000', 0.7), phones.shadow),
  };
};
