import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const NEON_FONTS = ['tilt-neon', 'comfortaa', 'quicksand', 'monoton'] as const;

export type NeonFont = (typeof NEON_FONTS)[number];

export const NEON_LABEL_FONTS = ['outfit', 'dm-mono', 'josefin-sans'] as const;

export type NeonLabelFont = (typeof NEON_LABEL_FONTS)[number];

export const NEON_ENDINGS = ['burn-out', 'relight'] as const;

export const NEON_OPENINGS = ['lit', 'switch-on'] as const;

export const neonSignFlickerSchema = z.object({
  headline: z.string(),
  tagline: zMultiline(),
  logo: zImage(),
  companyName: z.string(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    lamp: zColor(),
    plate: zColor(),
    glass: zColor(),
  }),
  showBackground: z.boolean(),
  neon: z.object({
    font: z.enum(NEON_FONTS),
    uppercase: z.boolean(),
    size: zSlider({ min: 80, max: 320, step: 2 }),
    tracking: zSlider({ min: -0.05, max: 0.3, step: 0.005 }),
    glow: zSlider({ min: 0, max: 1.5, step: 0.05 }),
    wallGlow: zSlider({ min: 0, max: 1, step: 0.01 }),
    hum: zSlider({ min: 0, max: 0.15, step: 0.005 }),
  }),
  flicker: z.object({
    letter: zSlider({ min: 1, max: 20 }),
    ending: z.enum(NEON_ENDINGS),
    start: zSlider({ min: 0, max: 150 }),
    bursts: zSlider({ min: 1, max: 10 }),
    firstBurst: zSlider({ min: 6, max: 40 }),
    shrink: zSlider({ min: 0, max: 8, step: 0.5 }),
    gap: zSlider({ min: 4, max: 30 }),
    pattern: zSlider({ min: 1, max: 99 }),
  }),
  opening: z.object({
    style: z.enum(NEON_OPENINGS),
    length: zSlider({ min: 24, max: 90 }),
  }),
  lamp: z.object({
    show: z.boolean(),
    beam: zSlider({ min: 0, max: 1.5, step: 0.05 }),
    sway: zSlider({ min: 0, max: 6, step: 0.1 }),
    height: zSlider({ min: 60, max: 360, step: 2 }),
    size: zSlider({ min: 80, max: 220, step: 2 }),
  }),
  type: z.object({
    font: z.enum(NEON_LABEL_FONTS),
    uppercase: z.boolean(),
    taglineSize: zSlider({ min: 28, max: 72 }),
    tracking: zSlider({ min: -0.02, max: 0.3, step: 0.005 }),
    nameSize: zSlider({ min: 32, max: 96 }),
    websiteSize: zSlider({ min: 18, max: 44 }),
  }),
  lockup: z.object({
    plate: z.boolean(),
    logoWidth: zSlider({ min: 200, max: 800, step: 4 }),
    logoHeight: zSlider({ min: 80, max: 360, step: 4 }),
    padding: zSlider({ min: 0, max: 80, step: 2 }),
  }),
  layout: z.object({
    signY: zSlider({ min: 500, max: 1200, step: 2 }),
    lockupY: zSlider({ min: 1200, max: 1800, step: 2 }),
  }),
});

export type NeonSignFlickerProps = z.infer<typeof neonSignFlickerSchema>;

export const neonSignFlickerDefaults: NeonSignFlickerProps = {
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  colors: {
    primary: '#ff4fae',
    text: '#f7ecf6',
    background: '#0a0610',
    lamp: '#ffd9a0',
    plate: '#f7eef3',
    glass: '#1a1119',
  },
  showBackground: true,
  neon: {
    font: 'tilt-neon',
    uppercase: true,
    size: 236,
    tracking: 0.02,
    glow: 1,
    wallGlow: 0.4,
    hum: 0.05,
  },
  flicker: {
    letter: 1,
    ending: 'burn-out',
    start: 20,
    bursts: 7,
    firstBurst: 25,
    shrink: 3.5,
    gap: 13,
    pattern: 7,
  },
  opening: { style: 'lit', length: 48 },
  lamp: { show: true, beam: 1, sway: 2, height: 150, size: 132 },
  type: {
    font: 'outfit',
    uppercase: true,
    taglineSize: 46,
    tracking: 0.08,
    nameSize: 56,
    websiteSize: 26,
  },
  lockup: { plate: true, logoWidth: 600, logoHeight: 250, padding: 34 },
  layout: { signY: 860, lockupY: 1500 },
};

export const neonSignFlickerMeta: ClipMeta = {
  id: 'neon-sign-flicker',
  title: 'Neon Sign Flicker',
  description:
    'A pink neon word glows under a pendant lamp until one letter and the lamp sputter in shrinking bursts and burn out, above your tagline, logo plate, name and website.',
  source: 'src/compositions/scenes/text-reveals/neon-sign-flicker.tsx',
  posterFrame: 15,
  category: 'text-reveals',
  tags: ['glow', 'text', 'headline', 'logo'],
  theme: 'dark',
  durationInFrames: 300,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
};
