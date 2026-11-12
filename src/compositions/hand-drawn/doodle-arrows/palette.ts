import type { DoodleArrowsProps } from '@/schemas';
import { contrast, fitGamut, fromLab, legibleOn, mixLab, toLab } from '../../kit/lab-color';

const MIN_ACCENT_DISTANCE = 0.16;
const ACCENT_CONTRAST = 3;
const DEEPEN_CHROMA = 0.15;
const DEEPEN_STEPS = 40;
const GOLD_HUE = (85 * Math.PI) / 180;
const YELLOW_LOW = (55 * Math.PI) / 180;
const YELLOW_HIGH = (120 * Math.PI) / 180;

const warmed = (hue: number) => (hue >= YELLOW_LOW && hue <= YELLOW_HIGH ? GOLD_HUE : hue);

const deepen = (color: string, paper: string): string => {
  if (contrast(color, paper) >= ACCENT_CONTRAST) {
    return color;
  }
  const lab = toLab(color);
  const darkPaper = toLab(paper).l < 0.5;
  const chroma = Math.max(DEEPEN_CHROMA, Math.hypot(lab.a, lab.b));
  const hue = darkPaper ? Math.atan2(lab.b, lab.a) : warmed(Math.atan2(lab.b, lab.a));
  const target = darkPaper ? 1 : 0;
  for (let step = 1; step <= DEEPEN_STEPS; step++) {
    const l = lab.l + ((target - lab.l) * step) / DEEPEN_STEPS;
    const candidate = fromLab(
      fitGamut({ l, a: Math.cos(hue) * chroma, b: Math.sin(hue) * chroma }),
    );
    if (contrast(candidate, paper) >= ACCENT_CONTRAST) {
      return candidate;
    }
  }
  return legibleOn(color, paper, ACCENT_CONTRAST);
};

const distance = (left: string, right: string) => {
  const a = toLab(left);
  const b = toLab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
};

const separate = (accent: string, away: readonly string[], paper: string): string => {
  if (away.every((color) => distance(accent, color) >= MIN_ACCENT_DISTANCE)) {
    return accent;
  }
  const lab = toLab(accent);
  const paperLab = toLab(paper);
  const darkPaper = paperLab.l < 0.5;
  const chroma = Math.max(0.11, Math.hypot(lab.a, lab.b));
  const hue = Math.atan2(lab.b, lab.a);
  const darkest = Math.max(...away.map((color) => toLab(color).l));
  const lightest = Math.min(...away.map((color) => toLab(color).l));
  const l = darkPaper ? lightest - 0.2 : Math.min(darkest + 0.2, paperLab.l - 0.3);
  return fromLab(fitGamut({ l, a: Math.cos(hue) * chroma, b: Math.sin(hue) * chroma }));
};

export type Palette = {
  ink: string;
  pencil: string;
  accent: string;
  paper: string;
  rules: string;
  light: string;
};

export const paletteFor = (colors: DoodleArrowsProps['colors']): Palette => {
  const ink = legibleOn(colors.text, colors.paper, 4.5);
  const pencil = legibleOn(colors.pencil, colors.paper, ACCENT_CONTRAST);
  const lifted = deepen(colors.primary, colors.paper);
  const separated = separate(lifted, [ink, pencil], colors.paper);
  return {
    ink,
    pencil,
    accent: legibleOn(separated, colors.paper, ACCENT_CONTRAST),
    paper: colors.paper,
    rules: colors.rules,
    light: mixLab(colors.paper, '#ffffff', 0.85),
  };
};
