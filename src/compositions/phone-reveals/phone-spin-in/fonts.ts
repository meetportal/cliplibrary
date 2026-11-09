import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { PhoneSpinFont } from '@/schemas';

export type TypeFace = {
  family: string;
  weight: number;
  tracking: number;
  ready: () => Promise<unknown>;
};

const LATIN = { subsets: ['latin' as const] };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
  tracking: number,
): TypeFace => ({ family: loaded.fontFamily, weight, tracking, ready: loaded.waitUntilDone });

export const HEADLINE_FACES: Record<PhoneSpinFont, TypeFace> = {
  'inter-tight': face(loadInterTight('normal', { weights: ['600'], ...LATIN }), 600, -0.035),
  'instrument-serif': face(
    loadInstrumentSerif('normal', { weights: ['400'], ...LATIN }),
    400,
    -0.01,
  ),
  manrope: face(loadManrope('normal', { weights: ['700'], ...LATIN }), 700, -0.03),
};

export const WEBSITE_FACE = face(loadInter('normal', { weights: ['500'], ...LATIN }), 500, -0.005);

export const fontSpec = (font: TypeFace, size: number) =>
  `${font.weight} ${size}px "${font.family}"`;

export const useFacesReady = (headline: PhoneSpinFont): boolean => {
  const faces = useMemo(() => [HEADLINE_FACES[headline], WEBSITE_FACE], [headline]);
  const key = faces.map((font) => fontSpec(font, 100)).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the fonts ${key}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      faces.map((font) => font.ready().then(() => document.fonts.load(fontSpec(font, 100)))),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [faces, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};
