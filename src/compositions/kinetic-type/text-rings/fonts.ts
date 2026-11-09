import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import { TEXT_RING_FONTS, type TextRingFont } from '@/schemas';

export type RingFace = {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  waitUntilDone: () => Promise<unknown>;
};

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
  style: 'normal' | 'italic' = 'normal',
): RingFace => ({ family: loaded.fontFamily, weight, style, waitUntilDone: loaded.waitUntilDone });

export const RING_FACES: Record<TextRingFont, RingFace> = {
  sans: face(loadInterTight('normal', { weights: ['500'], subsets: ['latin', 'latin-ext'] }), 500),
  'sans-bold': face(
    loadInterTight('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] }),
    700,
  ),
  geometric: face(
    loadManrope('normal', { weights: ['600'], subsets: ['latin', 'latin-ext'] }),
    600,
  ),
  serif: face(loadFraunces('normal', { weights: ['500'], subsets: ['latin', 'latin-ext'] }), 500),
  'serif-italic': face(
    loadInstrumentSerif('italic', { weights: ['400'], subsets: ['latin', 'latin-ext'] }),
    400,
    'italic',
  ),
};

const MEASURE_SIZE = 100;

const fontSpec = (font: RingFace) =>
  `${font.style} ${font.weight} ${MEASURE_SIZE}px "${font.family}"`;

export type PhraseMetrics = {
  text: string;
  glyphs: { x: number; width: number }[];
  width: number;
};

const estimate = (text: string): PhraseMetrics => {
  const advance = 0.56;
  return {
    text,
    glyphs: [...text].map((_char, index) => ({ x: index * advance, width: advance })),
    width: [...text].length * advance,
  };
};

const measure = (text: string, font: RingFace): PhraseMetrics => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return estimate(text);
  }
  context.font = fontSpec(font);
  const chars = [...text];
  const glyphs = chars.map((char, index) => {
    const through = context.measureText(chars.slice(0, index + 1).join('')).width;
    const own = context.measureText(char).width;
    return { x: (through - own) / MEASURE_SIZE, width: own / MEASURE_SIZE };
  });
  return { text, glyphs, width: context.measureText(text).width / MEASURE_SIZE };
};

const useFontsReady = (fonts: readonly RingFace[]): boolean => {
  const key = fonts.map(fontSpec).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the text ring fonts ${key}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      fonts.map((font) => font.waitUntilDone().then(() => document.fonts.load(fontSpec(font)))),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [fonts, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};

export type PhraseRequest = { text: string; font: TextRingFont };

export const usePhraseMetrics = (requests: readonly PhraseRequest[]): PhraseMetrics[] => {
  const fontKey = TEXT_RING_FONTS.filter((font) =>
    requests.some((request) => request.font === font),
  ).join('|');
  const fonts = useMemo(
    () =>
      TEXT_RING_FONTS.filter((font) => fontKey.split('|').includes(font)).map(
        (font) => RING_FACES[font],
      ),
    [fontKey],
  );
  const ready = useFontsReady(fonts);
  return useMemo(
    () =>
      requests.map((request) =>
        ready ? measure(request.text, RING_FACES[request.font]) : estimate(request.text),
      ),
    [ready, requests],
  );
};
