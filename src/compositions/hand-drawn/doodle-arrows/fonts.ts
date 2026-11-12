import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { useCallback, useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const caveat = loadCaveat('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] });
const interTight = loadInterTight('normal', { weights: ['600'], subsets: ['latin', 'latin-ext'] });

export const HAND_FACE: Face = {
  family: caveat.fontFamily,
  weight: 700,
  waitUntilDone: caveat.waitUntilDone,
};

export const NAME_FACE: Face = {
  family: interTight.fontFamily,
  weight: 600,
  waitUntilDone: interTight.waitUntilDone,
};

const FACES = [HAND_FACE, NAME_FACE] as const;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

export type Measure = (text: string, face: Face) => number;

let canvas: HTMLCanvasElement | null = null;

const widthOf = (text: string, face: Face, loaded: boolean): number => {
  canvas ??= typeof document === 'undefined' ? null : document.createElement('canvas');
  const context = loaded && canvas !== null ? canvas.getContext('2d') : null;
  if (context === null) {
    return [...text].length * 0.55;
  }
  context.font = spec(face);
  return context.measureText(text).width / REFERENCE;
};

export const useMeasure = (): Measure => {
  const [loaded, setLoaded] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the doodle arrows fonts');
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
  return useCallback((text: string, face: Face) => widthOf(text, face, loaded), [loaded]);
};
