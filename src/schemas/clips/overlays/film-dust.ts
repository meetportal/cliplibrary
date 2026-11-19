import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const filmDustSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    dust: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  title: z.object({
    show: z.boolean(),
    nameSize: zSlider({ min: 60, max: 240 }),
    taglineSize: zSlider({ min: 20, max: 90 }),
    tracking: zSlider({ min: 0, max: 0.3, step: 0.005 }),
    gap: zSlider({ min: 20, max: 160 }),
    maxWidth: zSlider({ min: 800, max: 1800, step: 10 }),
    centerY: zSlider({ min: 300, max: 780 }),
    rules: z.boolean(),
    ruleWidth: zSlider({ min: 20, max: 300 }),
  }),
  dust: z.object({
    amount: zSlider({ min: 0, max: 3, step: 0.05 }),
    size: zSlider({ min: 0.5, max: 3, step: 0.05 }),
    opacity: zSlider({ min: 0, max: 1, step: 0.01 }),
    life: zSlider({ min: 4, max: 40 }),
    hairs: zSlider({ min: 0, max: 1, step: 0.01 }),
    darkSpecks: zSlider({ min: 0, max: 1, step: 0.01 }),
    scratches: zSlider({ min: 0, max: 3, step: 0.05 }),
    seed: zSlider({ min: 1, max: 99 }),
  }),
  weave: z.object({
    radius: zSlider({ min: 0, max: 30, step: 0.5 }),
    breathing: zSlider({ min: 0, max: 0.05, step: 0.001 }),
  }),
});

export type FilmDustProps = z.infer<typeof filmDustSchema>;

export const filmDustDefaults: FilmDustProps = {
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#d6a04c',
    text: '#f1e8d4',
    dust: '#f0e4c8',
    background: '#0a0a0a',
    backgroundEdge: '#070707',
  },
  showBackground: true,
  title: {
    show: true,
    nameSize: 150,
    taglineSize: 46,
    tracking: 0.02,
    gap: 78,
    maxWidth: 1500,
    centerY: 520,
    rules: true,
    ruleWidth: 110,
  },
  dust: {
    amount: 1,
    size: 1,
    opacity: 0.32,
    life: 12,
    hairs: 0.5,
    darkSpecks: 0.35,
    scratches: 1,
    seed: 7,
  },
  weave: { radius: 12, breathing: 0.01 },
};

export const filmDustMeta: ClipMeta = {
  id: 'film-dust',
  title: 'Film Dust',
  description:
    'An old film title card: your company name in a classic serif with an italic tagline between two thin Primary rules on a near-black film plate, weaving gently in the gate while dust, hairs, specks and the odd scratch flicker over it at fixed spots. Loops seamlessly; turn the title or the background off to use the dust as an overlay.',
  theme: 'dark',
  source: 'src/compositions/scenes/overlays/film-dust.tsx',
  category: 'overlays',
  tags: ['overlay', 'film', 'grain', 'texture', 'headline', 'minimal'],
  durationInFrames: 150,
  posterFrame: 44,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
