import { loadFont as loadAmatic } from '@remotion/google-fonts/AmaticSC';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadKaushan } from '@remotion/google-fonts/KaushanScript';
import { loadFont as loadLuckiest } from '@remotion/google-fonts/LuckiestGuy';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

type ReelFace = { family: string; weight: number; ready: () => Promise<unknown> };

const SUBSETS = ['latin' as const, 'latin-ext' as const];

const kaushan = loadKaushan('normal', { weights: ['400'], subsets: SUBSETS });
const amatic = loadAmatic('normal', { weights: ['700'], subsets: SUBSETS });
const anton = loadAnton('normal', { weights: ['400'], subsets: SUBSETS });
const playfair = loadPlayfair('normal', { weights: ['600'], subsets: SUBSETS });
const luckiest = loadLuckiest('normal', { weights: ['400'], subsets: SUBSETS });

export const REEL_FACES = {
  script: { family: kaushan.fontFamily, weight: 400, ready: kaushan.waitUntilDone },
  hand: { family: amatic.fontFamily, weight: 700, ready: amatic.waitUntilDone },
  heavy: { family: anton.fontFamily, weight: 400, ready: anton.waitUntilDone },
  serif: { family: playfair.fontFamily, weight: 600, ready: playfair.waitUntilDone },
  chunky: { family: luckiest.fontFamily, weight: 400, ready: luckiest.waitUntilDone },
} satisfies Record<string, ReelFace>;

export type ReelFaceKey = keyof typeof REEL_FACES;

const fontSpec = (face: ReelFace, size: number) => `${face.weight} ${size}px "${face.family}"`;

export type Measure = (text: string, face: ReelFaceKey, tracking?: number) => number;

export const makeMeasure = (ready: boolean): Measure => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  return (text, face, tracking = 0) => {
    const letters = [...text].length;
    const spacing = Math.max(0, letters - 1) * tracking;
    if (context === null) {
      return letters * 0.55 + spacing;
    }
    context.font = fontSpec(REEL_FACES[face], 100);
    return context.measureText(text).width / 100 + spacing;
  };
};

export const useReelFonts = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the chalk badges reel fonts');
    setHandle(pending);
    const faces = Object.values(REEL_FACES);
    const finish = () => {
      if (active) {
        setReady(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(faces.map((face) => face.ready()))
      .then(() => Promise.all(faces.map((face) => document.fonts.load(fontSpec(face, 100)))))
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
