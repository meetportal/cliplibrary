import { loadFont as loadBodoniModa } from '@remotion/google-fonts/BodoniModa';
import { bodyFont, bodyFontReady } from '../promo/fonts';

const bodoni = loadBodoniModa('normal', { weights: ['500', '700', '900'], subsets: ['latin'] });

export const serifFont = bodoni.fontFamily;

export const sansFont = bodyFont;

let ready = false;
let loading: Promise<void> | undefined;

const loadPageFonts = (): Promise<void> => {
  loading ??= Promise.all([bodoni.waitUntilDone(), bodyFontReady()])
    .then(() =>
      Promise.all([
        document.fonts.load(`900 200px "${serifFont}"`),
        document.fonts.load(`700 80px "${serifFont}"`),
        document.fonts.load(`500 40px "${serifFont}"`),
        document.fonts.load(`500 40px "${sansFont}"`),
        document.fonts.load(`700 40px "${sansFont}"`),
      ]),
    )
    .catch(() => undefined)
    .then(() => {
      ready = true;
    });
  return loading;
};

export const usePageFonts = (): void => {
  if (!ready) {
    throw loadPageFonts();
  }
};
