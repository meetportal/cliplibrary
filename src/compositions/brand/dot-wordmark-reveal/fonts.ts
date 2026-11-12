import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { DotWordmarkLineFont, DotWordmarkNameFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  tracking: number;
  ready: () => Promise<unknown>;
};

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number, tracking: number): Face => ({
  family: loaded.fontFamily,
  weight,
  tracking,
  ready: loaded.waitUntilDone,
});

const LATIN = { subsets: ['latin' as const, 'latin-ext' as const] };

export const NAME_FACES: Record<DotWordmarkNameFont, Face> = {
  quicksand: face(loadQuicksand('normal', { weights: ['700'], ...LATIN }), 700, 0),
  fredoka: face(loadFredoka('normal', { weights: ['600'], ...LATIN }), 600, 0),
  outfit: face(loadOutfit('normal', { weights: ['600'], ...LATIN }), 600, -0.01),
  sora: face(loadSora('normal', { weights: ['600'], ...LATIN }), 600, -0.02),
};

export const LINE_FACES: Record<DotWordmarkLineFont, Face> = {
  inter: face(loadInter('normal', { weights: ['600'], ...LATIN }), 600, -0.01),
  outfit: face(loadOutfit('normal', { weights: ['500'], ...LATIN }), 500, 0),
  sora: face(loadSora('normal', { weights: ['500'], ...LATIN }), 500, -0.01),
};

const REFERENCE = 100;

const spec = (font: Face) => `${font.weight} ${REFERENCE}px "${font.family}"`;

const useFontsReady = (faces: readonly Face[]): boolean => {
  const wanted = faces.map(spec).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the wordmark fonts ${wanted}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(wanted);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      wanted
        .split('|')
        .map((one, at) =>
          (faces[at]?.ready() ?? Promise.resolve()).then(() => document.fonts.load(one)),
        ),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [wanted, faces, delayRender, continueRender]);
  useEffect(() => {
    if (ready === wanted && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, wanted, handle, continueRender]);
  return ready === wanted;
};

const widthOf = (text: string, font: Face, ready: boolean): number => {
  const context =
    !ready || typeof document === 'undefined'
      ? null
      : document.createElement('canvas').getContext('2d');
  if (context === null) {
    return [...text].length * REFERENCE * 0.56;
  }
  context.font = spec(font);
  return context.measureText(text).width;
};

export type Measured = { name: number[]; words: number[]; space: number };

export const useMeasured = (
  nameFace: Face,
  lineFace: Face,
  letters: readonly string[],
  words: readonly string[],
): Measured => {
  const faces = useMemo(
    () => (nameFace === lineFace ? [nameFace] : [nameFace, lineFace]),
    [nameFace, lineFace],
  );
  const ready = useFontsReady(faces);
  return useMemo(
    () => ({
      name: letters.map((letter) => widthOf(letter, nameFace, ready) / REFERENCE),
      words: words.map((word) => widthOf(word, lineFace, ready) / REFERENCE),
      space: widthOf(' ', lineFace, ready) / REFERENCE,
    }),
    [letters, words, nameFace, lineFace, ready],
  );
};
