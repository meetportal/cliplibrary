import type { TechStackBranchesProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const solid = (hex: string) => hex.slice(0, 7);

const polar = (color: string) => {
  const lab = toLab(color);
  return { l: lab.l, c: Math.hypot(lab.a, lab.b), h: Math.atan2(lab.b, lab.a) };
};

const mixVivid = (from: string, to: string, amount: number): string => {
  const start = polar(from);
  const end = polar(to);
  const t = Math.max(0, Math.min(1, amount));
  const turn = Math.atan2(Math.sin(end.h - start.h), Math.cos(end.h - start.h));
  const hue = start.h + turn * t;
  const chroma = Math.max(start.c + (end.c - start.c) * t, Math.min(start.c, end.c));
  return fromLab(
    fitGamut({
      l: start.l + (end.l - start.l) * t,
      a: Math.cos(hue) * chroma,
      b: Math.sin(hue) * chroma,
    }),
  );
};

const ACTIVE_RATIO = 3;
const SIDE_RATIO = 2.2;
const LINE_RATIO = 1.6;
const WIRE_RATIO = 2.5;

const reach = (fill: string, target: string, ratio: number): number | null => {
  for (let step = 1; step <= 20; step++) {
    if (contrast(mixLab(fill, target, step / 20), fill) >= ratio) {
      return step / 20;
    }
  }
  return null;
};

const readableText = (text: string, fill: string, ratio: number): string => {
  if (contrast(text, fill) >= ratio) {
    return text;
  }
  const light = reach(fill, '#ffffff', ratio);
  const dark = reach(fill, '#000000', ratio);
  if (light === null && dark === null) {
    return contrast('#ffffff', fill) > contrast('#000000', fill) ? '#ffffff' : '#000000';
  }
  if (dark === null || (light !== null && light <= dark)) {
    return mixLab(fill, '#ffffff', light ?? 1);
  }
  return mixLab(fill, '#000000', Math.min(1, dark + 0.25));
};

const BLEND_STEPS = 20;

const weakest = (ink: string, from: string, to: string) =>
  Math.min(
    ...Array.from({ length: BLEND_STEPS + 1 }, (_, at) =>
      contrast(ink, mixVivid(from, to, at / BLEND_STEPS)),
    ),
  );

const wheelInk = (text: string, secondary: string, primary: string): string | null => {
  if (contrast(text, secondary) >= SIDE_RATIO && contrast(text, primary) >= SIDE_RATIO) {
    return null;
  }
  const candidates = [
    readableText(text, secondary, SIDE_RATIO),
    readableText(text, primary, ACTIVE_RATIO),
    text,
    '#ffffff',
    mixLab(primary, '#000000', 0.8),
    mixLab(secondary, '#000000', 0.8),
    '#141414',
  ];
  const passing = candidates.find((ink) => weakest(ink, secondary, primary) >= SIDE_RATIO);
  return (
    passing ??
    candidates.reduce((best, ink) =>
      weakest(ink, secondary, primary) > weakest(best, secondary, primary) ? ink : best,
    )
  );
};

export type PillColors = { fill: string; text: string; rim: string };

export type Palette = {
  pill: (activeness: number) => PillColors;
  root: PillColors;
  lines: string;
  plate: string;
  shadow: string;
};

const rimOf = (fill: string) => mixLab(fill, '#ffffff', 0.45);

export const buildPalette = (props: TechStackBranchesProps): Palette => {
  const { colors, background } = props;
  const primary = solid(colors.primary);
  const secondary = solid(colors.secondary);
  const text = solid(colors.text);
  const root = solid(colors.root);
  const backdrop = mixLab(solid(background.top), solid(background.glow), 0.5);
  const ink = wheelInk(text, secondary, primary);
  const sideText = ink ?? text;
  const activeText = ink ?? readableText(text, primary, ACTIVE_RATIO);
  return {
    pill: (activeness) => {
      const fill = mixVivid(secondary, primary, activeness);
      return { fill, text: mixLab(sideText, activeText, activeness), rim: rimOf(fill) };
    },
    root: { fill: root, text: readableText(text, root, ACTIVE_RATIO), rim: rimOf(root) },
    lines:
      contrast(solid(colors.lines), backdrop) >= LINE_RATIO
        ? solid(colors.lines)
        : legibleOn(primary, backdrop, WIRE_RATIO),
    plate: solid(colors.plate),
    shadow: mixLab(primary, '#000000', 0.45),
  };
};

export const withAlpha = (hex: string, alpha: number): string => {
  const value = solid(hex);
  const red = Number.parseInt(value.slice(1, 3), 16);
  const green = Number.parseInt(value.slice(3, 5), 16);
  const blue = Number.parseInt(value.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha)).toFixed(4)})`;
};
