import { loadFont as loadBodoniModa } from '@remotion/google-fonts/BodoniModa';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { MagnifierBodyFont, MagnifierCaptionFont } from '@/schemas';

export type Face = { family: string; weight: number; ready: () => Promise<unknown> };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  ready: loaded.waitUntilDone,
});

const LATIN = { subsets: ['latin' as const] };

export const CAPTION_FACES: Record<MagnifierCaptionFont, Face> = {
  bodoni: face(loadBodoniModa('normal', { weights: ['500'], ...LATIN }), 500),
  'inter-tight': face(loadInterTight('normal', { weights: ['700'], ...LATIN }), 700),
  fraunces: face(loadFraunces('normal', { weights: ['500'], ...LATIN }), 500),
};

export type BodyFaces = { word: Face; lit: Face; name: Face };

const inter = loadInter('normal', { weights: ['400', '600', '700'], ...LATIN });
const manrope = loadManrope('normal', { weights: ['400', '600', '700'], ...LATIN });

export const BODY_FACES: Record<MagnifierBodyFont, BodyFaces> = {
  inter: { word: face(inter, 400), lit: face(inter, 700), name: face(inter, 600) },
  manrope: { word: face(manrope, 400), lit: face(manrope, 700), name: face(manrope, 600) },
};

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

export const useFontsReady = (caption: MagnifierCaptionFont, body: MagnifierBodyFont): boolean => {
  const key = `${caption}|${body}`;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${key} magnifier fonts`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const bodies = BODY_FACES[body];
    const faces = [CAPTION_FACES[caption], bodies.word, bodies.lit, bodies.name];
    Promise.all(faces.map((font) => font.ready()))
      .then(() => Promise.all(faces.map((font) => document.fonts.load(fontSpec(font, 100)))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [caption, body, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};
