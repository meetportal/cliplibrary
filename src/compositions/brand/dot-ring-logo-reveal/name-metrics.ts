import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { DotRingFont } from '@/schemas';

type FontFace = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): FontFace => ({ family: loaded.fontFamily, weight, waitUntilDone: loaded.waitUntilDone });

export const NAME_FONTS: Record<DotRingFont, FontFace> = {
  poppins: face(loadPoppins('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  outfit: face(loadOutfit('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  sora: face(loadSora('normal', { weights: ['600'], subsets: ['latin'] }), 600),
  'instrument-serif': face(
    loadInstrumentSerif('normal', { weights: ['400'], subsets: ['latin'] }),
    400,
  ),
};

type Glyph = { char: string; x: number; width: number };

export type NameMetrics = {
  glyphs: Glyph[];
  width: number;
  ascent: number;
  descent: number;
  capTop: number;
};

const REFERENCE_SIZE = 100;

const fontSpec = (font: FontFace, size: number) => `${font.weight} ${size}px "${font.family}"`;

const useFontReady = (font: FontFace): boolean => {
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const spec = fontSpec(font, REFERENCE_SIZE);
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font.family} name font`);
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

const estimate = (text: string, tracking: number): NameMetrics => {
  const advance = REFERENCE_SIZE * 0.6;
  const glyphs = [...text].map((char, index) => ({
    char,
    x: index * (advance + tracking),
    width: advance,
  }));
  const width = glyphs.length * advance + Math.max(0, glyphs.length - 1) * tracking;
  return { glyphs, width, ascent: 100, descent: 30, capTop: 72 };
};

const measure = (text: string, font: FontFace, tracking: number): NameMetrics => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return estimate(text, tracking);
  }
  context.font = fontSpec(font, REFERENCE_SIZE);
  const chars = [...text];
  const glyphs = chars.map((char, index) => {
    const through = context.measureText(chars.slice(0, index + 1).join('')).width;
    const own = context.measureText(char).width;
    return { char, x: through - own + tracking * index, width: own };
  });
  const whole = context.measureText(text);
  const caps = context.measureText('HIEW');
  return {
    glyphs,
    width: whole.width + tracking * Math.max(0, chars.length - 1),
    ascent: whole.fontBoundingBoxAscent,
    descent: whole.fontBoundingBoxDescent,
    capTop: caps.actualBoundingBoxAscent,
  };
};

export const useNameMetrics = (text: string, font: DotRingFont, tracking: number): NameMetrics => {
  const selected = NAME_FONTS[font];
  const ready = useFontReady(selected);
  return useMemo(
    () =>
      ready
        ? measure(text, selected, tracking * REFERENCE_SIZE)
        : estimate(text, tracking * REFERENCE_SIZE),
    [ready, text, selected, tracking],
  );
};

export const scaleMetrics = (metrics: NameMetrics, size: number): NameMetrics => {
  const k = size / REFERENCE_SIZE;
  return {
    glyphs: metrics.glyphs.map((glyph) => ({ ...glyph, x: glyph.x * k, width: glyph.width * k })),
    width: metrics.width * k,
    ascent: metrics.ascent * k,
    descent: metrics.descent * k,
    capTop: metrics.capTop * k,
  };
};
