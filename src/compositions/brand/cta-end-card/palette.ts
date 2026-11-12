import type { CtaEndCardProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const ACCENT_CONTRAST = 3;
const MIN_DISTANCE = 0.3;
const WARM_TURN = 0.45;

const distance = (left: string, right: string) => {
  const a = toLab(left);
  const b = toLab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
};

const distinctAccent = (accent: string, text: string, background: string): string => {
  if (distance(accent, text) >= MIN_DISTANCE) {
    return accent;
  }
  const start = toLab(accent);
  const away = toLab(background).l > toLab(text).l ? 1 : -1;
  for (let step = 1; step <= 20; step++) {
    const candidate = fromLab({ ...start, l: start.l + away * step * 0.02 });
    if (contrast(candidate, background) < ACCENT_CONTRAST) {
      break;
    }
    if (distance(candidate, text) >= MIN_DISTANCE) {
      return candidate;
    }
  }
  return accent;
};

const vividOn = (color: string, background: string): string => {
  if (contrast(color, background) >= ACCENT_CONTRAST) {
    return color;
  }
  const start = toLab(color);
  const target = toLab(background).l > 0.6 ? 0 : 1;
  const chroma = Math.hypot(start.a, start.b);
  const hue = Math.atan2(start.b, start.a);
  for (let step = 1; step <= 30; step++) {
    const t = step / 30;
    const turned = hue - (target === 0 && start.b > 0 ? WARM_TURN * t : 0);
    const boost = chroma * (1 + 0.5 * t);
    const candidate = fromLab(
      fitGamut({
        l: start.l + (target - start.l) * t,
        a: Math.cos(turned) * boost,
        b: Math.sin(turned) * boost,
      }),
    );
    if (contrast(candidate, background) >= ACCENT_CONTRAST) {
      return candidate;
    }
  }
  return legibleOn(color, background, ACCENT_CONTRAST);
};

const inkOn = (fill: string, text: string) => {
  const options = ['#ffffff', text, '#0b0b0c'];
  return options.reduce((best, option) =>
    contrast(option, fill) > contrast(best, fill) ? option : best,
  );
};

const alpha = (color: string, opacity: number) =>
  `${color.slice(0, 7)}${Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, '0')}`;

export type Palette = ReturnType<typeof buildPalette>;

export const buildPalette = (colors: CtaEndCardProps['colors'], sheenStrength: number) => {
  const text = legibleOn(colors.text, colors.background, 4.5);
  const muted = legibleOn(colors.secondary, colors.background, 3);
  const accent = distinctAccent(
    vividOn(colors.primary, colors.background),
    text,
    colors.background,
  );
  const buttonInk = inkOn(colors.primary, text);
  const inkIsLight = toLab(buttonInk).l > toLab(colors.primary).l;
  const surfaceInk = legibleOn(text, colors.surface, 4.5);
  const quietFill = contrast(colors.primary, colors.background) < 1.6;
  return {
    text,
    muted,
    accent,
    buttonFill: colors.primary,
    buttonInk,
    buttonEdge: quietFill ? mixLab(colors.primary, text, 0.22) : colors.primary,
    sheen: inkIsLight
      ? alpha('#ffffff', 0.42 * sheenStrength)
      : alpha(buttonInk, 0.16 * sheenStrength),
    surface: colors.surface,
    surfaceInk,
    surfaceEdge: mixLab(colors.surface, text, 0.16),
    plateShadow: alpha(mixLab(colors.backgroundEdge, text, 0.5), 0.14),
    background: colors.background,
    backgroundEdge: colors.backgroundEdge,
  };
};
