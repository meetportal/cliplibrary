import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import type { ChevronNameFont } from '@/schemas';

const sans = loadInterTight('normal', { weights: ['600'], subsets: ['latin'] });
const serif = loadInstrumentSerif('normal', { weights: ['400'], subsets: ['latin'] });

export const NAME_FONTS: Record<
  ChevronNameFont,
  { fontFamily: string; fontWeight: number; letterSpacing: string }
> = {
  sans: { fontFamily: sans.fontFamily, fontWeight: 600, letterSpacing: '-0.035em' },
  serif: { fontFamily: serif.fontFamily, fontWeight: 400, letterSpacing: '-0.01em' },
};
