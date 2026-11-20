import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { PillStickerFont } from '@/schemas';

export type StickerFace = {
  family: string;
  weight: number;
  tracking: number;
  waitUntilDone: () => Promise<unknown>;
};

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const subsets = ['latin' as const, 'latin-ext' as const];

const face = (loaded: Loaded, tracking: number): StickerFace => ({
  family: loaded.fontFamily,
  weight: 700,
  tracking,
  waitUntilDone: loaded.waitUntilDone,
});

export const STICKER_FACES: Record<PillStickerFont, StickerFace> = {
  montserrat: face(loadMontserrat('normal', { weights: ['700'], subsets }), -0.01),
  poppins: face(loadPoppins('normal', { weights: ['700'], subsets }), -0.01),
  outfit: face(loadOutfit('normal', { weights: ['700'], subsets }), 0),
  sora: face(loadSora('normal', { weights: ['700'], subsets }), -0.02),
};

const REFERENCE = 100;

const spec = (font: StickerFace) => `normal ${font.weight} ${REFERENCE}px "${font.family}"`;

export const faceStyle = (font: StickerFace) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  letterSpacing: `${font.tracking}em`,
});

export type Measure = (text: string) => number;

let canvas: HTMLCanvasElement | null = null;

const widthPerSize = (text: string, font: StickerFace, ready: boolean) => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = ready && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.62 + font.tracking);
  }
  context.font = spec(font);
  return context.measureText(text).width / REFERENCE + font.tracking * letters;
};

export const useStickerMeasure = (font: StickerFace): Measure => {
  const key = spec(font);
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the sticker font ${key}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    font
      .waitUntilDone()
      .then(() => document.fonts.load(key))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  const loaded = ready === key;
  return useCallback((text: string) => widthPerSize(text, font, loaded), [font, loaded]);
};
