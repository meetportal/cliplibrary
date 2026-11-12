import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { CirclePopFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  tracking: number;
  waitUntilDone: () => Promise<unknown>;
};

const SUBSETS: { subsets: ('latin' | 'latin-ext')[] } = { subsets: ['latin', 'latin-ext'] };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
  tracking: number,
): Face => ({
  family: loaded.fontFamily,
  weight,
  tracking,
  waitUntilDone: loaded.waitUntilDone,
});

export const NAME_FACES: Record<CirclePopFont, Face> = {
  grotesk: face(loadInterTight('normal', { weights: ['700'], ...SUBSETS }), 700, -0.035),
  geometric: face(loadPoppins('normal', { weights: ['700'], ...SUBSETS }), 700, -0.03),
  condensed: face(loadAnton('normal', { weights: ['400'], ...SUBSETS }), 400, 0),
};

export const LINE_FACE: Face = face(loadInter('normal', { weights: ['500'], ...SUBSETS }), 500, 0);

const REFERENCE = 100;

const spec = (item: Face) => `${item.weight} ${REFERENCE}px "${item.family}"`;

let canvas: HTMLCanvasElement | null = null;

export const measureWidth = (text: string, item: Face, ready: boolean): number => {
  if (text === '') {
    return 0;
  }
  const tracked = (width: number) => width + [...text].length * item.tracking;
  if (!ready || typeof document === 'undefined') {
    return tracked([...text].length * 0.58);
  }
  canvas ??= document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return tracked([...text].length * 0.58);
  }
  ctx.font = spec(item);
  return tracked(ctx.measureText(text).width / REFERENCE);
};

export const useFontsReady = (faces: readonly Face[]): boolean => {
  const key = [...new Set(faces.map(spec))].join('|');
  const [ready, setReady] = useState<string | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender('Loading the circle pop fonts'));
  const continued = useRef(false);
  const latest = useRef(faces);
  latest.current = faces;
  useEffect(() => {
    let active = true;
    const finish = () => {
      if (active) {
        setReady(key);
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
  }, [key]);
  useEffect(() => {
    if (ready !== null && !continued.current) {
      continued.current = true;
      continueRender(handle);
    }
  }, [ready, handle, continueRender]);
  return ready === key;
};
