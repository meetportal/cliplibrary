import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { PendulumFont } from '@/schemas';

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

export const WEIGHTS = { light: 300, regular: 400, semibold: 600, bold: 700 } as const;

const options = () => ({
  weights: ['300' as const, '400' as const, '600' as const, '700' as const],
  subsets: ['latin' as const],
});

const LOADERS: Record<PendulumFont, () => Loaded> = {
  outfit: () => loadOutfit('normal', options()),
  poppins: () => loadPoppins('normal', options()),
  sora: () => loadSora('normal', options()),
  lexend: () => loadLexend('normal', options()),
};

const loaded = new Map<PendulumFont, Loaded>();

const load = (font: PendulumFont): Loaded => {
  const known = loaded.get(font);
  if (known !== undefined) {
    return known;
  }
  const fresh = LOADERS[font]();
  loaded.set(font, fresh);
  return fresh;
};

export const fontSpec = (family: string, weight: number, size: number) =>
  `${weight} ${size}px "${family}"`;

export const usePendulumFont = (font: PendulumFont): string | null => {
  const [ready, setReady] = useState<PendulumFont | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${font} pendulum font`);
    setHandle(pending);
    const family = load(font).fontFamily;
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
          Object.values(WEIGHTS).map((weight) =>
            document.fonts.load(fontSpec(family, weight, 100)),
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
  return ready === font ? load(font).fontFamily : null;
};
