import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const PENDULUM_FONTS = ['outfit', 'poppins', 'sora', 'lexend'] as const;

export type PendulumFont = (typeof PENDULUM_FONTS)[number];

export const pendulumBrandSwingSchema = z.object({
  companyName: z.string(),
  headline: zMultiline(),
  tagline: z.string(),
  services: zMultiline(),
  website: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    surface: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(PENDULUM_FONTS),
    copySize: zSlider({ min: 56, max: 160, step: 2 }),
    brandSize: zSlider({ min: 24, max: 80, step: 1 }),
    servicesSize: zSlider({ min: 20, max: 56, step: 1 }),
    websiteSize: zSlider({ min: 18, max: 56, step: 1 }),
    lightMiddle: z.boolean(),
    accentWords: zSlider({ min: 0, max: 4, step: 1 }),
    accentInitial: z.boolean(),
  }),
  pendulum: z.object({
    swing: zSlider({ min: 0.7, max: 1, step: 0.01 }),
    length: zSlider({ min: 980, max: 1100, step: 10 }),
    dwell: zSlider({ min: 0, max: 0.3, step: 0.05 }),
    bobSize: zSlider({ min: 110, max: 190, step: 2 }),
    string: zSlider({ min: 2, max: 10, step: 0.5 }),
    trail: zSlider({ min: 0, max: 1, step: 0.05 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  layout: z.object({
    brandY: zSlider({ min: 60, max: 360, step: 2 }),
    copyY: zSlider({ min: 560, max: 720, step: 2 }),
    footer: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
});

export type PendulumBrandSwingProps = z.infer<typeof pendulumBrandSwingSchema>;

export const pendulumBrandSwingDefaults: PendulumBrandSwingProps = {
  companyName: '{{Company Name}}',
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  services: '{{Services}}',
  website: '{{Website}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#dc1046',
    text: '#ffffff',
    surface: '#f7f4ef',
    background: '#1e1e20',
    backgroundEdge: '#121213',
  },
  showBackground: true,
  type: {
    font: 'outfit',
    copySize: 104,
    brandSize: 42,
    servicesSize: 34,
    websiteSize: 32,
    lightMiddle: true,
    accentWords: 1,
    accentInitial: true,
  },
  pendulum: {
    swing: 0.99,
    length: 1020,
    dwell: 0.3,
    bobSize: 150,
    string: 4.5,
    trail: 0.6,
    shadow: 0.7,
  },
  layout: { brandY: 156, copyY: 672, footer: 0.2 },
};

export const pendulumBrandSwingMeta: ClipMeta = {
  id: 'pendulum-brand-swing',
  title: 'Pendulum Brand Swing',
  description:
    'A logo bob on a long Primary string swings like a pendulum across a dark plate, and its string wipes the centre copy on every pass, from the company name to the headline, the tagline and back, with the name at the top and the services and website below.',
  source: 'src/compositions/scenes/brand/pendulum-brand-swing.tsx',
  posterFrame: 190,
  category: 'brand',
  tags: ['logo', 'wipe', 'headline', 'text', 'reveal', 'minimal', 'repeat'],
  theme: 'dark',
  durationInFrames: 304,
  fps: 30,
  width: 1080,
  height: 1350,
  batch: '2026-11-19-mixed-launch-promos',
};
