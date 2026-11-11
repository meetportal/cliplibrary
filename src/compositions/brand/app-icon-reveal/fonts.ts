import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { AppIconFont } from '@/schemas';

type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  waitUntilDone: loaded.waitUntilDone,
});

const latin = { weights: ['600' as const], subsets: ['latin' as const, 'latin-ext' as const] };

export const NAME_FACES: Record<AppIconFont, Face> = {
  poppins: face(loadPoppins('normal', latin), 600),
  outfit: face(loadOutfit('normal', latin), 600),
  sora: face(loadSora('normal', latin), 600),
  inter: face(loadInter('normal', latin), 600),
};

const REFERENCE_SIZE = 100;

const spec = (font: Face) => `${font.weight} ${REFERENCE_SIZE}px "${font.family}"`;

const useFontReady = (font: Face): boolean => {
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const wanted = spec(font);
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font.family} name font`);
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
    return chars * REFERENCE_SIZE * 0.62 + spacing;
  }
  context.font = spec(font);
  return context.measureText(text).width + spacing;
};

export const useNameWidth = (text: string, font: AppIconFont, tracking: number): number => {
  const selected = NAME_FACES[font];
  const ready = useFontReady(selected);
  return useMemo(
    () => measureWidth(text, ready ? selected : null, tracking) / REFERENCE_SIZE,
    [ready, text, selected, tracking],
  );
};
