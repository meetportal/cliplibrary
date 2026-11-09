import type { DominoWordsProps } from '@/schemas';
import { alpha, bestInk, contrast, mixHex, readableOn } from './color';

export type Ink = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  glow: string;
  glowAmount: number;
  tile: string | null;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const FLASH_FRAMES = 8;
const FLASH_RISE = 2;
const SHADOW_LAYERS = [
  [0.04, 1],
  [0.12, 0.8],
  [0.3, 0.5],
] as const;
const PUNCH_FRAMES = 10;

export type InkInput = {
  props: DominoWordsProps;
  index: number;
  count: number;
  start: number;
  land: number;
  frame: number;
};

const LETTER_CONTRAST = 4.5;

export const punchColor = (colors: DominoWordsProps['colors']) =>
  readableOn(colors.primary, colors.background, colors.text);

const punchLetters = (colors: DominoWordsProps['colors']) =>
  contrast(colors.primary, colors.background) >=
  Math.min(LETTER_CONTRAST, contrast(colors.text, colors.background))
    ? colors.primary.slice(0, 7)
    : colors.text;

export const inkFor = ({ props, index, count, start, land, frame }: InkInput): Ink => {
  const { words, colors } = props;
  const lit =
    index === 0 && words.firstLit ? 1 : clamp01((frame - start) / Math.max(1, words.lightFrames));
  const isLast = index === count - 1 && count > 0;
  const punch = isLast && frame >= land ? clamp01((frame - land + 1) / PUNCH_FRAMES) : 0;
  const since = frame - land;
  const flash =
    isLast && since >= 0
      ? (1 - Math.exp(-(since + 1) / FLASH_RISE)) * Math.exp(-since / FLASH_FRAMES)
      : 0;
  const accent = punchColor(colors);
  if (words.look === 'tile') {
    const landed = isLast && frame >= land;
    const tile = landed ? colors.primary : mixHex(colors.idle, colors.text, lit);
    const letters = landed
      ? bestInk(colors.primary, colors.background, colors.text)
      : colors.background;
    return {
      fill: letters,
      stroke: letters,
      strokeWidth: 0,
      glow: colors.primary,
      glowAmount: words.glow * (0.6 * punch + flash),
      tile,
    };
  }
  const body = mixHex(colors.text, punchLetters(colors), punch);
  if (words.look === 'neon') {
    return {
      fill: alpha(body, lit),
      stroke: mixHex(colors.idle, colors.primary, lit),
      strokeWidth: words.outline * (1 - 0.5 * lit),
      glow: accent,
      glowAmount: words.glow * (lit * 0.9 + punch * 0.4 + flash),
      tile: null,
    };
  }
  return {
    fill: alpha(body, lit),
    stroke: mixHex(colors.idle, body, lit),
    strokeWidth: words.outline,
    glow: accent,
    glowAmount: words.glow * (punch + flash),
    tile: null,
  };
};

export const textShadow = (ink: Ink, size: number, fillAlpha: number) => {
  const amount = ink.glowAmount * fillAlpha;
  if (amount <= 0.001) {
    return 'none';
  }
  return SHADOW_LAYERS.map(
    ([spread, strength]) =>
      `0 0 ${(spread * size * Math.min(amount, 1.5)).toFixed(2)}px ${alpha(ink.glow, Math.min(1, amount * strength))}`,
  ).join(', ');
};
