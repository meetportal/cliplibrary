import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { WordPickerFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  tracking: number;
  waitUntilDone: () => Promise<unknown>;
};

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (
  loaded: Loaded,
  weight: number,
  tracking: number,
  style: 'normal' | 'italic' = 'normal',
): Face => ({
  family: loaded.fontFamily,
  weight,
  style,
  tracking,
  waitUntilDone: loaded.waitUntilDone,
});

const subsets = { subsets: ['latin' as const, 'latin-ext' as const] };

export const FACES: Record<WordPickerFont, Face> = {
  grotesk: face(loadInterTight('normal', { weights: ['600'], ...subsets }), 600, -0.015),
  geometric: face(loadManrope('normal', { weights: ['700'], ...subsets }), 700, -0.02),
  serif: face(loadFraunces('normal', { weights: ['500'], ...subsets }), 500, -0.01),
  'serif-italic': face(
    loadInstrumentSerif('italic', { weights: ['400'], ...subsets }),
    400,
    0,
    'italic',
  ),
};

const REFERENCE = 100;

const spec = (item: Face) => `${item.style} ${item.weight} ${REFERENCE}px "${item.family}"`;

let canvas: HTMLCanvasElement | null = null;

const context = () => {
  canvas ??= document.createElement('canvas');
  return canvas.getContext('2d');
};

const estimate = (text: string) => [...text].length * 0.56;

const measureWith = (text: string, item: Face): number => {
  const ctx = context();
  if (ctx === null) {
    return estimate(text);
  }
  ctx.font = spec(item);
  const letters = [...text].length;
  return ctx.measureText(text).width / REFERENCE + item.tracking * Math.max(0, letters - 1);
};

export type MeasureWidth = (text: string, item: Face) => number;

export const useMeasureWidth = (faces: readonly Face[]): MeasureWidth => {
  const key = [...new Set(faces.map(spec))].join('|');
  const latest = useRef(faces);
  latest.current = faces;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the word picker fonts');
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
