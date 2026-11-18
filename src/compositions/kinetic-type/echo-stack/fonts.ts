import { loadFont as loadFigtree } from '@remotion/google-fonts/Figtree';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { EchoStackFont } from '@/schemas';

export type Face = { family: string; weight: number; ready: () => Promise<unknown> };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  ready: loaded.waitUntilDone,
});

const LATIN = { subsets: ['latin' as const, 'latin-ext' as const] };

export const LINE_FACES: Record<EchoStackFont, Face> = {
  figtree: face(loadFigtree('normal', { weights: ['700'], ...LATIN }), 700),
  montserrat: face(loadMontserrat('normal', { weights: ['700'], ...LATIN }), 700),
  'inter-tight': face(loadInterTight('normal', { weights: ['800'], ...LATIN }), 800),
};

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

export type LineMetrics = { width: number; ascent: number; descent: number };

const REFERENCE = 100;

const estimate = (text: string, tracking: number): LineMetrics => ({
  width: [...text].length * (0.62 + tracking),
  ascent: 0.7,
  descent: 0,
});

let scratch: HTMLCanvasElement | null = null;

const measure = (text: string, font: Face, tracking: number): LineMetrics => {
  scratch ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = scratch?.getContext('2d') ?? null;
  if (context === null || text === '') {
    return estimate(text, tracking);
  }
  context.font = fontSpec(font, REFERENCE);
  context.letterSpacing = '0px';
  const metrics = context.measureText(text);
  const letters = [...text].length;
  return {
    width: metrics.width / REFERENCE + tracking * Math.max(0, letters - 1),
    ascent: metrics.actualBoundingBoxAscent / REFERENCE,
    descent: metrics.actualBoundingBoxDescent / REFERENCE,
  };
};

export const useLineMetrics = (text: string, font: Face, tracking: number): LineMetrics => {
  const key = fontSpec(font, REFERENCE);
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the echo stack font');
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
  }, [key, font, delayRender, continueRender]);
  const loaded = ready === key;
  useEffect(() => {
    if (loaded && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, handle, continueRender]);
  return useMemo(
    () => (loaded ? measure(text, font, tracking) : estimate(text, tracking)),
    [loaded, text, font, tracking],
  );
};
