import { loadFont as loadDmSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { BrandingTickerHeadlineFont, BrandingTickerWordFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  waitUntilDone: () => Promise<unknown>;
};

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number, style: Face['style']): Face => ({
  family: loaded.fontFamily,
  weight,
  style,
  waitUntilDone: loaded.waitUntilDone,
});

const subsets = ['latin' as const, 'latin-ext' as const];

export const HEADLINE_FACES: Record<BrandingTickerHeadlineFont, Face> = {
  playfair: face(loadPlayfair('italic', { weights: ['700'], subsets }), 700, 'italic'),
  fraunces: face(loadFraunces('italic', { weights: ['600'], subsets }), 600, 'italic'),
  'dm-serif': face(loadDmSerif('italic', { weights: ['400'], subsets }), 400, 'italic'),
};

export type WordFaces = { bold: Face; medium: Face };

const pair = (loaded: Loaded): WordFaces => ({
  bold: face(loaded, 700, 'normal'),
  medium: face(loaded, 600, 'normal'),
});

export const WORD_FACES: Record<BrandingTickerWordFont, WordFaces> = {
  poppins: pair(loadPoppins('normal', { weights: ['600', '700'], subsets })),
  sora: pair(loadSora('normal', { weights: ['600', '700'], subsets })),
  outfit: pair(loadOutfit('normal', { weights: ['600', '700'], subsets })),
};

const REFERENCE = 100;

const spec = (font: Face) => `${font.style} ${font.weight} ${REFERENCE}px "${font.family}"`;

export const faceStyle = (font: Face) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  fontStyle: font.style,
});

export type Measure = (text: string, font: Face, tracking?: number) => number;

let canvas: HTMLCanvasElement | null = null;

const widthPerSize = (text: string, font: Face, tracking: number, ready: boolean) => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = ready && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.6 + tracking);
  }
  context.font = spec(font);
  return context.measureText(text).width / REFERENCE + tracking * letters;
};

export const useMeasure = (faces: readonly Face[]): Measure => {
  const key = [...new Set(faces.map(spec))].join('|');
  const latest = useRef(faces);
  latest.current = faces;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the ticker fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      latest.current.map((item) =>
        item.waitUntilDone().then(() => document.fonts.load(spec(item))),
      ),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  const loaded = ready === key;
  return useCallback(
    (text: string, font: Face, tracking = 0) => widthPerSize(text, font, tracking, loaded),
    [loaded],
  );
};
