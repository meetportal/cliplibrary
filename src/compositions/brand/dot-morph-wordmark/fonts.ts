import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadUrbanist } from '@remotion/google-fonts/Urbanist';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { DotMorphFont } from '@/schemas';

type FontFace = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): FontFace => ({ family: loaded.fontFamily, weight, waitUntilDone: loaded.waitUntilDone });

export const WORDMARK_FONTS: Record<DotMorphFont, FontFace> = {
  urbanist: face(loadUrbanist('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  quicksand: face(loadQuicksand('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  sora: face(loadSora('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  fraunces: face(loadFraunces('normal', { weights: ['600'], subsets: ['latin'] }), 600),
};

type Glyph = { char: string; x: number; width: number };

export type TextMetrics = {
  glyphs: Glyph[];
  width: number;
  ascent: number;
  descent: number;
  capHeight: number;
  xHeight: number;
  stopWidth: number;
};

export const REFERENCE_SIZE = 100;

const fontSpec = (font: FontFace, size: number) => `${font.weight} ${size}px "${font.family}"`;

const useFontReady = (font: FontFace): boolean => {
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const spec = fontSpec(font, REFERENCE_SIZE);
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font.family} wordmark font`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(spec);
      } else {
        continueRender(pending);
      }
    };
    font
      .waitUntilDone()
      .then(() => document.fonts.load(spec))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, spec, delayRender, continueRender]);
  useEffect(() => {
    if (ready === spec && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, spec, handle, continueRender]);
  return ready === spec;
};

const estimate = (text: string): TextMetrics => {
  const advance = REFERENCE_SIZE * 0.56;
  return {
    glyphs: [...text].map((char, index) => ({ char, x: index * advance, width: advance })),
    width: [...text].length * advance,
    ascent: 100,
    descent: 30,
    capHeight: 70,
    xHeight: 50,
    stopWidth: 24,
  };
};

const measure = (text: string, font: FontFace): TextMetrics => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return estimate(text);
  }
  context.font = fontSpec(font, REFERENCE_SIZE);
  const chars = [...text];
  const glyphs = chars.map((char, index) => {
    const through = context.measureText(chars.slice(0, index + 1).join('')).width;
    const own = context.measureText(char).width;
    return { char, x: through - own, width: own };
  });
  const whole = context.measureText(text === '' ? 'H' : text);
  return {
    glyphs,
    width: text === '' ? 0 : whole.width,
    ascent: whole.fontBoundingBoxAscent,
    descent: whole.fontBoundingBoxDescent,
    capHeight: context.measureText('HIEN').actualBoundingBoxAscent,
    xHeight: context.measureText('xvzo').actualBoundingBoxAscent,
    stopWidth: context.measureText('.').width,
  };
};

export const useTextMetrics = (text: string, font: DotMorphFont): TextMetrics => {
  const selected = WORDMARK_FONTS[font];
  const ready = useFontReady(selected);
  return useMemo(() => (ready ? measure(text, selected) : estimate(text)), [ready, text, selected]);
};
