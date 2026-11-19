import { loadFont } from '@remotion/google-fonts/PlayfairDisplay';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

const SUBSETS = ['latin' as const, 'latin-ext' as const];

const upright = loadFont('normal', { weights: ['700'], subsets: SUBSETS });
const italic = loadFont('italic', { weights: ['400'], subsets: SUBSETS });

const TITLE_FAMILY = upright.fontFamily;

export const nameFont = (size: number) => `normal 700 ${size}px "${TITLE_FAMILY}"`;

export const taglineFont = (size: number) => `italic 400 ${size}px "${TITLE_FAMILY}"`;

export const useTitleFonts = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the film dust title fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(true);
      } else {
        continueRender(pending);
      }
    };
    Promise.all([upright.waitUntilDone(), italic.waitUntilDone()])
      .then(() =>
        Promise.all([document.fonts.load(nameFont(100)), document.fonts.load(taglineFont(100))]),
      )
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [delayRender, continueRender]);
  useEffect(() => {
    if (ready && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, handle, continueRender]);
  return ready;
};
