import { loadFont as loadDmSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { FloatingCardsFont } from '@/schemas';

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const WEIGHTS = { weights: ['500' as const, '700' as const], subsets: ['latin' as const] };

const LOADED: Record<FloatingCardsFont, Loaded> = {
  jakarta: loadJakarta('normal', WEIGHTS),
  manrope: loadManrope('normal', WEIGHTS),
  inter: loadInter('normal', WEIGHTS),
  'dm-sans': loadDmSans('normal', WEIGHTS),
};

export const LABEL_WEIGHT = 500;
export const VALUE_WEIGHT = 700;

export const fontFamilyOf = (font: FloatingCardsFont): string => LOADED[font].fontFamily;

const specs = (family: string) =>
  [LABEL_WEIGHT, VALUE_WEIGHT].map((weight) => `${weight} 40px "${family}"`);

export const useFontReady = (font: FloatingCardsFont): boolean => {
  const family = fontFamilyOf(font);
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${family} card font`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(family);
      } else {
        continueRender(pending);
      }
    };
    LOADED[font]
      .waitUntilDone()
      .then(() => Promise.all(specs(family).map((spec) => document.fonts.load(spec))))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [font, family, delayRender, continueRender]);
  useEffect(() => {
    if (ready === family && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, family, handle, continueRender]);
  return ready === family;
};
