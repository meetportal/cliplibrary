import { loadFont as loadArchivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as loadComfortaa } from '@remotion/google-fonts/Comfortaa';
import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { ArcBurstFont } from '@/schemas';

export type WordmarkFace = { family: string; weight: number; ready: () => Promise<unknown> };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): WordmarkFace => ({ family: loaded.fontFamily, weight, ready: loaded.waitUntilDone });

const LATIN = { subsets: ['latin' as const] };

export const WORDMARK_FONTS: Record<ArcBurstFont, WordmarkFace> = {
  lexend: face(loadLexend('normal', { weights: ['800'], ...LATIN }), 800),
  'archivo-black': face(loadArchivoBlack('normal', { weights: ['400'], ...LATIN }), 400),
  comfortaa: face(loadComfortaa('normal', { weights: ['700'], ...LATIN }), 700),
  fredoka: face(loadFredoka('normal', { weights: ['600'], ...LATIN }), 600),
  unbounded: face(loadUnbounded('normal', { weights: ['700'], ...LATIN }), 700),
};

export type Glyph = { char: string; x: number; width: number };

export type WordMetrics = {
  glyphs: Glyph[];
  width: number;
  ascent: number;
  descent: number;
  inkTop: number;
  inkBottom: number;
};

const REFERENCE = 100;

const spec = (font: WordmarkFace) => `${font.weight} ${REFERENCE}px "${font.family}"`;

const useFontReady = (font: WordmarkFace): boolean => {
  const key = spec(font);
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font.family} wordmark font`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    font
      .ready()
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
  return ready === key;
};

const estimate = (chars: string[], tracking: number): WordMetrics => {
  const advance = REFERENCE * 0.6;
  return {
    glyphs: chars.map((char, index) => ({ char, x: index * (advance + tracking), width: advance })),
    width: chars.length * advance + Math.max(0, chars.length - 1) * tracking,
    ascent: 100,
    descent: 30,
    inkTop: 72,
    inkBottom: 0,
  };
};

const measure = (chars: string[], font: WordmarkFace, tracking: number): WordMetrics => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return estimate(chars, tracking);
  }
  context.font = spec(font);
  const glyphs = chars.map((char, index) => {
    const through = context.measureText(chars.slice(0, index + 1).join('')).width;
    const own = context.measureText(char).width;
    return { char, x: through - own + tracking * index, width: own };
  });
  const whole = context.measureText(chars.join(''));
  return {
    glyphs,
    width: whole.width + tracking * Math.max(0, chars.length - 1),
    ascent: whole.fontBoundingBoxAscent,
    descent: whole.fontBoundingBoxDescent,
    inkTop: whole.actualBoundingBoxAscent,
    inkBottom: whole.actualBoundingBoxDescent,
  };
};

export const useWordMetrics = (text: string, font: ArcBurstFont, tracking: number) => {
  const selected = WORDMARK_FONTS[font];
  const ready = useFontReady(selected);
  return useMemo(() => {
    const chars = [...text];
    return ready
      ? measure(chars, selected, tracking * REFERENCE)
      : estimate(chars, tracking * REFERENCE);
  }, [ready, text, selected, tracking]);
};

export const scaleMetrics = (metrics: WordMetrics, size: number): WordMetrics => {
  const k = size / REFERENCE;
  return {
    glyphs: metrics.glyphs.map((glyph) => ({ ...glyph, x: glyph.x * k, width: glyph.width * k })),
    width: metrics.width * k,
    ascent: metrics.ascent * k,
    descent: metrics.descent * k,
    inkTop: metrics.inkTop * k,
    inkBottom: metrics.inkBottom * k,
  };
};
