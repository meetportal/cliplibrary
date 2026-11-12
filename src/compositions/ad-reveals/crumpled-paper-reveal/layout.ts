import { CAPS_FACE, HEADLINE_FACE, type Measure } from './fonts';
import { SHEET } from './mesh';

export const CONTENT_WIDTH = 720;
export const HEADLINE_LEADING = 0.98;
export const TAGLINE_TRACKING = 0.3;
export const NAME_TRACKING = 0.28;

const MAX_LINES = 3;
const SHORT_HEADLINE = 8;
const SHORT_HEADLINE_SIZE = 220;
const MAX_HEADLINE_HEIGHT = 560;
const LOGO_TOP = 116;
const NAME_BOTTOM = 104;
const RULE_GAP = 46;
const TAGLINE_GAP = 34;

const splits = (words: readonly string[], count: number): string[][][] => {
  if (count === 1) {
    return [[[...words]]];
  }
  const result: string[][][] = [];
  for (let at = 1; at <= words.length - count + 1; at++) {
    for (const rest of splits(words.slice(at), count - 1)) {
      result.push([words.slice(0, at), ...rest]);
    }
  }
  return result;
};

const balanced = (words: readonly string[], count: number, widthOf: (line: string) => number) => {
  const options = words.length > 12 ? [] : splits(words, count);
  let best: string[] | null = null;
  let bestWidth = Number.POSITIVE_INFINITY;
  for (const option of options) {
    const lines = option.map((line) => line.join(' '));
    const widest = Math.max(...lines.map(widthOf));
    if (widest < bestWidth - 0.001) {
      best = lines;
      bestWidth = widest;
    }
  }
  return best;
};

const greedy = (words: readonly string[], limit: number, widthOf: (line: string) => number) => {
  const lines: string[] = [];
  for (const word of words) {
    const last = lines.at(-1);
    if (last !== undefined && widthOf(`${last} ${word}`) <= limit) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
};

type HeadlineLayout = { size: number; lines: string[] };

const layoutHeadline = (text: string, measure: Measure, maxSize: number): HeadlineLayout => {
  const words = text.split(/\s+/).filter((word) => word !== '');
  const widthOf = (line: string) => measure(line, HEADLINE_FACE);
  let fallback: HeadlineLayout = { size: 40, lines: words.length === 0 ? [''] : words };
  const start =
    text.trim().length <= SHORT_HEADLINE ? Math.max(maxSize, SHORT_HEADLINE_SIZE) : maxSize;
  for (let size = start; size >= 40; size -= 2) {
    const limit = CONTENT_WIDTH / size;
    const lines = greedy(words, limit, widthOf);
    const fits =
      lines.length <= MAX_LINES &&
      lines.every((line) => widthOf(line) <= limit) &&
      lines.length * size * HEADLINE_LEADING <= MAX_HEADLINE_HEIGHT;
    if (fits) {
      return { size, lines: balanced(words, lines.length, widthOf) ?? lines };
    }
    fallback = { size, lines };
  }
  return fallback;
};

const fitCaps = (text: string, measure: Measure, maxSize: number, tracking: number) => {
  const width = measure(text, CAPS_FACE, tracking);
  return width <= 0 ? maxSize : Math.min(maxSize, CONTENT_WIDTH / width);
};

export type SheetLayout = {
  headline: HeadlineLayout;
  headlineTop: number;
  ruleTop: number;
  taglineTop: number;
  taglineSize: number;
  nameSize: number;
  nameTop: number;
  logoTop: number;
};

export const layoutSheet = (input: {
  headline: string;
  tagline: string;
  name: string;
  measure: Measure;
  headlineSize: number;
  taglineSize: number;
  nameSize: number;
  logoHeight: number;
}): SheetLayout => {
  const headline = layoutHeadline(input.headline, input.measure, input.headlineSize);
  const taglineSize = fitCaps(input.tagline, input.measure, input.taglineSize, TAGLINE_TRACKING);
  const nameSize = fitCaps(input.name, input.measure, input.nameSize, NAME_TRACKING);
  const nameTop = SHEET.height - NAME_BOTTOM - nameSize;
  const headlineHeight = headline.lines.length * headline.size * HEADLINE_LEADING;
  const group = headlineHeight + RULE_GAP + TAGLINE_GAP + taglineSize * 1.2;
  const top = LOGO_TOP + input.logoHeight + 40;
  const bottom = nameTop - 40;
  const headlineTop = Math.round(top + (bottom - top - group) / 2);
  const ruleTop = Math.round(headlineTop + headlineHeight + RULE_GAP * 0.55);
  return {
    headline,
    headlineTop,
    ruleTop,
    taglineTop: Math.round(headlineTop + headlineHeight + RULE_GAP + TAGLINE_GAP * 0.4),
    taglineSize,
    nameSize,
    nameTop: Math.round(nameTop),
    logoTop: LOGO_TOP,
  };
};
