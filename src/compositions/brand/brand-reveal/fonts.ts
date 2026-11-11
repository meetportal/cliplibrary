import { loadFont as loadDmSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { BrandRevealFont } from '@/schemas';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  waitUntilDone: loaded.waitUntilDone,
});

const subsets = ['latin' as const, 'latin-ext' as const];

export const NAME_FACES: Record<BrandRevealFont, Face> = {
  'inter-tight': face(loadInterTight('normal', { weights: ['700'], subsets }), 700),
  manrope: face(loadManrope('normal', { weights: ['800'], subsets }), 800),
  sora: face(loadSora('normal', { weights: ['600'], subsets }), 600),
  'dm-sans': face(loadDmSans('normal', { weights: ['700'], subsets }), 700),
};

const inter = loadInter('normal', { weights: ['400', '600'], subsets });

export const EYEBROW_FACE = face(inter, 600);

export const TAGLINE_FACE = face(inter, 400);

const REFERENCE_SIZE = 100;

const spec = (font: Face) => `${font.weight} ${REFERENCE_SIZE}px "${font.family}"`;

export const useFontReady = (font: Face): boolean => {
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const wanted = spec(font);
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font.family} font`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(wanted);
      } else {
        continueRender(pending);
      }
    };
    font
      .waitUntilDone()
      .then(() => document.fonts.load(wanted))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, wanted, delayRender, continueRender]);
  useEffect(() => {
    if (ready === wanted && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, wanted, handle, continueRender]);
  return ready === wanted;
};

const measureWidth = (text: string, font: Face | null, tracking: number): number => {
  const chars = [...text].length;
  const spacing = tracking * REFERENCE_SIZE * chars;
  const context =
    font === null || typeof document === 'undefined'
      ? null
      : document.createElement('canvas').getContext('2d');
  if (font === null || context === null) {
    return chars * REFERENCE_SIZE * 0.6 + spacing;
  }
  context.font = spec(font);
  return context.measureText(text).width + spacing;
};

export const useTextWidth = (text: string, font: Face, tracking: number): number => {
  const ready = useFontReady(font);
  return useMemo(
    () => measureWidth(text, ready ? font : null, tracking) / REFERENCE_SIZE,
    [ready, text, font, tracking],
  );
};
