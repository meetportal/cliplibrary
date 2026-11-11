import { loadFont as loadAllura } from '@remotion/google-fonts/Allura';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadGreatVibes } from '@remotion/google-fonts/GreatVibes';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadParisienne } from '@remotion/google-fonts/Parisienne';
import { loadFont as loadPinyon } from '@remotion/google-fonts/PinyonScript';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { ArchCapsFont, ArchSaveTheDateProps, ArchScriptFont } from '@/schemas';

export type Face = { family: string; weight: number };

const LATIN = { subsets: ['latin' as const] };

const face = (loaded: { fontFamily: string }, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
});

const SCRIPT_FACES: Record<ArchScriptFont, Face> = {
  'great-vibes': face(loadGreatVibes('normal', { weights: ['400'], ...LATIN }), 400),
  'pinyon-script': face(loadPinyon('normal', { weights: ['400'], ...LATIN }), 400),
  parisienne: face(loadParisienne('normal', { weights: ['400'], ...LATIN }), 400),
  allura: face(loadAllura('normal', { weights: ['400'], ...LATIN }), 400),
};

const CAPS_FACES: Record<ArchCapsFont, Face> = {
  marcellus: face(loadMarcellus('normal', { weights: ['400'], ...LATIN }), 400),
  cinzel: face(loadCinzel('normal', { weights: ['500'], ...LATIN }), 500),
  'cormorant-garamond': face(loadCormorant('normal', { weights: ['600'], ...LATIN }), 600),
};

export type Faces = { script: Face; caps: Face };

export const facesOf = (lettering: ArchSaveTheDateProps['lettering']): Faces => ({
  script: SCRIPT_FACES[lettering.scriptFont],
  caps: CAPS_FACES[lettering.capsFont],
});

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

export const useFontsReady = (faces: Faces): boolean => {
  const key = [faces.script, faces.caps].map((font) => `${font.family}:${font.weight}`).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the palace arch fonts ${key}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const fonts = key.split('|').map((entry) => {
      const [family = '', weight = '400'] = entry.split(':');
      return `${weight} 100px "${family}"`;
    });
    Promise.all(fonts.map((spec) => document.fonts.load(spec))).then(finish, finish);
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
  return ready === key;
};

export type Measurer = (text: string, font: Face, size: number, tracking: number) => number;

const REFERENCE = 100;

export const canvasMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  const cache = new Map<string, number>();
  return (text, font, size, tracking) => {
    const key = `${fontSpec(font, REFERENCE)}|${text}`;
    let width = cache.get(key);
    if (width === undefined) {
      width = text.length * REFERENCE * 0.6;
      if (context !== null) {
        context.font = fontSpec(font, REFERENCE);
        width = context.measureText(text).width;
      }
      cache.set(key, width);
    }
    return (width + tracking * REFERENCE * Array.from(text).length) * (size / REFERENCE);
  };
};

export const fitSize = (
  measure: Measurer,
  text: string,
  font: Face,
  maxSize: number,
  tracking: number,
  maxWidth: number,
): number => {
  const width = measure(text, font, REFERENCE, tracking);
  return width <= 0 ? maxSize : Math.min(maxSize, (maxWidth / width) * REFERENCE);
};

export const balancedSplit = (text: string): string[] => {
  const list = text.split(' ').filter((word) => word !== '');
  if (list.length < 2) {
    return [text.trim()];
  }
  let best = { score: Number.POSITIVE_INFINITY, lines: [text.trim()] };
  for (let at = 1; at < list.length; at++) {
    const first = list.slice(0, at).join(' ');
    const second = list.slice(at).join(' ');
    const score = Math.abs(first.length - second.length) - (/,$/.test(first) ? 14 : 0);
    if (score < best.score) {
      best = { score, lines: [first, second] };
    }
  }
  return best.lines;
};
