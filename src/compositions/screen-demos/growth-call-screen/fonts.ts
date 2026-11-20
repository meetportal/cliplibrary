import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadRaleway } from '@remotion/google-fonts/Raleway';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { GrowthCallFont } from '@/schemas';

export type Face = { family: string; weight: number; tracking: number };

export type FaceSet = { display: Face; line: Face; label: Face };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const options = () => ({
  weights: ['500' as const, '600' as const, '700' as const],
  subsets: ['latin' as const, 'latin-ext' as const],
});

const LOADERS: Record<GrowthCallFont, () => Loaded> = {
  raleway: () => loadRaleway('normal', options()),
  poppins: () => loadPoppins('normal', options()),
  montserrat: () => loadMontserrat('normal', options()),
  inter: () => loadInter('normal', options()),
};

const TRACKING: Record<GrowthCallFont, number> = {
  raleway: -0.01,
  poppins: -0.02,
  montserrat: -0.02,
  inter: -0.025,
};

const loaded = new Map<GrowthCallFont, Loaded>();

const load = (font: GrowthCallFont): Loaded => {
  const known = loaded.get(font);
  if (known !== undefined) {
    return known;
  }
  const fresh = LOADERS[font]();
  loaded.set(font, fresh);
  return fresh;
};

const facesFor = (font: GrowthCallFont): FaceSet => {
  const family = load(font).fontFamily;
  const tracking = TRACKING[font];
  return {
    display: { family, weight: 700, tracking },
    line: { family, weight: 600, tracking },
    label: { family, weight: 500, tracking: 0 },
  };
};

export const fontSpec = (face: Face, size: number) => `${face.weight} ${size}px "${face.family}"`;

export const useCallFonts = (font: GrowthCallFont): FaceSet | null => {
  const [ready, setReady] = useState<GrowthCallFont | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font} call screen fonts`);
    setHandle(pending);
    const faces = facesFor(font);
    const finish = () => {
      if (active) {
        setReady(font);
      } else {
        continueRender(pending);
      }
    };
    load(font)
      .waitUntilDone()
      .then(() =>
        Promise.all(
          [faces.display, faces.line, faces.label].map((face) =>
            document.fonts.load(fontSpec(face, 100)),
          ),
        ),
      )
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, delayRender, continueRender]);
  useEffect(() => {
    if (ready === font && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, font, handle, continueRender]);
  return ready === font ? facesFor(font) : null;
};
