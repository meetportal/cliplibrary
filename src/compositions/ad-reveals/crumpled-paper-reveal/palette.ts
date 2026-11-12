import type { CrumpledPaperRevealProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const MIN_ACCENT_DISTANCE = 0.14;

const distance = (left: string, right: string) => {
  const a = toLab(left);
  const b = toLab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
};

const separate = (accent: string, ink: string, paper: string): string => {
  if (distance(accent, ink) >= MIN_ACCENT_DISTANCE) {
    return accent;
  }
  const lab = toLab(accent);
  const inkLab = toLab(ink);
  const paperDark = toLab(paper).l < 0.5;
  const step = paperDark ? -0.2 : 0.2;
  const chroma = Math.max(0.09, Math.hypot(lab.a, lab.b));
  const hue = Math.atan2(lab.b, lab.a);
  return fromLab(
    fitGamut({ l: inkLab.l + step, a: Math.cos(hue) * chroma, b: Math.sin(hue) * chroma }),
  );
};

export type Palette = {
  ink: string;
  accent: string;
  paper: string;
  crease: string;
  highlight: string;
  wallTop: string;
  wallBottom: string;
  windowShade: string;
  dropShadow: string;
};

export const paletteFor = (colors: CrumpledPaperRevealProps['colors']): Palette => {
  const ink = legibleOn(colors.text, colors.paper, 4.5);
  const lifted = legibleOn(colors.primary, colors.paper, 3.6);
  const separated = separate(lifted, ink, colors.paper);
  const accent = contrast(separated, colors.paper) >= 2.6 ? separated : lifted;
  return {
    ink,
    accent,
    paper: colors.paper,
    crease: mixLab(colors.paper, '#2f2719', 0.62),
    highlight: mixLab(colors.paper, '#ffffff', 0.75),
    wallTop: mixLab(colors.wall, '#ffffff', 0.14),
    wallBottom: mixLab(colors.wall, '#101a0c', 0.16),
    windowShade: mixLab(colors.wall, '#121a0e', 0.42),
    dropShadow: mixLab(colors.wall, '#0d140a', 0.5),
  };
};
