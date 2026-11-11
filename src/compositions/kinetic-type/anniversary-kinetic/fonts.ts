import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadKrona } from '@remotion/google-fonts/KronaOne';
import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import type { AnniversaryValueFont, AnniversaryWordFont } from '@/schemas';

export type Face = { family: string; weight: number; waitUntilDone: () => Promise<unknown> };

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number): Face => ({
  family: loaded.fontFamily,
  weight,
  waitUntilDone: loaded.waitUntilDone,
});

const latin = { subsets: ['latin' as const, 'latin-ext' as const] };

const grotesk = face(loadSpaceGrotesk('normal', { weights: ['700'], ...latin }), 700);

export const BODY_FACE = face(loadSpaceGrotesk('normal', { weights: ['500'], ...latin }), 500);

export const MONO_FACE = face(loadSpaceMono('normal', { weights: ['700'], ...latin }), 700);

export const WIDE_FACE = face(loadKrona('normal', { weights: ['400'], ...latin }), 400);

export const NAME_FACE = grotesk;

export const WORD_FACES: Record<AnniversaryWordFont, Face> = {
  grotesk,
  geometric: face(loadLexend('normal', { weights: ['700'], ...latin }), 700),
  editorial: face(loadBricolage('normal', { weights: ['700'], ...latin }), 700),
};

export const VALUE_FACES: Record<AnniversaryValueFont, Face> = {
  mono: MONO_FACE,
  grotesk,
  wide: face(loadUnbounded('normal', { weights: ['700'], ...latin }), 700),
};
