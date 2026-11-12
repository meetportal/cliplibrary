import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import type { ColorPillsFont } from '@/schemas';

const WEIGHTS = { weights: ['700' as const], subsets: ['latin' as const] };

export const PILL_FONTS: Record<ColorPillsFont, string> = {
  quicksand: loadQuicksand('normal', WEIGHTS).fontFamily,
  nunito: loadNunito('normal', WEIGHTS).fontFamily,
  sora: loadSora('normal', { weights: ['600' as const], subsets: ['latin' as const] }).fontFamily,
  outfit: loadOutfit('normal', { weights: ['600' as const], subsets: ['latin' as const] })
    .fontFamily,
};

export const PILL_WEIGHTS: Record<ColorPillsFont, number> = {
  quicksand: 700,
  nunito: 700,
  sora: 600,
  outfit: 600,
};
