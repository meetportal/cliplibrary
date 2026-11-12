import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const serif = loadSerif('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] });
const caveat = loadCaveat('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] });
const manrope = loadManrope('normal', { weights: ['800'], subsets: ['latin', 'latin-ext'] });

export const HEADLINE_FACE: Face = {
  family: serif.fontFamily,
  weight: 400,
  waitUntilDone: serif.waitUntilDone,
};
export const SCRIPT_FACE: Face = {
  family: caveat.fontFamily,
  weight: 700,
  waitUntilDone: caveat.waitUntilDone,
};
export const NAME_FACE: Face = {
  family: manrope.fontFamily,
  weight: 800,
  waitUntilDone: manrope.waitUntilDone,
};

const FACES = [HEADLINE_FACE, SCRIPT_FACE, NAME_FACE] as const;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

export type Measure = (text: string, face: Face, tracking?: number) => number;

let canvas: HTMLCanvasElement | null = null;

const widthOf = (text: string, face: Face, tracking: number, loaded: boolean): number => {
  const letters = [...text].length;
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = loaded && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return letters * (0.6 + tracking);
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
    const pending = delayRender('Loading the burning paper fonts');
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
