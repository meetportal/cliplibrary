import { type Face, fontSpec } from './fonts';

const REFERENCE = 100;

export type Measurer = (text: string, font: Face, size: number, tracking: number) => number;

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  const cache = new Map<string, number>();
  return (text, font, size, tracking) => {
    const key = `${fontSpec(font, REFERENCE)}|${text}`;
    let width = cache.get(key);
    if (width === undefined) {
      width = text.length * REFERENCE * 0.6;
      if (context !== null) {
        context.font = fontSpec(font, REFERENCE);
        width = context.measureText(text).width;
      }
      cache.set(key, width);
    }
    return (width + tracking * REFERENCE * Array.from(text).length) * (size / REFERENCE);
  };
};

export const fitSize = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  tracking: number,
  maxWidth: number,
): number => {
  const width = measure(text, font, REFERENCE, tracking);
  return width <= 0 ? maxSize : Math.min(maxSize, (maxWidth / width) * REFERENCE);
};

const words = (text: string) => text.split(' ').filter((word) => word !== '');

export const balancedSplit = (text: string): string[] => {
  const list = words(text);
  if (list.length < 2) {
    return [text.trim()];
  }
  let best = { score: Number.POSITIVE_INFINITY, lines: [text.trim()] };
  for (let at = 1; at < list.length; at++) {
    const first = list.slice(0, at).join(' ');
    const second = list.slice(at).join(' ');
    const score = Math.abs(first.length - second.length) - (/[,;:.]$/.test(first) ? 12 : 0);
    if (score < best.score) {
      best = { score, lines: [first, second] };
    }
  }
  return best.lines;
};
