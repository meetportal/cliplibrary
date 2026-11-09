import { type Face, fontSpec } from './fonts';

const REFERENCE = 100;

export type Measurer = (text: string, font: Face) => number;

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  const cache = new Map<string, number>();
  return (text, font) => {
    const key = `${fontSpec(font, REFERENCE)}|${text}`;
    const known = cache.get(key);
    if (known !== undefined) {
      return known;
    }
    let width = text.length * REFERENCE * 0.55;
    if (context !== null) {
      context.font = fontSpec(font, REFERENCE);
      width = context.measureText(text).width;
    }
    cache.set(key, width);
    return width;
  };
};

export type PlacedWord = {
  index: number;
  text: string;
  x: number;
  y: number;
  width: number;
};

export type CaptionLayout = {
  size: number;
  lineHeight: number;
  words: PlacedWord[];
  bottom: number;
};

const LINE_HEIGHT = 1.18;
const SHRINK_ALLOWANCE = 1.16;
const SINGLE_LINE_GROWTH = 1.3;

const partitions = (count: number, lines: number): number[][] => {
  if (lines === 1) {
    return [[count]];
  }
  const found: number[][] = [];
  for (let first = 1; first <= count - lines + 1; first++) {
    for (const rest of partitions(count - first, lines - 1)) {
      found.push([first, ...rest]);
    }
  }
  return found;
};

const WEAK_ENDINGS = new Set(
  'a an the for of to in on at by with and or but from as into your our my their its'.split(' '),
);

const isWeakEnding = (word: string): boolean =>
  WEAK_ENDINGS.has(word.toLowerCase().replace(/[^\p{L}']/gu, ''));

const balanced = (widths: number[], weak: boolean[], space: number, lines: number): number[][] => {
  const count = widths.length;
  if (count <= lines) {
    return widths.map((_, index) => [index]);
  }
  let best: number[][] = [];
  let bestWidth = Number.POSITIVE_INFINITY;
  for (const split of partitions(count, lines)) {
    let start = 0;
    const groups = split.map((length) => {
      const group = Array.from({ length }, (_, offset) => start + offset);
      start += length;
      return group;
    });
    const widest = Math.max(
      ...groups.map(
        (group) =>
          group.reduce((sum, index) => sum + (widths[index] ?? 0), 0) + space * (group.length - 1),
      ),
    );
    const weakEnds = groups.slice(0, -1).filter((group) => weak[group.at(-1) ?? 0] === true).length;
    const score = widest * (1 + 0.15 * weakEnds);
    if (score < bestWidth - 0.5) {
      bestWidth = score;
      best = groups;
    }
  }
  return best;
};

const lineWidth = (group: number[], widths: number[], space: number) =>
  group.reduce((sum, index) => sum + (widths[index] ?? 0), 0) + space * (group.length - 1);

const wrapParagraph = (
  widths: number[],
  weak: boolean[],
  space: number,
  maxWidth: number,
  maxLines: number,
) => {
  const limit = Math.min(maxLines, Math.max(1, widths.length), 4);
  let groups = balanced(widths, weak, space, limit);
  for (let lines = 1; lines <= limit; lines++) {
    const option = balanced(widths, weak, space, lines);
    if (
      Math.max(...option.map((group) => lineWidth(group, widths, space))) <=
      maxWidth * SHRINK_ALLOWANCE
    ) {
      groups = option;
      break;
    }
  }
  return groups;
};

export const layoutCaption = ({
  measure,
  text,
  font,
  maxSize,
  maxWidth,
  maxLines,
  top,
  centerX,
}: {
  measure: Measurer;
  text: string;
  font: Face;
  maxSize: number;
  maxWidth: number;
  maxLines: number;
  top: number;
  centerX: number;
}): CaptionLayout => {
  const paragraphs = text
    .split('\n')
    .map((line) => line.split(/\s+/).filter((word) => word !== ''))
    .filter((line) => line.length > 0);
  const space = measure(' ', font);
  const budget = Math.max(1, maxLines - paragraphs.length + 1);
  const lines = paragraphs.flatMap((tokens) => {
    const widths = tokens.map((token) => measure(token, font));
    return wrapParagraph(
      widths,
      tokens.map(isWeakEnding),
      space,
      (maxWidth / maxSize) * REFERENCE,
      budget,
    ).map((group) =>
      group.map((index) => ({ text: tokens[index] ?? '', width: widths[index] ?? 0 })),
    );
  });
  const widest = Math.max(
    1,
    ...lines.map(
      (line) => line.reduce((sum, word) => sum + word.width, 0) + space * (line.length - 1),
    ),
  );
  const tall = lines.length > maxLines ? maxLines / lines.length : 1;
  const ceiling = lines.length === 1 ? maxSize * SINGLE_LINE_GROWTH : maxSize;
  const size = Math.min(ceiling, (maxWidth / widest) * REFERENCE, maxSize * tall);
  const scale = size / REFERENCE;
  const lineHeight = size * LINE_HEIGHT;
  const words: PlacedWord[] = [];
  lines.forEach((line, row) => {
    const total =
      (line.reduce((sum, word) => sum + word.width, 0) + space * (line.length - 1)) * scale;
    let x = centerX - total / 2;
    for (const word of line) {
      words.push({
        index: words.length,
        text: word.text,
        x,
        y: top + row * lineHeight,
        width: word.width * scale,
      });
      x += (word.width + space) * scale;
    }
  });
  return { size, lineHeight, words, bottom: top + lines.length * lineHeight };
};

export const fitLine = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  maxWidth: number,
): number => Math.min(maxSize, (maxWidth / Math.max(1, measure(text, font))) * REFERENCE);
