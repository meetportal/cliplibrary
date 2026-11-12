import type { DotWordmarkRevealProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, toLab } from '../../kit/lab-color';

const VISIBLE = 3;
const MIN_DISTANCE = 0.22;

const distance = (left: string, right: string) => {
  const a = toLab(left);
  const b = toLab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
};

const vividOn = (color: string, background: string): string => {
  if (contrast(color, background) >= VISIBLE) {
    return color;
  }
  const start = toLab(color);
  const target = toLab(background).l > 0.6 ? 0.2 : 0.95;
  const chroma = Math.hypot(start.a, start.b);
  const hue = Math.atan2(start.b, start.a);
  for (let step = 1; step <= 30; step++) {
    const t = step / 30;
    const boost = chroma * (1 + 0.6 * t);
    const candidate = fromLab(
      fitGamut({
        l: start.l + (target - start.l) * t,
        a: Math.cos(hue) * boost,
        b: Math.sin(hue) * boost,
      }),
    );
    if (contrast(candidate, background) >= VISIBLE) {
      return candidate;
    }
  }
  return legibleOn(color, background, VISIBLE);
};

const distinctFrom = (color: string, others: readonly string[], background: string): string => {
  const far = (candidate: string) =>
    others.every((other) => distance(candidate, other) >= MIN_DISTANCE);
  if (far(color)) {
    return color;
  }
  const start = toLab(color);
  const chroma = Math.hypot(start.a, start.b);
  const hue = Math.atan2(start.b, start.a);
  for (const shift of [0, -0.08, 0.08, -0.16]) {
    for (const turn of [-60, 60, -100, 100, 150, -150, 180]) {
      const angle = hue + (turn * Math.PI) / 180;
      const candidate = fromLab(
        fitGamut({
          l: start.l + shift,
          a: Math.cos(angle) * chroma,
          b: Math.sin(angle) * chroma,
        }),
      );
      if (far(candidate) && contrast(candidate, background) >= VISIBLE * 0.8) {
        return candidate;
      }
    }
  }
  return color;
};

const inkOn = (fill: string, options: readonly string[]) =>
  options.reduce((best, option) => (contrast(option, fill) > contrast(best, fill) ? option : best));

export type Palette = ReturnType<typeof buildPalette>;

export const buildPalette = (colors: DotWordmarkRevealProps['colors']) => {
  const text = legibleOn(colors.text, colors.background, 4.5);
  const fillInk = inkOn(colors.primary, ['#ffffff', colors.background, text, '#101010']);
  const pill = colors.primary;
  const accent = distinctFrom(
    vividOn(colors.accent, colors.background),
    [colors.primary, text, pill],
    colors.background,
  );
  const quiet = contrast(colors.primary, colors.background) < VISIBLE;
  return {
    background: colors.background,
    primary: colors.primary,
    surface: colors.surface,
    text,
    fillInk,
    pill,
    pillOnFill: quiet ? colors.primary : fillInk,
    accent,
    ring: accent,
    tileEdge: quiet ? text : null,
  };
};
