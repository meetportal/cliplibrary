import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';

const SUBSETS: { subsets: ('latin' | 'latin-ext')[] } = { subsets: ['latin', 'latin-ext'] };

const display = loadInterTight('normal', { weights: ['700', '800'], ...SUBSETS });
const body = loadInter('normal', { weights: ['500'], ...SUBSETS });

const FACES = {
  headline: `800 {size}px "${display.fontFamily}"`,
  name: `700 {size}px "${display.fontFamily}"`,
  tagline: `500 {size}px "${body.fontFamily}"`,
  paper: `800 {size}px "${display.fontFamily}"`,
} as const;

export type FaceKey = keyof typeof FACES;

export const font = (face: FaceKey, size: number): string =>
  FACES[face].replace('{size}', size.toFixed(2));

const usable = (value: string) => value.trim() !== '' && !value.includes('{{');

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const image = new Image();
    if (/^https?:/.test(src)) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image.naturalWidth > 0 ? image : null);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const loadFonts = () =>
  Promise.all([display.waitUntilDone(), body.waitUntilDone()]).then(() =>
    Promise.all([
      document.fonts.load(font('headline', 100)),
      document.fonts.load(font('name', 100)),
      document.fonts.load(font('tagline', 100)),
    ]),
  );

export type BoardAssets = { key: string; logo: HTMLImageElement | null };

export const useBoardAssets = (logoValue: string): BoardAssets | null => {
  const src = usable(logoValue) ? resolveCustom(logoValue) : '';
  const [assets, setAssets] = useState<BoardAssets | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the billboard fonts and logo ${src.slice(0, 60)}`);
    setHandle(pending);
    const finish = (logo: HTMLImageElement | null) => {
      if (active) {
        setAssets({ key: src, logo });
      } else {
        continueRender(pending);
      }
    };
    Promise.all([loadFonts().catch(() => null), src === '' ? null : loadImage(src)]).then(
      ([, logo]) => finish(logo),
      () => finish(null),
    );
    return () => {
      active = false;
    };
  }, [src, delayRender, continueRender]);
  const ready = assets !== null && assets.key === src;
  useEffect(() => {
    if (ready && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, handle, continueRender]);
  return ready ? assets : null;
};
