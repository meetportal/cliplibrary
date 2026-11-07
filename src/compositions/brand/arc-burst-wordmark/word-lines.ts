import type { Glyph } from './fonts';

export type WordLine = { from: number; to: number; x: number; width: number };

const WRAP_BELOW = 0.5;

const lineOf = (glyphs: Glyph[], from: number, to: number): WordLine => {
  const first = glyphs[from];
  const last = glyphs[to - 1];
  if (first === undefined || last === undefined) {
    return { from, to, x: 0, width: 0 };
  }
  return { from, to, x: first.x, width: last.x + last.width - first.x };
};

export const splitLines = (
  glyphs: Glyph[],
  width: number,
  available: number,
  largest: number,
  wrap: boolean,
): { lines: WordLine[]; widest: number } => {
  const single = { lines: [{ from: 0, to: glyphs.length, x: 0, width }], widest: width };
  const fit = width > 0 ? (available / width) * 100 : largest;
  if (!wrap || fit >= largest * WRAP_BELOW) {
    return single;
  }
  const breaks = glyphs.flatMap((glyph, index) =>
    glyph.char.trim() === '' && index > 0 && index < glyphs.length - 1 ? [index] : [],
  );
  const options = breaks.map((at) => {
    const lines = [lineOf(glyphs, 0, at), lineOf(glyphs, at + 1, glyphs.length)];
    return { lines, widest: Math.max(...lines.map((line) => line.width)) };
  });
  return options.reduce((best, option) => (option.widest < best.widest ? option : best), single);
};
