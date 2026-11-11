import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const APP_ICON_FONTS = ['poppins', 'outfit', 'sora', 'inter'] as const;

export type AppIconFont = (typeof APP_ICON_FONTS)[number];

export const appIconRevealSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  colors: z.object({
    primary: zColor(),
    face: zColor(),
    text: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    shadow: zColor(),
  }),
  showBackground: z.boolean(),
  tile: z.object({
    size: zSlider({ min: 160, max: 560, step: 4 }),
    roundness: zSlider({ min: 0, max: 50 }),
    logoPadding: zSlider({ min: 0, max: 35 }),
    widest: zSlider({ min: 1, max: 2.4, step: 0.05 }),
    depth: zSlider({ min: 0, max: 48 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  name: z.object({
    font: z.enum(APP_ICON_FONTS),
    size: zSlider({ min: 32, max: 160, step: 2 }),
    tracking: zSlider({ min: -0.06, max: 0.2, step: 0.005 }),
    gap: zSlider({ min: 16, max: 200, step: 2 }),
    maxWidth: zSlider({ min: 600, max: 1800, step: 10 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -400, max: 400, step: 2 }),
  }),
  timing: z.object({
    flipStart: zSlider({ min: 6, max: 90 }),
    flipFrames: zSlider({ min: 12, max: 48 }),
    typeDelay: zSlider({ min: 0, max: 40 }),
    letterFrames: zSlider({ min: 1, max: 6, step: 0.5 }),
  }),
  life: z.object({
    lift: zSlider({ min: 0, max: 0.2, step: 0.01 }),
    float: zSlider({ min: 0, max: 24 }),
    shine: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
});

export type AppIconRevealProps = z.infer<typeof appIconRevealSchema>;

export const appIconRevealDefaults: AppIconRevealProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  colors: {
    primary: '#f2b134',
    face: '#ffffff',
    text: '#26262b',
    background: '#e4e4e1',
    backgroundEdge: '#c3c4bf',
    shadow: '#3a3b36',
  },
  showBackground: true,
  tile: { size: 320, roundness: 23, logoPadding: 14, widest: 1.9, depth: 22, shadow: 0.6 },
  name: { font: 'poppins', size: 76, tracking: -0.01, gap: 56, maxWidth: 1600 },
  layout: { offsetY: -10 },
  timing: { flipStart: 22, flipFrames: 22, typeDelay: 2, letterFrames: 2.5 },
  life: { lift: 0.07, float: 6, shine: 0.55 },
};

export const appIconRevealMeta: ClipMeta = {
  id: 'app-icon-reveal',
  title: 'App Icon Reveal',
  description:
    'A brand-coloured app tile settles in, flips over like a card to show your logo on its face, and your name types itself in underneath.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/app-icon-reveal.tsx',
  category: 'brand',
  tags: ['logo', 'icon', 'flip', 'reveal', 'typing', 'minimal', 'end-card'],
  durationInFrames: 150,
  posterFrame: 120,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
