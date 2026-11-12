import { loadFont as loadBodoni } from '@remotion/google-fonts/BodoniModa';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const bodoni = loadBodoni('normal', { weights: ['500'], subsets: ['latin', 'latin-ext'] });
const manrope = loadManrope('normal', { weights: ['600'], subsets: ['latin', 'latin-ext'] });

export const HEADLINE_FACE: Face = {
  family: bodoni.fontFamily,
  weight: 500,
  waitUntilDone: bodoni.waitUntilDone,
};

export const CAPS_FACE: Face = {
  family: manrope.fontFamily,
  weight: 600,
  waitUntilDone: manrope.waitUntilDone,
};

const FACES = [HEADLINE_FACE, CAPS_FACE] as const;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

export type Measure = (text: string, face: Face, tracking?: number) => number;

let canvas: HTMLCanvasElement | null = null;

const widthOf = (text: string, face: Face, tracking: number, loaded: boolean): number => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = loaded && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.62 + tracking);
  }
  context.font = spec(face);
  return context.measureText(text).width / REFERENCE + tracking * letters;
};

export const useMeasure = (): Measure => {
  const [loaded, setLoaded] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the crumpled paper fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setLoaded(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      FACES.map((face) => face.waitUntilDone().then(() => document.fonts.load(spec(face)))),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [delayRender, continueRender]);
  useEffect(() => {
    if (loaded && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [loaded, handle, continueRender]);
  return useCallback(
    (text: string, face: Face, tracking = 0) => widthOf(text, face, tracking, loaded),
    [loaded],
  );
};
