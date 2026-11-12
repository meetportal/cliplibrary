import { type Face, measureWidth } from './fonts';

export const LINE_HEIGHT = 0.98;
export const SIDE = 90;

export type NameLayout = {
  lines: string[];
  size: number;
  width: number;
  height: number;
};

const joinRange = (words: string[], from: number, to: number) => words.slice(from, to).join(' ');

const splits = (words: string[]): string[][] => {
  const options: string[][] = [];
  for (let first = 1; first < words.length; first++) {
    options.push([joinRange(words, 0, first), joinRange(words, first, words.length)]);
    for (let second = first + 1; second < words.length; second++) {
      options.push([
        joinRange(words, 0, first),
        joinRange(words, first, second),
        joinRange(words, second, words.length),
      ]);
    }
  }
  return options;
};

export const layoutName = (
  name: string,
  face: Face,
  ready: boolean,
  maxSize: number,
  maxWidth: number,
): NameLayout => {
  const text = name.trim();
  const words = text.split(/\s+/).filter((word) => word !== '');
  const single = measureWidth(text, face, ready);
  const options = [[text], ...splits(words)].map((lines) => {
    const widest = Math.max(...lines.map((line) => measureWidth(line, face, ready)), 0.01);
    return { lines, widest, size: Math.min(maxSize, maxWidth / widest) };
  });
  const [first, ...rest] = options;
  const score = (option: { lines: string[]; size: number }) =>
    option.size / (1 + 0.12 * (option.lines.length - 1));
  const best = rest.reduce(
    (pick, option) => (score(option) > score(pick) ? option : pick),
    first ?? { lines: [text], widest: single, size: maxSize },
  );
  return {
    lines: best.lines,
    size: best.size,
    width: best.widest * best.size,
    height: best.lines.length * LINE_HEIGHT * best.size,
  };
};

export const circleTextScale = (layout: NameLayout, circleSize: number): number =>
  Math.min(1, (circleSize * 0.72) / Math.max(1, Math.hypot(layout.width, layout.height)));
