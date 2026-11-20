import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadUrbanist } from '@remotion/google-fonts/Urbanist';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { TechStackFont } from '@/schemas';

type FontFace = { family: string; weight: number };

type Family = { family: string; title: number; detail: number; ready: () => Promise<unknown> };

const family = (loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> }): Family => ({
  family: loaded.fontFamily,
  title: 500,
  detail: 400,
  ready: loaded.waitUntilDone,
});

const FAMILIES: Record<TechStackFont, Family> = {
  urbanist: family(loadUrbanist('normal', { weights: ['500', '400'], subsets: ['latin'] })),
  outfit: family(loadOutfit('normal', { weights: ['500', '400'], subsets: ['latin'] })),
  sora: family(loadSora('normal', { weights: ['500', '400'], subsets: ['latin'] })),
  manrope: family(loadManrope('normal', { weights: ['500', '400'], subsets: ['latin'] })),
  'inter-tight': family(loadInterTight('normal', { weights: ['500', '400'], subsets: ['latin'] })),
};

export type Faces = { title: FontFace; detail: FontFace };

export const facesFor = (font: TechStackFont): Faces => ({
  title: { family: FAMILIES[font].family, weight: FAMILIES[font].title },
  detail: { family: FAMILIES[font].family, weight: FAMILIES[font].detail },
});

export const REFERENCE_SIZE = 100;

const spec = (face: FontFace) => `${face.weight} ${REFERENCE_SIZE}px "${face.family}"`;

export type Measure = (text: string, face: FontFace) => number;

const estimate: Measure = (text) => [...text].length * REFERENCE_SIZE * 0.55;

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

export const useMeasure = (font: TechStackFont): Measure => {
  const [ready, setReady] = useState<TechStackFont | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the tech stack font ${font}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(font);
      } else {
        continueRender(pending);
      }
    };
    const faces = facesFor(font);
    FAMILIES[font]
      .ready()
      .then(() =>
        Promise.all([
          document.fonts.load(spec(faces.title)),
          document.fonts.load(spec(faces.detail)),
        ]),
      )
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, delayRender, continueRender]);
  useEffect(() => {
    if (ready === font && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, font, handle, continueRender]);
  return useMemo(() => (ready === font ? canvasMeasure() : estimate), [ready, font]);
};
