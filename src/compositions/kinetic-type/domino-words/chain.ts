import type { DominoWordsProps } from '@/schemas';
import { capTop, type Face, type Measure } from './fonts';

export type Domino = {
  text: string;
  size: number;
  pad: number;
  textTop: number;
  pivot: number;
  thickness: number;
  length: number;
};

const ENDS_PHRASE = /[.,!?;:]$/;

const chunkCost = (letters: number, limit: number, words: number, last: string): number => {
  const over = Math.max(0, letters - limit);
  const ideal = limit * 0.75;
  const single = words === 1 && letters < limit * 0.45 ? 30 : 0;
  return (letters - ideal) ** 2 + over * 400 + 40 + single - (ENDS_PHRASE.test(last) ? 25 : 0);
};

type Step = { cost: number; from: number };

const bestStep = (words: string[], best: Step[], end: number, limit: number): Step => {
  let pick = { cost: Number.POSITIVE_INFINITY, from: end - 1 };
  let letters = -1;
  for (let start = end - 1; start >= 0; start--) {
    letters += (words[start]?.length ?? 0) + 1;
    if (start < end - 1 && letters > limit) {
      break;
    }
    const cost =
      (best[start]?.cost ?? 0) +
      chunkCost(letters, limit, end - start, words[end - 1] ?? '') +
      (start > 0 && ENDS_PHRASE.test(words[start - 1] ?? '') ? -10 : 0);
    if (cost < pick.cost) {
      pick = { cost, from: start };
    }
  }
  return pick;
};

const chunkWords = (text: string, limit: number): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const best: Step[] = [{ cost: 0, from: 0 }];
  for (let end = 1; end <= words.length; end++) {
    best.push(bestStep(words, best, end, limit));
  }
  const chunks: string[] = [];
  for (let end = words.length; end > 0; ) {
    const from = best[end]?.from ?? end - 1;
    chunks.unshift(words.slice(from, end).join(' '));
    end = from;
  }
  return chunks;
};

export const buildChain = (
  words: DominoWordsProps['words'],
  headline: string,
  face: Face,
  measure: Measure,
  maxLength: number,
): Domino[] => {
  const chunks = chunkWords(words.caps ? headline.toUpperCase() : headline, words.letters);
  const count = chunks.length;
  const dominoes: Domino[] = [];
  let edge = 0;
  chunks.forEach((text, index) => {
    const box = measure(text, face);
    const share = count === 1 ? 1 : index / (count - 1);
    const wanted = words.size * (1 - words.growth * (1 - share));
    const size = Math.min(wanted, maxLength / Math.max(0.1, box.width + 2 * words.padding));
    const pad = words.padding * size;
    const glyphHeight = (words.caps ? box.cap : box.cap + box.descent * 0.8) * size;
    const thickness = glyphHeight + 2 * pad;
    const length = box.width * size + 2 * pad;
    const previous = dominoes[index - 1];
    const pivot = previous === undefined ? 0 : edge + words.spacing * previous.length + thickness;
    dominoes.push({
      text,
      size,
      pad,
      textTop: pad - capTop(box, size),
      pivot,
      thickness,
      length,
    });
    edge = pivot;
  });
  return dominoes;
};
