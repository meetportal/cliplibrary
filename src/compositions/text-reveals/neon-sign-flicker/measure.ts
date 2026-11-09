import { type Face, fontSpec } from './fonts';

const REFERENCE = 100;

export type Measurer = (text: string, font: Face) => number;

export type Glyph = { char: string; x: number; width: number };

export type GlyphLine = { glyphs: Glyph[]; width: number };

export type TextLines = { size: number; lines: string[]; widths: number[] };

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  const cache = new Map<string, number>();
  return (text, font) => {
    const key = `${fontSpec(font, REFERENCE)}|${text}`;
    const known = cache.get(key);
    if (known !== undefined) {
      return known;
    }
    let width = text.length * REFERENCE * 0.6;
    if (context !== null) {
      context.font = fontSpec(font, REFERENCE);
      width = context.measureText(text).width;
    }
    cache.set(key, width);
    return width;
  };
};

const tracked = (measure: Measurer, text: string, font: Face, tracking: number) =>
  measure(text, font) + tracking * REFERENCE * Math.max(0, [...text].length - 1);

const glyphLine = (
  measure: Measurer,
  text: string,
  font: Face,
  size: number,
  tracking: number,
): GlyphLine => {
  const scale = size / REFERENCE;
  const chars = [...text];
  const glyphs = chars.map((char, index) => {
    const through = measure(chars.slice(0, index + 1).join(''), font);
    const own = measure(char, font);
    return {
      char,
      x: (through - own + tracking * REFERENCE * index) * scale,
      width: own * scale,
    };
  });
  return { glyphs, width: tracked(measure, text, font, tracking) * scale };
};

const splits = (text: string): string[][] => {
  const words = text.split(' ').filter((word) => word !== '');
  const options = [[words.join(' ')]];
  for (let at = 1; at < words.length; at++) {
    options.push([words.slice(0, at).join(' '), words.slice(at).join(' ')]);
  }
  return options;
};

export const fitNeonLines = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  tracking: number,
  maxWidth: number,
): { size: number; lines: GlyphLine[] } => {
  const ranked = splits(text.trim()).map((lines) => {
    const widest = Math.max(1, ...lines.map((line) => tracked(measure, line, font, tracking)));
    const fit = Math.min(maxSize, (maxWidth / widest) * REFERENCE);
    return { lines, size: lines.length > 1 ? fit / 1.2 : fit };
  });
  const best = ranked.reduce((winner, option) => (option.size > winner.size ? option : winner));
  const size = best.lines.length > 1 ? best.size * 1.2 : best.size;
  return {
    size,
    lines: best.lines.map((line) => glyphLine(measure, line, font, size, tracking)),
  };
};

const greedy = (words: string[], width: (text: string) => number, maxWidth: number): string[] => {
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

const wrapParagraphs = (text: string, width: (line: string) => number, maxWidth: number) =>
  text.split('\n').flatMap((paragraph) =>
    greedy(
      paragraph.split(' ').filter((word) => word !== ''),
      width,
      maxWidth,
    ),
  );

const balance = (text: string, width: (line: string) => number, maxWidth: number) => {
  const target = wrapParagraphs(text, width, maxWidth).length;
  let low = 0;
  let high = maxWidth;
  for (let step = 0; step < 14; step++) {
    const middle = (low + high) / 2;
    if (wrapParagraphs(text, width, middle).length > target) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return wrapParagraphs(text, width, high);
};

export const wrapLines = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  tracking: number,
  maxWidth: number,
  maxLines: number,
): TextLines => {
  let size = maxSize;
  for (let attempt = 0; attempt < 40; attempt++) {
    const scale = size / REFERENCE;
    const width = (line: string) => tracked(measure, line, font, tracking) * scale;
    const lines = balance(text.trim(), width, maxWidth);
    const widest = Math.max(0, ...lines.map(width));
    if ((lines.length <= maxLines && widest <= maxWidth) || size <= maxSize * 0.4) {
      return { size, lines, widths: lines.map(width) };
    }
    size *= 0.96;
  }
  return { size, lines: [text], widths: [maxWidth] };
};

export const fitLine = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  tracking: number,
  maxWidth: number,
): number => {
  const width = tracked(measure, text, font, tracking);
  return width <= 0 ? maxSize : Math.min(maxSize, (maxWidth / width) * REFERENCE);
};
