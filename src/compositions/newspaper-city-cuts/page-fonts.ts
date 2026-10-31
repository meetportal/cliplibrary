import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadFraktur } from '@remotion/google-fonts/UnifrakturMaguntia';

const fraktur = loadFraktur('normal', { weights: ['400'], subsets: ['latin'] });
const upright = loadPlayfair('normal', {
  weights: ['400', '600', '700', '800'],
  subsets: ['latin'],
});
const italic = loadPlayfair('italic', { weights: ['500', '600'], subsets: ['latin'] });

export const mastheadFont = fraktur.fontFamily;
export const pageFont = upright.fontFamily;

let ready = false;
let loading: Promise<void> | undefined;

const loadPageFonts = (): Promise<void> => {
  loading ??= Promise.all([
    fraktur.waitUntilDone(),
    upright.waitUntilDone(),
    italic.waitUntilDone(),
  ])
    .then(() =>
      Promise.all([
        document.fonts.load(`400 120px "${mastheadFont}"`),
        document.fonts.load(`800 80px "${pageFont}"`),
        document.fonts.load(`700 40px "${pageFont}"`),
        document.fonts.load(`600 30px "${pageFont}"`),
        document.fonts.load(`400 30px "${pageFont}"`),
        document.fonts.load(`italic 500 30px "${pageFont}"`),
        document.fonts.load(`italic 600 30px "${pageFont}"`),
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
