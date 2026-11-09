import { loadFont as loadComfortaa } from '@remotion/google-fonts/Comfortaa';
import { loadFont as loadDmMono } from '@remotion/google-fonts/DMMono';
import { loadFont as loadJosefinSans } from '@remotion/google-fonts/JosefinSans';
import { loadFont as loadMonoton } from '@remotion/google-fonts/Monoton';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadTiltNeon } from '@remotion/google-fonts/TiltNeon';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { NeonFont, NeonLabelFont } from '@/schemas';

export type Face = { family: string; weight: number; ready: () => Promise<unknown> };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): Face => ({ family: loaded.fontFamily, weight, ready: loaded.waitUntilDone });

const LATIN = { subsets: ['latin' as const] };

export const NEON_FACES: Record<NeonFont, Face> = {
  'tilt-neon': face(loadTiltNeon('normal', { weights: ['400'], ...LATIN }), 400),
  comfortaa: face(loadComfortaa('normal', { weights: ['500'], ...LATIN }), 500),
  quicksand: face(loadQuicksand('normal', { weights: ['500'], ...LATIN }), 500),
  monoton: face(loadMonoton('normal', { weights: ['400'], ...LATIN }), 400),
};

export const NEON_STROKE: Record<NeonFont, number> = {
  'tilt-neon': 1,
  comfortaa: 1,
  quicksand: 1,
  monoton: 0.4,
};

const outfit = loadOutfit('normal', { weights: ['500', '600'], ...LATIN });
const dmMono = loadDmMono('normal', { weights: ['400', '500'], ...LATIN });
const josefin = loadJosefinSans('normal', { weights: ['500', '600'], ...LATIN });

export type LabelFaces = { body: Face; name: Face };

export const LABEL_FACES: Record<NeonLabelFont, LabelFaces> = {
  outfit: { body: face(outfit, 500), name: face(outfit, 600) },
  'dm-mono': { body: face(dmMono, 400), name: face(dmMono, 500) },
  'josefin-sans': { body: face(josefin, 500), name: face(josefin, 600) },
};

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

const signFaces = (neon: NeonFont, label: NeonLabelFont): Face[] => [
  NEON_FACES[neon],
  LABEL_FACES[label].body,
  LABEL_FACES[label].name,
];

export const useSignFontsReady = (neon: NeonFont, label: NeonLabelFont): boolean => {
  const key = `${neon}|${label}`;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${key} neon sign fonts`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const faces = signFaces(neon, label);
    Promise.all(faces.map((font) => font.ready()))
      .then(() => Promise.all(faces.map((font) => document.fonts.load(fontSpec(font, 100)))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [neon, label, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};
