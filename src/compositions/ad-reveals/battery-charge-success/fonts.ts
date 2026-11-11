import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const sora = loadSora('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] });
const manrope = loadManrope('normal', { weights: ['600', '800'], subsets: ['latin', 'latin-ext'] });

export const NAME_FACE: Face = {
  family: sora.fontFamily,
  weight: 700,
  waitUntilDone: sora.waitUntilDone,
};
export const LABEL_FACE: Face = {
  family: manrope.fontFamily,
  weight: 800,
  waitUntilDone: manrope.waitUntilDone,
};
export const BODY_FACE: Face = {
  family: manrope.fontFamily,
  weight: 600,
  waitUntilDone: manrope.waitUntilDone,
};

const FACES = [NAME_FACE, LABEL_FACE, BODY_FACE] as const;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

export type Measure = (text: string, face: Face, tracking?: number) => number;

let canvas: HTMLCanvasElement | null = null;

const widthOf = (text: string, face: Face, tracking: number, loaded: boolean): number => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = loaded && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.6 + tracking);
  }
  context.font = spec(face);
  return context.measureText(text).width / REFERENCE + tracking * letters;
};

export const useMeasure = (): Measure => {
  const [loaded, setLoaded] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the battery charge fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setLoaded(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      FACES.map((face) => face.waitUntilDone().then(() => document.fonts.load(spec(face)))),
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
    (text: string, face: Face, tracking = 0) => widthOf(text, face, tracking, loaded),
    [loaded],
  );
};

export type Wrapped = { lines: string[]; size: number };

const splitInto = (
  words: readonly string[],
  width: number,
  size: number,
  measure: (text: string) => number,
) => {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (current !== '' && measure(candidate) * size > width) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current !== '') {
    lines.push(current);
  }
  return lines;
};

export const wrapToFit = (
  text: string,
  options: { width: number; size: number; minSize: number; maxLines: number },
  measure: (text: string) => number,
): Wrapped => {
  const words = text.split(/\s+/).filter((word) => word !== '');
  if (words.length === 0) {
    return { lines: [], size: options.size };
  }
  for (let size = options.size; size > options.minSize; size -= 2) {
    const lines = splitInto(words, options.width, size, measure);
    const widest = Math.max(...lines.map((line) => measure(line) * size));
    if (lines.length <= options.maxLines && widest <= options.width) {
      return { lines: balance(lines, words, options.width, size, measure), size };
    }
  }
  const lines = splitInto(words, options.width, options.minSize, measure);
  const kept = [
    ...lines.slice(0, options.maxLines - 1),
    lines.slice(options.maxLines - 1).join(' '),
  ];
  const widest = Math.max(...kept.map(measure));
  return { lines: kept, size: Math.min(options.minSize, options.width / Math.max(widest, 0.01)) };
};

const balance = (
  lines: readonly string[],
  words: readonly string[],
  width: number,
  size: number,
  measure: (text: string) => number,
): string[] => {
  if (lines.length !== 2) {
    return [...lines];
  }
  let best: string[] = [...lines];
  let bestScore = Number.POSITIVE_INFINITY;
  for (let cut = 1; cut < words.length; cut++) {
    const first = words.slice(0, cut).join(' ');
    const second = words.slice(cut).join(' ');
    const wide = Math.max(measure(first), measure(second)) * size;
    const score = Math.abs(measure(first) - measure(second));
    if (wide <= width && score < bestScore) {
      best = [first, second];
      bestScore = score;
    }
  }
  return best;
};
