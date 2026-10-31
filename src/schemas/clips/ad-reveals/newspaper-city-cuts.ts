import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

const size = () => zSlider({ min: 0.5, max: 1.5, step: 0.01 });

const delay = () => zSlider({ min: 0, max: 60 });

export const newspaperCityCutsSchema = z.object({
  masthead: z.object({
    title: z.string(),
    dateline: z.string(),
  }),
  cover: z.object({
    strip: z.string(),
    photo: zImage(),
    photoFocus: unit(),
    photoZoom: zSlider({ min: 1, max: 2, step: 0.01 }),
  }),
  story: z.object({
    headline: zMultiline(),
    headlineSize: size(),
    body: zMultiline(),
    photo: zImage(),
    booth: z.string(),
    dates: z.string(),
    band: z.string(),
  }),
  ink: z.object({
    text: zColor(),
    accent: zColor(),
    band: zColor(),
    bandText: zColor(),
    paper: zColor(),
  }),
  print: z.object({
    strength: unit(),
    shading: unit(),
    softness: unit(2, 0.05),
    paperTint: unit(),
  }),
  endCard: z.object({
    brand: z.string(),
    tagline: z.string(),
    showMark: z.boolean(),
    cutFrame: zSlider({ min: 1, max: 100 }),
    wordmarkDelay: delay(),
    taglineDelay: delay(),
    markSize: size(),
    wordmarkSize: size(),
    taglineSize: size(),
    background: zColor(),
    wordmarkColor: zColor(),
    taglineColor: zColor(),
    markColor: zColor(),
  }),
  motion: motionSchema,
});

export type NewspaperCityCutsProps = z.infer<typeof newspaperCityCutsSchema>;

const BODY =
  'Three collections arrive together this season: Lumen, Tide and Verse, finished by hand in warm gold with soft pearls and fine diamonds. ' +
  'Visit us on the show floor for a first look, private fittings and a small gift for every guest.';

export const newspaperCityCutsDefaults: NewspaperCityCutsProps = {
  masthead: {
    title: 'The Jewelry Times',
    dateline: 'SPRING EDITION',
  },
  cover: {
    strip: 'See you at the Spring Show',
    photo: 'footage/newspaper-city-cuts/cover-photo.jpg',
    photoFocus: 0.5,
    photoZoom: 1,
  },
  story: {
    headline: 'Solenne Unveils Three New Collections at the Spring Jewelry Show',
    headlineSize: 1,
    body: BODY,
    photo: 'footage/newspaper-city-cuts/story-photo.jpg',
    booth: 'Booth 214',
    dates: 'June 6 - 9',
    band: 'SOLENNE',
  },
  ink: {
    text: '#1b1a17',
    accent: '#b8893a',
    band: '#1b1a17',
    bandText: '#f6f3ec',
    paper: '#f3eee4',
  },
  print: {
    strength: 0.95,
    shading: 0.7,
    softness: 0.5,
    paperTint: 0.5,
  },
  endCard: {
    brand: 'SOLENNE',
    tagline: 'See you at the Spring Show!',
    showMark: true,
    cutFrame: 100,
    wordmarkDelay: 6,
    taglineDelay: 20,
    markSize: 1,
    wordmarkSize: 1,
    taglineSize: 1,
    background: '#f6f3ec',
    wordmarkColor: '#1b1a17',
    taglineColor: '#6d665a',
    markColor: '#b8893a',
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const newspaperCityCutsMeta: ClipMeta = {
  ...promoMeta,
  fps: 24,
  width: 1080,
  height: 1920,
  id: 'newspaper-city-cuts',
  title: 'Newspaper City Cuts',
  description:
    'A woman holds up an open newspaper printed with your jewelry front page while the city behind her jump-cuts from a billboard square to a park, a glass lobby and an ivy café, then a hard cut lands on a clean end card where the logo mark, wordmark and tagline settle in.',
  category: 'ad-reveals',
  tags: ['footage', 'paper', 'headline', 'logo', 'end-card'],
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/newspaper-city-cuts.tsx',
  durationInFrames: 150,
  posterFrame: 30,
};
