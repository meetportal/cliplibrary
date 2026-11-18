import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import type { ColorPillsFont } from '@/schemas';

const BOLD = { weights: ['700' as const], subsets: ['latin' as const] };
const SEMIBOLD = { weights: ['600' as const], subsets: ['latin' as const] };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const LOADED: Record<ColorPillsFont, Loaded> = {
  quicksand: loadQuicksand('normal', BOLD),
  nunito: loadNunito('normal', BOLD),
  sora: loadSora('normal', SEMIBOLD),
  outfit: loadOutfit('normal', SEMIBOLD),
};

export const PILL_FONTS: Record<ColorPillsFont, string> = {
  quicksand: LOADED.quicksand.fontFamily,
  nunito: LOADED.nunito.fontFamily,
  sora: LOADED.sora.fontFamily,
  outfit: LOADED.outfit.fontFamily,
};

export const PILL_FONT_READY: Record<ColorPillsFont, () => Promise<unknown>> = {
  quicksand: LOADED.quicksand.waitUntilDone,
  nunito: LOADED.nunito.waitUntilDone,
  sora: LOADED.sora.waitUntilDone,
  outfit: LOADED.outfit.waitUntilDone,
};

export const PILL_WEIGHTS: Record<ColorPillsFont, number> = {
  quicksand: 700,
  nunito: 700,
  sora: 600,
  outfit: 600,
};
