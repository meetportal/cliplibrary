import { loadFont as loadAllura } from '@remotion/google-fonts/Allura';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadGreatVibes } from '@remotion/google-fonts/GreatVibes';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadParisienne } from '@remotion/google-fonts/Parisienne';
import { loadFont as loadPinyon } from '@remotion/google-fonts/PinyonScript';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { InviteScriptFont, InviteSerifFont } from '@/schemas';

export type Face = { family: string; weight: number; ready: () => Promise<unknown> };

const face = (
  loaded: { fontFamily: string; waitUntilDone: () => Promise<unknown> },
  weight: number,
): Face => ({ family: loaded.fontFamily, weight, ready: loaded.waitUntilDone });

const LATIN = { subsets: ['latin' as const] };

export const SCRIPT_FACES: Record<InviteScriptFont, Face> = {
  'great-vibes': face(loadGreatVibes('normal', { weights: ['400'], ...LATIN }), 400),
  'pinyon-script': face(loadPinyon('normal', { weights: ['400'], ...LATIN }), 400),
  parisienne: face(loadParisienne('normal', { weights: ['400'], ...LATIN }), 400),
  allura: face(loadAllura('normal', { weights: ['400'], ...LATIN }), 400),
};

export type SerifFaces = { body: Face; strong: Face };

const cinzel = loadCinzel('normal', { weights: ['400', '600'], ...LATIN });
const cormorant = loadCormorant('normal', { weights: ['500', '600'], ...LATIN });
const marcellus = loadMarcellus('normal', { weights: ['400'], ...LATIN });
const playfair = loadPlayfair('normal', { weights: ['400', '600'], ...LATIN });

export const SERIF_FACES: Record<InviteSerifFont, SerifFaces> = {
  cinzel: { body: face(cinzel, 400), strong: face(cinzel, 600) },
  'cormorant-garamond': { body: face(cormorant, 500), strong: face(cormorant, 600) },
  marcellus: { body: face(marcellus, 400), strong: face(marcellus, 400) },
  'playfair-display': { body: face(playfair, 400), strong: face(playfair, 600) },
};

export const fontSpec = (font: Face, size: number) => `${font.weight} ${size}px "${font.family}"`;

export const useInviteFontsReady = (script: InviteScriptFont, serif: InviteSerifFont): boolean => {
  const key = `${script}|${serif}`;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${key} invitation fonts`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    const faces = [SCRIPT_FACES[script], SERIF_FACES[serif].body, SERIF_FACES[serif].strong];
    Promise.all(faces.map((font) => font.ready()))
      .then(() => Promise.all(faces.map((font) => document.fonts.load(fontSpec(font, 100)))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [script, serif, key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  return ready === key;
};
