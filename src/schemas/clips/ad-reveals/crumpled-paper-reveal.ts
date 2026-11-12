import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const crumpledPaperRevealSchema = z.object({
  headline: z.string(),
  tagline: z.string(),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    paper: zColor(),
    wall: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    headlineSize: zSlider({ min: 90, max: 220, step: 2 }),
    headlineCaps: z.boolean(),
    taglineSize: zSlider({ min: 18, max: 44, step: 1 }),
    nameSize: zSlider({ min: 16, max: 40, step: 1 }),
  }),
  lockup: z.object({
    logoHeight: zSlider({ min: 60, max: 180, step: 2 }),
    showPlate: z.boolean(),
  }),
  paper: z.object({
    wrinkles: zSlider({ min: 0, max: 2, step: 0.05 }),
    ballSize: zSlider({ min: 0.14, max: 0.34, step: 0.01 }),
    spin: zSlider({ min: -60, max: 60, step: 1 }),
    tilt: zSlider({ min: -8, max: 8, step: 0.5 }),
  }),
  light: z.object({
    drift: zSlider({ min: 0, max: 2, step: 0.05 }),
    windowShadow: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
});

export type CrumpledPaperRevealProps = z.infer<typeof crumpledPaperRevealSchema>;

export const crumpledPaperRevealDefaults: CrumpledPaperRevealProps = {
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#b5562f',
    text: '#1e2438',
    paper: '#efe7d4',
    wall: '#9eaa8c',
    plate: '#ffffff',
  },
  showBackground: true,
  type: { headlineSize: 176, headlineCaps: true, taglineSize: 30, nameSize: 24 },
  lockup: { logoHeight: 140, showPlate: false },
  paper: { wrinkles: 1, ballSize: 0.26, spin: 28, tilt: -2 },
  light: { drift: 1, windowShadow: 0.7 },
};

export const crumpledPaperRevealMeta: ClipMeta = {
  id: 'crumpled-paper-reveal',
  title: 'Crumpled Paper Reveal',
  description:
    'A printed sheet crumples into a paper ball against a sage wall in hard window light, then bursts open and settles flat with its creases left in, so the logo, a big serif headline, a tagline and the company name read on crumpled paper and hold.',
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/crumpled-paper-reveal.tsx',
  category: 'ad-reveals',
  tags: ['reveal', 'paper', 'texture', 'headline', 'logo', 'minimal', 'end-card'],
  durationInFrames: 210,
  posterFrame: 180,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
