import { loadFont as loadAmatic } from '@remotion/google-fonts/AmaticSC';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadKaushan } from '@remotion/google-fonts/KaushanScript';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

export type GridFace = { family: string; weight: number; ready: () => Promise<unknown> };

const SUBSETS = ['latin' as const, 'latin-ext' as const];

const kaushan = loadKaushan('normal', { weights: ['400'], subsets: SUBSETS });
const amatic = loadAmatic('normal', { weights: ['700'], subsets: SUBSETS });
const anton = loadAnton('normal', { weights: ['400'], subsets: SUBSETS });
const bebas = loadBebas('normal', { weights: ['400'], subsets: SUBSETS });
const playfair = loadPlayfair('normal', { weights: ['600'], subsets: SUBSETS });

export const FACES = {
  script: { family: kaushan.fontFamily, weight: 400, ready: kaushan.waitUntilDone },
  hand: { family: amatic.fontFamily, weight: 700, ready: amatic.waitUntilDone },
  heavy: { family: anton.fontFamily, weight: 400, ready: anton.waitUntilDone },
  block: { family: bebas.fontFamily, weight: 400, ready: bebas.waitUntilDone },
  serif: { family: playfair.fontFamily, weight: 600, ready: playfair.waitUntilDone },
} satisfies Record<string, GridFace>;

export type FaceKey = keyof typeof FACES;

const spec = (face: GridFace, size: number) => `${face.weight} ${size}px "${face.family}"`;

export type Measure = (text: string, face: FaceKey, tracking: number) => number;

export const makeMeasure = (ready: boolean): Measure => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  return (text, face, tracking) => {
    const letters = [...text].length;
    if (context === null) {
      return letters * (0.55 + tracking);
    }
    context.font = spec(FACES[face], 100);
    return context.measureText(text).width / 100 + Math.max(0, letters - 1) * tracking;
  };
};

export const useGridFonts = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the chalk badge grid fonts');
    setHandle(pending);
    const faces = Object.values(FACES);
    const finish = () => {
      if (active) {
        setReady(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(faces.map((face) => face.ready()))
      .then(() => Promise.all(faces.map((face) => document.fonts.load(spec(face, 100)))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [delayRender, continueRender]);
  useEffect(() => {
    if (ready && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, handle, continueRender]);
  return ready;
};
