import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const DOT_MORPH_FONTS = ['urbanist', 'quicksand', 'sora', 'fraunces'] as const;

export const DOT_MORPH_STYLES = ['bloom', 'underline'] as const;

export type DotMorphFont = (typeof DOT_MORPH_FONTS)[number];

export type DotMorphStyle = (typeof DOT_MORPH_STYLES)[number];

export const dotMorphWordmarkSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    primaryEnd: zColor(),
    text: zColor(),
    dots: zColor(),
    background: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  name: z.object({
    font: z.enum(DOT_MORPH_FONTS),
    size: zSlider({ min: 80, max: 300, step: 2 }),
    tracking: zSlider({ min: -0.06, max: 0.16, step: 0.005 }),
    openTracking: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    fullStop: z.boolean(),
  }),
  mark: z.object({
    show: z.boolean(),
    plate: z.boolean(),
    height: zSlider({ min: 60, max: 360, step: 2 }),
    width: zSlider({ min: 120, max: 900, step: 4 }),
    gap: zSlider({ min: 0, max: 240, step: 2 }),
    padding: zSlider({ min: 0, max: 80, step: 1 }),
  }),
  dots: z.object({
    count: zSlider({ min: 2, max: 6, step: 1 }),
    size: zSlider({ min: 40, max: 160, step: 2 }),
    hop: zSlider({ min: 0, max: 4, step: 0.1 }),
    squash: zSlider({ min: 0, max: 0.5, step: 0.01 }),
  }),
  morph: z.object({
    style: z.enum(DOT_MORPH_STYLES),
    tint: zSlider({ min: 0, max: 30 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -600, max: 600, step: 2 }),
  }),
  timing: z.object({
    start: zSlider({ min: 0, max: 20 }),
    pace: zSlider({ min: 0.8, max: 1.2, step: 0.05 }),
    stagger: zSlider({ min: 2, max: 8 }),
    tighten: zSlider({ min: 0, max: 40 }),
  }),
});

export type DotMorphWordmarkProps = z.infer<typeof dotMorphWordmarkSchema>;

export const dotMorphWordmarkDefaults: DotMorphWordmarkProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff8a3c',
    primaryEnd: '#c2409a',
    text: '#161618',
    dots: '#161618',
    background: '#ffffff',
    plate: '#f2f2f4',
  },
  showBackground: true,
  name: { font: 'urbanist', size: 240, tracking: -0.01, openTracking: 0.42, fullStop: true },
  mark: { show: true, plate: false, height: 210, width: 560, gap: 64, padding: 24 },
  dots: { count: 4, size: 84, hop: 2.4, squash: 0.28 },
  morph: { style: 'bloom', tint: 0 },
  layout: { offsetY: 0 },
  timing: { start: 0, pace: 1, stagger: 3, tighten: 20 },
};

export const dotMorphWordmarkMeta: ClipMeta = {
  id: 'dot-morph-wordmark',
  title: 'Dot Morph Wordmark',
  description:
    'Four dots, two ink and two in a warm gradient, pop into a cluster, swing out into a row, hop in a wave and turn into the letters of your name, which close up as the last dot leaves a pink full stop. Your logo then settles in above the name.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-morph-wordmark.tsx',
  category: 'brand',
  tags: ['logo', 'reveal', 'kinetic', 'text', 'minimal', 'end-card'],
  durationInFrames: 180,
  posterFrame: 165,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-07-pinterest-wordmark-reveals',
};
