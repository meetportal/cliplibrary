import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const BRAND_REVEAL_FONTS = ['inter-tight', 'manrope', 'sora', 'dm-sans'] as const;

export type BrandRevealFont = (typeof BRAND_REVEAL_FONTS)[number];

export const brandRevealSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  eyebrow: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    eyebrow: zColor(),
    tagline: zColor(),
    plate: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  halo: z.object({
    size: zSlider({ min: 100, max: 360, step: 2 }),
    thickness: zSlider({ min: 2, max: 28 }),
    gap: zSlider({ min: 0, max: 40 }),
    logoPadding: zSlider({ min: 0, max: 35 }),
    widest: zSlider({ min: 1, max: 3.2, step: 0.05 }),
  }),
  dot: z.object({
    show: z.boolean(),
    size: zSlider({ min: 4, max: 40 }),
    distance: zSlider({ min: 4, max: 60 }),
    orbit: zSlider({ min: 0, max: 60 }),
  }),
  name: z.object({
    font: z.enum(BRAND_REVEAL_FONTS),
    size: zSlider({ min: 60, max: 260, step: 2 }),
    tracking: zSlider({ min: -0.08, max: 0.1, step: 0.005 }),
    gap: zSlider({ min: 16, max: 160, step: 2 }),
    maxWidth: zSlider({ min: 800, max: 1840, step: 10 }),
  }),
  eyebrowStyle: z.object({
    size: zSlider({ min: 12, max: 56 }),
    tracking: zSlider({ min: 0, max: 0.6, step: 0.01 }),
    gap: zSlider({ min: 8, max: 160, step: 2 }),
  }),
  taglineStyle: z.object({
    size: zSlider({ min: 18, max: 72 }),
    gap: zSlider({ min: 8, max: 160, step: 2 }),
    maxWidth: zSlider({ min: 500, max: 1700, step: 10 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -300, max: 300, step: 2 }),
    lightDrift: zSlider({ min: 0, max: 400, step: 2 }),
  }),
  timing: z.object({
    start: zSlider({ min: 0, max: 30 }),
    drawFrames: zSlider({ min: 14, max: 60 }),
    letterFrames: zSlider({ min: 1, max: 6, step: 0.5 }),
    taglineDelay: zSlider({ min: 0, max: 30 }),
  }),
});

export type BrandRevealProps = z.infer<typeof brandRevealSchema>;

export const brandRevealDefaults: BrandRevealProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  eyebrow: 'Introducing',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#3157e6',
    text: '#111214',
    eyebrow: '#85858a',
    tagline: '#6c6c72',
    plate: '#ffffff',
    background: '#f6f6f3',
    backgroundEdge: '#dcdcd5',
  },
  showBackground: true,
  halo: { size: 176, thickness: 12, gap: 9, logoPadding: 13, widest: 2.6 },
  dot: { show: true, size: 14, distance: 14, orbit: 12 },
  name: { font: 'inter-tight', size: 176, tracking: -0.045, gap: 64, maxWidth: 1640 },
  eyebrowStyle: { size: 22, tracking: 0.32, gap: 26 },
  taglineStyle: { size: 36, gap: 30, maxWidth: 1240 },
  layout: { offsetY: -24, lightDrift: 260 },
  timing: { start: 0, drawFrames: 30, letterFrames: 3, taglineDelay: 4 },
};

export const brandRevealMeta: ClipMeta = {
  id: 'brand-reveal',
  title: 'Brand Reveal',
  description:
    'A calm introduction: a brand-coloured halo draws itself around your logo while your name rises in letter by letter beside it, with an eyebrow above and your tagline below.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/brand-reveal.tsx',
  category: 'brand',
  tags: ['logo', 'reveal', 'draw', 'minimal', 'end-card'],
  durationInFrames: 180,
  posterFrame: 120,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
