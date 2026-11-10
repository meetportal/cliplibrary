import { type Face, fontSpec } from './fonts';

const REFERENCE = 100;

export type Measurer = (text: string, font: Face, tracking: number) => number;

export type FittedLines = { size: number; lines: string[] };

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  const cache = new Map<string, number>();
  return (text, font, tracking) => {
    const key = `${fontSpec(font, REFERENCE)}|${tracking}|${text}`;
    const known = cache.get(key);
    if (known !== undefined) {
      return known;
    }
    let width = text.length * REFERENCE * 0.55;
    if (context !== null) {
      context.font = fontSpec(font, REFERENCE);
      width = context.measureText(text).width;
    }
    const total = (width + tracking * REFERENCE * Math.max(0, [...text].length - 1)) / REFERENCE;
    cache.set(key, total);
    return total;
  };
};

export const glyphMiddle = (ready: boolean, text: string, font: Face): number | null => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  if (context === null || text.trim() === '') {
    return null;
  }
  context.font = fontSpec(font, REFERENCE);
  const metrics = context.measureText(text);
  return (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2 / REFERENCE;
};

export const fitLine = (
  measure: Measurer,
  text: string,
  font: Face,
  tracking: number,
  maxSize: number,
  maxWidth: number,
): number => {
  const width = measure(text, font, tracking);
  return width <= 0 ? maxSize : Math.min(maxSize, maxWidth / width);
};

const greedy = (words: string[], width: (line: string) => number, maxWidth: number) => {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (current !== '' && width(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  return current === '' ? lines : [...lines, current];
};

const wrap = (text: string, width: (line: string) => number, maxWidth: number) =>
  text.split('\n').flatMap((paragraph) =>
    greedy(
      paragraph.split(' ').filter((word) => word !== ''),
      width,
      maxWidth,
    ),
  );

const balanced = (text: string, width: (line: string) => number, maxWidth: number) => {
  const count = wrap(text, width, maxWidth).length;
  let low = 0;
  let high = maxWidth;
  for (let step = 0; step < 14; step++) {
    const middle = (low + high) / 2;
    if (wrap(text, width, middle).length > count) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return wrap(text, width, high);
};

export const wrapLines = (
  measure: Measurer,
  text: string,
  font: Face,
  tracking: number,
  maxSize: number,
  maxWidth: number,
  maxLines: number,
): FittedLines => {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { size: maxSize, lines: [] };
  }
  let size = maxSize;
  for (let attempt = 0; attempt < 40; attempt++) {
    const width = (line: string) => measure(line, font, tracking) * size;
    const lines = balanced(trimmed, width, maxWidth);
    const widest = Math.max(0, ...lines.map(width));
    if ((lines.length <= maxLines && widest <= maxWidth) || size <= maxSize * 0.45) {
      return { size, lines };
    }
    size *= 0.95;
  }
  return { size, lines: [trimmed] };
};

export const fitNames = (
  measure: Measurer,
  first: string,
  joiner: string,
  second: string,
  font: Face,
  maxSize: number,
  maxWidth: number,
): FittedLines => {
  const parts = [first.trim(), joiner.trim(), second.trim()].filter((part) => part !== '');
  const single = parts.join(' ');
  const singleSize = fitLine(measure, single, font, 0, maxSize, maxWidth);
  if (singleSize >= maxSize * 0.8 || parts.length < 2) {
    return { size: singleSize, lines: [single] };
  }
  const stacked =
    parts.length === 3
      ? [`${parts[0]} ${parts[1]}`, parts[2] ?? '']
      : [parts[0] ?? '', parts[1] ?? ''];
  const stackedSize = Math.min(
    maxSize * 0.86,
    ...stacked.map((line) => fitLine(measure, line, font, 0, maxSize, maxWidth)),
  );
  return stackedSize > singleSize * 1.15
    ? { size: stackedSize, lines: stacked }
    : { size: singleSize, lines: [single] };
};
