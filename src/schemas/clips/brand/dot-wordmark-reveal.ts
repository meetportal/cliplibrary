import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const DOT_WORDMARK_NAME_FONTS = ['quicksand', 'fredoka', 'outfit', 'sora'] as const;

export type DotWordmarkNameFont = (typeof DOT_WORDMARK_NAME_FONTS)[number];

export const DOT_WORDMARK_LINE_FONTS = ['inter', 'outfit', 'sora'] as const;

export type DotWordmarkLineFont = (typeof DOT_WORDMARK_LINE_FONTS)[number];

export const dotWordmarkRevealSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    accent: zColor(),
    text: zColor(),
    background: zColor(),
    surface: zColor(),
  }),
  showBackground: z.boolean(),
  line: z.object({
    font: z.enum(DOT_WORDMARK_LINE_FONTS),
    size: zSlider({ min: 40, max: 96, step: 2 }),
    flips: z.boolean(),
  }),
  name: z.object({
    font: z.enum(DOT_WORDMARK_NAME_FONTS),
    size: zSlider({ min: 64, max: 180, step: 2 }),
    tracking: zSlider({ min: -0.04, max: 0.12, step: 0.005 }),
  }),
  tile: z.object({
    logoSize: zSlider({ min: 140, max: 360, step: 4 }),
    padding: zSlider({ min: 8, max: 64, step: 2 }),
    border: zSlider({ min: 8, max: 48, step: 2 }),
    roundness: zSlider({ min: 0, max: 100 }),
  }),
  dot: z.object({
    size: zSlider({ min: 16, max: 48, step: 1 }),
    accentSize: zSlider({ min: 20, max: 72, step: 1 }),
    pulse: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  layout: z.object({
    gap: zSlider({ min: 24, max: 200, step: 2 }),
    offsetY: zSlider({ min: -400, max: 400, step: 4 }),
  }),
  timing: z.object({
    hop: zSlider({ min: 9, max: 20 }),
    write: zSlider({ min: 20, max: 48 }),
  }),
});

export type DotWordmarkRevealProps = z.infer<typeof dotWordmarkRevealSchema>;

export const dotWordmarkRevealDefaults: DotWordmarkRevealProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#0e7a6c',
    accent: '#f0566e',
    text: '#17302c',
    background: '#f4f0e8',
    surface: '#ffffff',
  },
  showBackground: true,
  line: { font: 'inter', size: 64, flips: true },
  name: { font: 'quicksand', size: 132, tracking: 0.01 },
  tile: { logoSize: 280, padding: 30, border: 22, roundness: 34 },
  dot: { size: 30, accentSize: 40, pulse: 0.6 },
  layout: { gap: 72, offsetY: 0 },
  timing: { hop: 18, write: 36 },
};

export const dotWordmarkRevealMeta: ClipMeta = {
  id: 'dot-wordmark-reveal',
  title: 'Dot Wordmark Reveal',
  description:
    'A dot hops across your tagline word by word, flipping the stage colour, then swells into a colour field, writes your name and folds into a logo tile.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-wordmark-reveal.tsx',
  category: 'brand',
  tags: ['logo', 'reveal', 'minimal', 'end-card'],
  durationInFrames: 277,
  posterFrame: 258,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
