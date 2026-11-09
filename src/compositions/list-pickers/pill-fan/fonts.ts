import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { PillFanFont } from '@/schemas';

export type FontFace = { family: string; weight: number };

type Family = {
  family: string;
  display: number;
  text: number;
  waitUntilDone: () => Promise<unknown>;
};

const family = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  display: number,
  text: number,
): Family => ({ family: loaded.fontFamily, display, text, waitUntilDone: loaded.waitUntilDone });

const FAMILIES: Record<PillFanFont, Family> = {
  sora: family(loadSora('normal', { weights: ['700', '500'], subsets: ['latin'] }), 700, 500),
  quicksand: family(
    loadQuicksand('normal', { weights: ['700', '600'], subsets: ['latin'] }),
    700,
    600,
  ),
  fraunces: family(
    loadFraunces('normal', { weights: ['600', '500'], subsets: ['latin'] }),
    600,
    500,
  ),
  outfit: family(loadOutfit('normal', { weights: ['700', '500'], subsets: ['latin'] }), 700, 500),
  'inter-tight': family(
    loadInterTight('normal', { weights: ['700', '600'], subsets: ['latin'] }),
    700,
    600,
  ),
};

export const displayFace = (font: PillFanFont): FontFace => ({
  family: FAMILIES[font].family,
  weight: FAMILIES[font].display,
});

export const textFace = (font: PillFanFont): FontFace => ({
  family: FAMILIES[font].family,
  weight: FAMILIES[font].text,
});

export const REFERENCE_SIZE = 100;

const spec = (face: FontFace) => `${face.weight} ${REFERENCE_SIZE}px "${face.family}"`;

export type Measure = (text: string, face: FontFace) => number;

const estimate: Measure = (text) => [...text].length * REFERENCE_SIZE * 0.58;

const canvasMeasure = (): Measure => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return estimate;
  }
  return (text, face) => {
    context.font = spec(face);
    return context.measureText(text).width;
  };
};

export const useMeasure = (fonts: readonly PillFanFont[]): Measure => {
  const key = [...new Set(fonts)].sort().join(',');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the pill fan fonts ${key}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const chosen = key.split(',') as PillFanFont[];
    Promise.all(
      chosen.map((font) =>
        FAMILIES[font]
          .waitUntilDone()
          .then(() =>
            Promise.all([
              document.fonts.load(spec(displayFace(font))),
              document.fonts.load(spec(textFace(font))),
            ]),
          ),
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
  return useMemo(() => (ready === key ? canvasMeasure() : estimate), [ready, key]);
};
