import type { PillFanProps } from '@/schemas';
import { contrastRatio } from '../../brand/dot-ring-logo-reveal/contrast';

const channels = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const solid = (hex: string) => hex.slice(0, 7);

export const mix = (from: string, to: string, amount: number): string => {
  const start = channels(from);
  const end = channels(to);
  return `#${start
    .map((value, index) => {
      const mixed = Math.round(value + ((end[index] ?? value) - value) * amount);
      return Math.max(0, Math.min(255, mixed)).toString(16).padStart(2, '0');
    })
    .join('')}`;
};

export const withAlpha = (hex: string, alpha: number): string => {
  const [red, green, blue] = channels(solid(hex));
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha)).toFixed(4)})`;
};

const READABLE = 3;
const EDGE = 1.6;

const readableOn = (surface: string, preferred: string, fallbacks: readonly string[]): string => {
  if (contrastRatio(preferred, surface) >= READABLE) {
    return preferred;
  }
  return [preferred, ...fallbacks].reduce((best, candidate) =>
    contrastRatio(candidate, surface) > contrastRatio(best, surface) ? candidate : best,
  );
};

const floorToward = (color: string, against: string, toward: string): string => {
  for (let step = 0; step <= 20; step++) {
    const candidate = mix(color, toward, step / 20);
    if (contrastRatio(candidate, against) >= READABLE) {
      return candidate;
    }
  }
  return toward;
};

const deepestTint = (pill: string, background: string, word: string): number => {
  let best = 0;
  for (let step = 1; step <= 20; step++) {
    if (contrastRatio(word, mix(pill, background, step / 20)) < READABLE) {
      break;
    }
    best = step / 20;
  }
  return best;
};

export type PillPalette = {
  pill: string;
  word: string;
  edge: string | null;
  outlineWord: string;
  outlineEdge: string;
  maxTint: number;
  background: string;
  shadow: string;
};

export const pillPalette = ({ colors }: PillFanProps): PillPalette => {
  const pill = solid(colors.primary);
  const background = solid(colors.background);
  const text = solid(colors.text);
  const word = readableOn(pill, solid(colors.pillText), [text, background]);
  const lowEdge = contrastRatio(pill, background) < EDGE;
  const edgeColor = mix(pill, text, 0.35);
  return {
    pill,
    word,
    edge: lowEdge ? edgeColor : null,
    outlineWord: floorToward(pill, background, text),
    outlineEdge: lowEdge ? edgeColor : pill,
    maxTint: deepestTint(pill, background, word),
    background,
    shadow: mix(pill, '#000000', 0.45),
  };
};
