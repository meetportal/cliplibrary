import { loadFont as loadDmMono } from '@remotion/google-fonts/DMMono';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const outfit = loadOutfit('normal', {
  weights: ['400', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});
const dmMono = loadDmMono('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] });

const face = (weight: number): Face => ({
  family: outfit.fontFamily,
  weight,
  waitUntilDone: outfit.waitUntilDone,
});

export const HEADLINE_FACE = face(800);
export const LABEL_FACE = face(700);
export const NAME_FACE = face(400);
export const URL_FACE = face(600);
export const MONO_FACE: Face = {
  family: dmMono.fontFamily,
  weight: 400,
  waitUntilDone: dmMono.waitUntilDone,
};

const FACES = [HEADLINE_FACE, LABEL_FACE, NAME_FACE, URL_FACE, MONO_FACE] as const;

const REFERENCE = 100;

const spec = (target: Face) => `${target.weight} ${REFERENCE}px "${target.family}"`;

export type Measure = (text: string, target: Face, tracking?: number) => number;

let canvas: HTMLCanvasElement | null = null;

const widthOf = (text: string, target: Face, tracking: number, loaded: boolean): number => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = loaded && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.6 + tracking);
  }
  context.font = spec(target);
  return context.measureText(text).width / REFERENCE + tracking * letters;
};

export const useMeasure = (): Measure => {
  const [loaded, setLoaded] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the charge compare fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setLoaded(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      FACES.map((target) => target.waitUntilDone().then(() => document.fonts.load(spec(target)))),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [delayRender, continueRender]);
  useEffect(() => {
    if (loaded && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, handle, continueRender]);
  return useCallback(
    (text: string, target: Face, tracking = 0) => widthOf(text, target, tracking, loaded),
    [loaded],
  );
};

export const fitSize = (width: number, ems: number, size: number, minSize: number) =>
  Math.max(minSize, Math.min(size, Math.floor(width / Math.max(ems, 0.01))));

export type Wrapped = { lines: string[]; size: number };

const splitInto = (words: readonly string[], width: number, measure: (text: string) => number) => {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current === '' ? word : `${current} ${word}`;
    if (current !== '' && measure(next) > width) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current !== '') {
    lines.push(current);
  }
  return lines;
};

const balance = (lines: string[], words: readonly string[], measure: (text: string) => number) => {
  if (lines.length !== 2) {
    return lines;
  }
  const limit = Math.max(...lines.map(measure));
  let best = lines;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let cut = 1; cut < words.length; cut++) {
    const first = words.slice(0, cut).join(' ');
    const second = words.slice(cut).join(' ');
    const score = Math.abs(measure(first) - measure(second));
    if (Math.max(measure(first), measure(second)) <= limit && score <= bestScore) {
      best = [first, second];
      bestScore = score;
    }
  }
  return best;
};

export const wrapToFit = (
  text: string,
  options: { width: number; size: number; minSize: number; maxLines: number },
  emsOf: (text: string) => number,
): Wrapped => {
  const words = text.split(/\s+/).filter((word) => word !== '');
  if (words.length === 0) {
    return { lines: [], size: options.size };
  }
  for (let size = options.size; size >= options.minSize; size -= 2) {
    const measure = (line: string) => emsOf(line) * size;
    const lines = splitInto(words, options.width, measure);
    if (lines.length <= options.maxLines && Math.max(...lines.map(measure)) <= options.width) {
      return { lines: balance(lines, words, measure), size };
    }
  }
  const measure = (line: string) => emsOf(line) * options.minSize;
  const lines = splitInto(words, options.width, measure);
  const kept = [
    ...lines.slice(0, options.maxLines - 1),
    lines.slice(options.maxLines - 1).join(' '),
  ];
  const widest = Math.max(...kept.map(emsOf));
  return { lines: kept, size: Math.min(options.minSize, Math.floor(options.width / widest)) };
};
