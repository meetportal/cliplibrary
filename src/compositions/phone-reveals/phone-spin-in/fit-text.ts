import { fontSpec, type TypeFace } from './fonts';

type Measure = (text: string, size: number) => number;

const measurer = (font: TypeFace, ready: boolean): Measure => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  return (text, size) => {
    const tracking = font.tracking * size * Math.max(0, [...text].length - 1);
    if (context === null) {
      return [...text].length * size * 0.55 + tracking;
    }
    context.font = fontSpec(font, size);
    return context.measureText(text).width + tracking;
  };
};

const wrap = (paragraphs: string[], size: number, width: number, measure: Measure): string[] =>
  paragraphs.flatMap((paragraph) => {
    const lines: string[] = [];
    let line = '';
    for (const word of paragraph.split(/\s+/).filter((part) => part !== '')) {
      const candidate = line === '' ? word : `${line} ${word}`;
      if (line !== '' && measure(candidate, size) > width) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    return [...lines, line];
  });

const balance = (paragraphs: string[], size: number, width: number, measure: Measure): string[] => {
  const lines = wrap(paragraphs, size, width, measure);
  let best = lines;
  for (let narrower = width - 8; narrower > size * 2; narrower -= 8) {
    const candidate = wrap(paragraphs, size, narrower, measure);
    if (
      candidate.length !== lines.length ||
      candidate.some((line) => measure(line, size) > narrower)
    ) {
      break;
    }
    best = candidate;
  }
  return best;
};

export type FittedText = { size: number; lines: string[]; width: number };

export const fitText = (
  text: string,
  font: TypeFace,
  ready: boolean,
  { maxSize, maxLines, width }: { maxSize: number; maxLines: number; width: number },
): FittedText => {
  const measure = measurer(font, ready);
  const paragraphs = text.split('\n').map((line) => line.trim());
  const floor = Math.max(12, Math.round(maxSize * 0.4));
  let fitted: FittedText = { size: floor, lines: paragraphs, width: 0 };
  for (let size = Math.round(maxSize); size >= floor; size -= 1) {
    const lines = wrap(paragraphs, size, width, measure);
    const widest = Math.max(0, ...lines.map((line) => measure(line, size)));
    fitted = { size, lines, width: widest };
    if (lines.length <= Math.max(maxLines, paragraphs.length) && widest <= width) {
      const balanced = balance(paragraphs, size, width, measure);
      return {
        size,
        lines: balanced,
        width: Math.max(0, ...balanced.map((line) => measure(line, size))),
      };
    }
  }
  return fitted;
};
