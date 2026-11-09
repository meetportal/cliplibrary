import { loadFont as loadAbril } from '@remotion/google-fonts/AbrilFatface';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadAntonio } from '@remotion/google-fonts/Antonio';
import { loadFont as loadArchivo } from '@remotion/google-fonts/Archivo';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadBigShoulders } from '@remotion/google-fonts/BigShoulders';
import { loadFont as loadBodoni } from '@remotion/google-fonts/BodoniModa';
import { loadFont as loadCaveatBrush } from '@remotion/google-fonts/CaveatBrush';
import { loadFont as loadDmSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadSixCaps } from '@remotion/google-fonts/SixCaps';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import type { FlipFlickerFont, FlipNameFont, FlipTitleFont, FlipWordFont } from '@/schemas';

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  waitUntilDone: loaded.waitUntilDone,
});

const latin = { subsets: ['latin' as const] };

const antonio = face(loadAntonio('normal', { weights: ['700'], ...latin }), 700);
const anton = face(loadAnton('normal', { weights: ['400'], ...latin }), 400);
const bebas = face(loadBebas('normal', { weights: ['400'], ...latin }), 400);
const bigShoulders = face(loadBigShoulders('normal', { weights: ['800'], ...latin }), 800);
const oswald = face(loadOswald('normal', { weights: ['600'], ...latin }), 600);
const dmSerif = face(loadDmSerif('normal', { weights: ['400'], ...latin }), 400);
const spaceGrotesk = face(loadSpaceGrotesk('normal', { weights: ['700'], ...latin }), 700);

export const WORD_FACES: Record<FlipWordFont, Face> = {
  antonio,
  anton,
  bebas,
  'big-shoulders': bigShoulders,
  oswald,
};

const FLICKER_FACES: Record<Exclude<FlipFlickerFont, 'main'>, Face> = {
  serif: face(loadPlayfair('normal', { weights: ['500'], ...latin }), 500),
  didone: face(loadBodoni('normal', { weights: ['400'], ...latin }), 400),
  marker: face(loadMarker('normal', { weights: ['400'], ...latin }), 400),
  brush: face(loadCaveatBrush('normal', { weights: ['400'], ...latin }), 400),
  hand: face(loadKalam('normal', { weights: ['700'], ...latin }), 700),
  thin: face(loadSixCaps('normal', { weights: ['400'], ...latin }), 400),
  light: face(loadOswald('normal', { weights: ['300'], ...latin }), 300),
  'fat-face': face(loadAbril('normal', { weights: ['400'], ...latin }), 400),
};

export const TITLE_FACES: Record<FlipTitleFont, Face> = {
  extended: face(loadArchivo('normal', { weights: ['800'], ...latin }), 800),
  grotesk: spaceGrotesk,
  serif: dmSerif,
  condensed: oswald,
};

export const NAME_FACES: Record<FlipNameFont, Face> = {
  rounded: face(loadPoppins('normal', { weights: ['600'], ...latin }), 600),
  grotesk: spaceGrotesk,
  serif: dmSerif,
  condensed: oswald,
};

export const flickerFace = (font: FlipFlickerFont, main: Face): Face =>
  font === 'main' ? main : FLICKER_FACES[font];
