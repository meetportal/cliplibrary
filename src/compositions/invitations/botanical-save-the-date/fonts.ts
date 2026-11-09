import { loadFont as loadBodoniModa } from '@remotion/google-fonts/BodoniModa';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadGreatVibes } from '@remotion/google-fonts/GreatVibes';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadParisienne } from '@remotion/google-fonts/Parisienne';
import { loadFont as loadPinyonScript } from '@remotion/google-fonts/PinyonScript';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type {
  BotanicalCapsFont,
  BotanicalDisplayFont,
  BotanicalSaveTheDateProps,
  BotanicalScriptFont,
} from '@/schemas';

export type Face = { family: string; weight: number };

const face = (loaded: { fontFamily: string }, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
});

const LATIN = { subsets: ['latin' as const] };

const bodoni = loadBodoniModa('normal', { weights: ['500', '800'], ...LATIN });
const playfair = loadPlayfair('normal', { weights: ['500', '800'], ...LATIN });
const cormorant = loadCormorant('normal', { weights: ['500', '600', '700'], ...LATIN });
const cinzel = loadCinzel('normal', { weights: ['400', '600'], ...LATIN });
const marcellus = loadMarcellus('normal', { weights: ['400'], ...LATIN });

type DisplayFaces = { name: Face; bold: Face };

const DISPLAY_FACES: Record<BotanicalDisplayFont, DisplayFaces> = {
  'bodoni-moda': { name: face(bodoni, 500), bold: face(bodoni, 800) },
  'playfair-display': { name: face(playfair, 500), bold: face(playfair, 800) },
  cormorant: { name: face(cormorant, 600), bold: face(cormorant, 700) },
};

type CapsFaces = { body: Face; strong: Face };

const CAPS_FACES: Record<BotanicalCapsFont, CapsFaces> = {
  cinzel: { body: face(cinzel, 400), strong: face(cinzel, 600) },
  marcellus: { body: face(marcellus, 400), strong: face(marcellus, 400) },
  cormorant: { body: face(cormorant, 500), strong: face(cormorant, 700) },
};

const SCRIPT_FACES: Record<BotanicalScriptFont, Face> = {
  'great-vibes': face(loadGreatVibes('normal', { weights: ['400'], ...LATIN }), 400),
  'pinyon-script': face(loadPinyonScript('normal', { weights: ['400'], ...LATIN }), 400),
  parisienne: face(loadParisienne('normal', { weights: ['400'], ...LATIN }), 400),
};

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

export type Faces = { display: DisplayFaces; caps: CapsFaces; script: Face };

export const facesOf = (lettering: BotanicalSaveTheDateProps['lettering']): Faces => ({
  display: DISPLAY_FACES[lettering.displayFont],
  caps: CAPS_FACES[lettering.capsFont],
  script: SCRIPT_FACES[lettering.scriptFont],
});

const everyFace = (faces: Faces): Face[] => [
  faces.display.name,
  faces.display.bold,
  faces.caps.body,
  faces.caps.strong,
  faces.script,
];

export const useFontsReady = (faces: Faces): boolean => {
  const list = everyFace(faces);
  const key = list.map((font) => `${font.family}:${font.weight}`).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the save the date fonts ${key}`);
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
      return { family, weight };
    });
    Promise.all(
      fonts.map((font) => document.fonts.load(`${font.weight} 100px "${font.family}"`)),
    ).then(finish, finish);
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
