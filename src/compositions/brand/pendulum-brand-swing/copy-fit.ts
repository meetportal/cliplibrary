import { fontSpec } from './fonts';

export type Word = { text: string; accent: boolean };

export type Paragraph = { words: Word[]; weight: number };

export type FitLine = { words: Word[]; weight: number; y: number; width: number };

export type FitBlock = { size: number; lineHeight: number; lines: FitLine[] };

export type FitRules = {
  maxSize: number;
  minSize: number;
  maxLines: number;
  centerY: number;
  leading: number;
  widthAt: (glyphTop: number) => number;
  bottomOk: (glyphBottom: number, halfWidth: number) => boolean;
};

const GLYPH_REACH = 0.6;
const SHRINK = 0.97;

let context: CanvasRenderingContext2D | null = null;

const measurer = (): CanvasRenderingContext2D | null => {
  if (context === null && typeof document !== 'undefined') {
    context = document.createElement('canvas').getContext('2d');
  }
  return context;
};

const measure = (family: string, weight: number, size: number, text: string): number => {
  const ctx = measurer();
  if (ctx === null) {
    return text.length * size * 0.55;
  }
  ctx.font = fontSpec(family, weight, size);
  return ctx.measureText(text).width;
};

const lineText = (words: readonly Word[]) => words.map((word) => word.text).join(' ');

const wrap = (
  paragraphs: readonly Paragraph[],
  family: string,
  size: number,
  maxWidth: number,
): FitLine[] | null => {
  const lines: FitLine[] = [];
  for (const paragraph of paragraphs) {
    let current: Word[] = [];
    for (const word of paragraph.words) {
      const next = [...current, word];
      if (measure(family, paragraph.weight, size, lineText(next)) <= maxWidth) {
        current = next;
        continue;
      }
      if (current.length === 0) {
        return null;
      }
      lines.push({ words: current, weight: paragraph.weight, y: 0, width: 0 });
      current = [word];
      if (measure(family, paragraph.weight, size, word.text) > maxWidth) {
        return null;
      }
    }
    if (current.length > 0) {
      lines.push({ words: current, weight: paragraph.weight, y: 0, width: 0 });
    }
  }
  return lines;
};

const place = (lines: FitLine[], family: string, size: number, rules: FitRules): FitLine[] => {
  const pitch = size * rules.leading;
  const first = rules.centerY - ((lines.length - 1) * pitch) / 2;
  return lines.map((line, at) => ({
    ...line,
    y: first + at * pitch,
    width: measure(family, line.weight, size, lineText(line.words)),
  }));
};

const attempt = (
  paragraphs: readonly Paragraph[],
  family: string,
  size: number,
  rules: FitRules,
): { lines: FitLine[]; ok: boolean } | null => {
  const pitch = size * rules.leading;
  let count = Math.max(1, paragraphs.length);
  let lines: FitLine[] | null = null;
  for (let pass = 0; pass < 4; pass++) {
    const firstCenter = rules.centerY - ((count - 1) * pitch) / 2;
    lines = wrap(paragraphs, family, size, rules.widthAt(firstCenter - GLYPH_REACH * size));
    if (lines === null) {
      return null;
    }
    if (lines.length === count) {
      break;
    }
    count = lines.length;
  }
  if (lines === null || lines.length === 0) {
    return null;
  }
  const placed = place(lines, family, size, rules);
  const top = (placed[0]?.y ?? rules.centerY) - GLYPH_REACH * size;
  const ok =
    placed.length <= rules.maxLines &&
    placed.every(
      (line) =>
        line.width <= rules.widthAt(top) &&
        rules.bottomOk(line.y + GLYPH_REACH * size, line.width / 2),
    );
  return { lines: placed, ok };
};

export const fitBlock = (
  paragraphs: readonly Paragraph[],
  family: string,
  rules: FitRules,
): FitBlock => {
  let size = rules.maxSize;
  let fallback: FitBlock | null = null;
  while (size >= rules.minSize) {
    const result = attempt(paragraphs, family, size, rules);
    if (result !== null) {
      const block = { size, lineHeight: size * rules.leading, lines: result.lines };
      if (result.ok) {
        return block;
      }
      fallback = block;
    }
    size *= SHRINK;
  }
  if (fallback !== null) {
    return fallback;
  }
  const smallest = rules.minSize;
  const loose = wrap(paragraphs, family, smallest, Number.POSITIVE_INFINITY) ?? [];
  return {
    size: smallest,
    lineHeight: smallest * rules.leading,
    lines: place(loose, family, smallest, rules),
  };
};

export const wordsOf = (text: string, accentCount: number): Word[] =>
  text
    .split(/\s+/)
    .filter((word) => word !== '')
    .map((word, at) => ({ text: word, accent: at < accentCount }));

export const balanceTwoLines = (block: FitBlock, family: string): FitBlock => {
  const [first, second] = block.lines;
  if (block.lines.length !== 2 || first === undefined || second === undefined) {
    return block;
  }
  const words = [...first.words, ...second.words];
  const widthOf = (part: readonly Word[]) =>
    measure(family, first.weight, block.size, lineText(part));
  let best = first.words.length;
  let bestWidth = Number.POSITIVE_INFINITY;
  for (let split = 1; split < words.length; split++) {
    const widest = Math.max(widthOf(words.slice(0, split)), widthOf(words.slice(split)));
    if (widest < bestWidth) {
      best = split;
      bestWidth = widest;
    }
  }
  const top = words.slice(0, best);
  const bottom = words.slice(best);
  return {
    ...block,
    lines: [
      { ...first, words: top, width: widthOf(top) },
      { ...second, words: bottom, width: widthOf(bottom) },
    ],
  };
};
