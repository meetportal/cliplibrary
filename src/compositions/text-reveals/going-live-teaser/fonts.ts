import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { TeaserFont } from '@/schemas';

export type Face = { family: string; weight: number };

export type FaceSet = { display: Face; label: Face; body: Face };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const options = () => ({
  weights: ['500' as const, '600' as const, '700' as const],
  subsets: ['latin' as const],
});

const LOADERS: Record<TeaserFont, () => Loaded> = {
  outfit: () => loadOutfit('normal', options()),
  sora: () => loadSora('normal', options()),
  lexend: () => loadLexend('normal', options()),
  poppins: () => loadPoppins('normal', options()),
};

const loaded = new Map<TeaserFont, Loaded>();

const load = (font: TeaserFont): Loaded => {
  const known = loaded.get(font);
  if (known !== undefined) {
    return known;
  }
  const fresh = LOADERS[font]();
  loaded.set(font, fresh);
  return fresh;
};

const facesFor = (font: TeaserFont): FaceSet => {
  const family = load(font).fontFamily;
  return {
    display: { family, weight: 700 },
    label: { family, weight: 600 },
    body: { family, weight: 500 },
  };
};

export const fontSpec = (face: Face, size: number) => `${face.weight} ${size}px "${face.family}"`;

export const useTeaserFonts = (font: TeaserFont): FaceSet | null => {
  const [ready, setReady] = useState<TeaserFont | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font} teaser fonts`);
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
          [faces.display, faces.label, faces.body].map((face) =>
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
