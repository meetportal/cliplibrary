import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadRounded } from '@remotion/google-fonts/MPLUSRounded1c';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { DominoWordFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  waitUntilDone: () => Promise<unknown>;
};

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): Face => ({ family: loaded.fontFamily, weight, waitUntilDone: loaded.waitUntilDone });

const SUBSETS: { subsets: ('latin' | 'latin-ext')[] } = { subsets: ['latin', 'latin-ext'] };

export const WORD_FACES: Record<DominoWordFont, Face> = {
  geometric: face(loadPoppins('normal', { weights: ['800'], ...SUBSETS }), 800),
  condensed: face(loadAnton('normal', { weights: ['400'], ...SUBSETS }), 400),
  rounded: face(loadRounded('normal', { weights: ['800'], ...SUBSETS }), 800),
};

export const BRAND_FACE: Face = face(
  loadMontserrat('normal', { weights: ['700'], ...SUBSETS }),
  700,
);

export type TextBox = { width: number; ascent: number; descent: number; cap: number };

export type Measure = (text: string, face: Face) => TextBox;

const REFERENCE = 100;

const spec = (item: Face) => `${item.weight} ${REFERENCE}px "${item.family}"`;

const estimate = (text: string): TextBox => ({
  width: [...text].length * 0.62,
  ascent: 0.95,
  descent: 0.25,
  cap: 0.7,
});

let canvas: HTMLCanvasElement | null = null;

const context = () => {
  canvas ??= document.createElement('canvas');
  return canvas.getContext('2d');
};

const measureWith = (text: string, item: Face): TextBox => {
  const ctx = context();
  if (ctx === null) {
    return estimate(text);
  }
  ctx.font = spec(item);
  const whole = ctx.measureText(text === '' ? 'H' : text);
  return {
    width: text === '' ? 0 : whole.width / REFERENCE,
    ascent: whole.fontBoundingBoxAscent / REFERENCE,
    descent: whole.fontBoundingBoxDescent / REFERENCE,
    cap: ctx.measureText('HIEN').actualBoundingBoxAscent / REFERENCE,
  };
};

export const useMeasure = (faces: readonly Face[]): Measure => {
  const key = [...new Set(faces.map(spec))].join('|');
  const latest = useRef(faces);
  latest.current = faces;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the domino word fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      latest.current.map((item) =>
        item.waitUntilDone().then(() => document.fonts.load(spec(item))),
      ),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  const loaded = ready === key;
  return useCallback(
    (text: string, item: Face) => (loaded ? measureWith(text, item) : estimate(text)),
    [loaded],
  );
};

export const capTop = (box: TextBox, size: number): number =>
  (size * (1 + box.ascent - box.descent)) / 2 - box.cap * size;
