import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { usePageFonts } from '../elevator-newspaper/page-fonts';

const oswald = loadOswald('normal', { weights: ['500', '600'], subsets: ['latin'] });
const cormorant = loadCormorant('normal', { weights: ['300'], subsets: ['latin'] });

export const condensedFont = oswald.fontFamily;
export const wordmarkFont = cormorant.fontFamily;

let ready = false;
let loading: Promise<void> | undefined;

const loadCondensed = (): Promise<void> => {
  loading ??= oswald
    .waitUntilDone()
    .then(() =>
      Promise.all([
        document.fonts.load(`600 200px "${condensedFont}"`),
        document.fonts.load(`500 40px "${condensedFont}"`),
      ]),
    )
    .catch(() => undefined)
    .then(() => {
      ready = true;
    });
  return loading;
};

export const wordmarkFontReady = (): Promise<unknown> =>
  cormorant
    .waitUntilDone()
    .then(() => document.fonts.load(`300 100px "${wordmarkFont}"`))
    .catch(() => undefined);

export const useSpreadFonts = (): void => {
  usePageFonts();
  if (!ready) {
    throw loadCondensed();
  }
};
