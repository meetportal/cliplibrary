import { loadFont as loadAbril } from '@remotion/google-fonts/AbrilFatface';
import { loadFont as loadDamion } from '@remotion/google-fonts/Damion';
import { loadFont as loadDmSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadKaushan } from '@remotion/google-fonts/KaushanScript';
import { loadFont as loadLobster } from '@remotion/google-fonts/Lobster';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadPacifico } from '@remotion/google-fonts/Pacifico';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadYellowtail } from '@remotion/google-fonts/Yellowtail';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { ChalkTitleAmpersand, ChalkTitleScript } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  ready: () => Promise<unknown>;
};

const SUBSETS = ['latin' as const, 'latin-ext' as const];

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
  style: 'normal' | 'italic' = 'normal',
): Face => ({ family: loaded.fontFamily, weight, style, ready: loaded.waitUntilDone });

const regular = { weights: ['400' as const], subsets: SUBSETS };

export const SCRIPT_FACES: Record<ChalkTitleScript, Face> = {
  kaushan: face(loadKaushan('normal', regular), 400),
  yellowtail: face(loadYellowtail('normal', regular), 400),
  pacifico: face(loadPacifico('normal', regular), 400),
  damion: face(loadDamion('normal', regular), 400),
};

export const AMPERSAND_FACES: Record<ChalkTitleAmpersand, Face> = {
  playfair: face(
    loadPlayfair('italic', { weights: ['900'], subsets: ['latin', 'latin-ext'] }),
    900,
    'italic',
  ),
  abril: face(loadAbril('normal', regular), 400),
  'dm-serif': face(loadDmSerif('italic', regular), 400, 'italic'),
  lobster: face(loadLobster('normal', regular), 400),
};

export const BYLINE_FACE: Face = face(
  loadOswald('normal', { weights: ['500'], subsets: ['latin', 'latin-ext'] }),
  500,
);

const fontSpec = (font: Face, size: number) =>
  `${font.style} ${font.weight} ${size}px "${font.family}"`;

const REFERENCE = 200;

type Ink = { left: number; right: number; ascent: number; descent: number; advance: number };

export type Measurer = (text: string, font: Face) => Ink;

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  return (text, font) => {
    if (context === null) {
      const advance = [...text].length * 0.5;
      return { left: 0, right: advance, ascent: 0.7, descent: 0.2, advance };
    }
    context.font = fontSpec(font, REFERENCE);
    const metrics = context.measureText(text);
    return {
      left: -metrics.actualBoundingBoxLeft / REFERENCE,
      right: metrics.actualBoundingBoxRight / REFERENCE,
      ascent: metrics.actualBoundingBoxAscent / REFERENCE,
      descent: metrics.actualBoundingBoxDescent / REFERENCE,
      advance: metrics.width / REFERENCE,
    };
  };
};

export const useFontsReady = (script: ChalkTitleScript, ampersand: ChalkTitleAmpersand) => {
  const key = `${script}/${ampersand}`;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${key} chalk title fonts`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const faces = [SCRIPT_FACES[script], AMPERSAND_FACES[ampersand], BYLINE_FACE];
    Promise.all(faces.map((font) => font.ready()))
      .then(() => Promise.all(faces.map((font) => document.fonts.load(fontSpec(font, 100), '&'))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [key, script, ampersand, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};
