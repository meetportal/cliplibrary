import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorantGaramond } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadGreatVibes } from '@remotion/google-fonts/GreatVibes';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadParisienne } from '@remotion/google-fonts/Parisienne';
import type { InviteScriptFont, InviteSerifFont } from '@/schemas';
import { pageFonts } from '../promo/fonts';

export const inviteScriptFonts: Record<InviteScriptFont, string> = {
  'great-vibes': loadGreatVibes('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
  parisienne: loadParisienne('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
  'pinyon-script': pageFonts.script,
};

export const inviteSerifFonts: Record<InviteSerifFont, string> = {
  cormorant: loadCormorantGaramond('normal', {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  }).fontFamily,
  cinzel: loadCinzel('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] })
    .fontFamily,
  marcellus: loadMarcellus('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
  playfair: pageFonts.serif,
};
