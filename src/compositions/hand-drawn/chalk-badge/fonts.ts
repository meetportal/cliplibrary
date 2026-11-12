import { loadFont as loadDamion } from '@remotion/google-fonts/Damion';
import { loadFont as loadKaushan } from '@remotion/google-fonts/KaushanScript';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadPacifico } from '@remotion/google-fonts/Pacifico';
import { loadFont as loadYellowtail } from '@remotion/google-fonts/Yellowtail';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { ChalkScript } from '@/schemas';

export type Face = { family: string; weight: number; ready: () => Promise<unknown> };

const LATIN = { weights: ['400' as const], subsets: ['latin' as const, 'latin-ext' as const] };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): Face => ({ family: loaded.fontFamily, weight, ready: loaded.waitUntilDone });

export const SCRIPT_FACES: Record<ChalkScript, Face> = {
  kaushan: face(loadKaushan('normal', LATIN), 400),
  yellowtail: face(loadYellowtail('normal', LATIN), 400),
  pacifico: face(loadPacifico('normal', LATIN), 400),
  damion: face(loadDamion('normal', LATIN), 400),
};

export const CAPTION_FACE: Face = face(
  loadOswald('normal', { weights: ['600'], subsets: ['latin', 'latin-ext'] }),
  600,
);

const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

const REFERENCE = 100;

export type Measurer = (text: string, font: Face) => number;

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  return (text, font) => {
    if (context === null) {
      return [...text].length * 0.55;
    }
    context.font = fontSpec(font, REFERENCE);
    return context.measureText(text).width / REFERENCE;
  };
};

export const useFontsReady = (script: ChalkScript): boolean => {
  const [ready, setReady] = useState<ChalkScript | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${script} chalk badge fonts`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(script);
      } else {
        continueRender(pending);
      }
    };
    const faces = [SCRIPT_FACES[script], CAPTION_FACE];
    Promise.all(faces.map((font) => font.ready()))
      .then(() => Promise.all(faces.map((font) => document.fonts.load(fontSpec(font, 100)))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [script, delayRender, continueRender]);
  useEffect(() => {
    if (ready === script && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, script, handle, continueRender]);
  return ready === script;
};
