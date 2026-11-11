import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const billboardReaderSchema = z.object({
  headline: z.string(),
  headlineAccent: z.string(),
  tagline: z.string(),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    accent: zColor(),
    board: zColor(),
    text: zColor(),
    tagline: zColor(),
    suit: zColor(),
    trim: zColor(),
    cape: zColor(),
    skyTop: zColor(),
    skyHorizon: zColor(),
    ocean: zColor(),
    roofs: zColor(),
    walls: zColor(),
    lamp: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    headlineSize: zSlider({ min: 90, max: 190, step: 2 }),
    taglineSize: zSlider({ min: 40, max: 80, step: 2 }),
    nameSize: zSlider({ min: 44, max: 96, step: 2 }),
    uppercase: z.boolean(),
  }),
  lockup: z.object({
    logoHeight: zSlider({ min: 100, max: 300, step: 2 }),
    showPlate: z.boolean(),
  }),
  board: z.object({
    brackets: z.boolean(),
    lampsAt: zSlider({ min: 0, max: 90 }),
    lampGlow: zSlider({ min: 0, max: 1.5, step: 0.05 }),
  }),
  reader: z.object({
    show: z.boolean(),
    flipAt: zSlider({ min: 30, max: 200 }),
    kick: zSlider({ min: 0, max: 2, step: 0.05 }),
  }),
  camera: z.object({
    orbit: zSlider({ min: 0, max: 60 }),
    rise: zSlider({ min: 0, max: 40 }),
    endDistance: zSlider({ min: 26, max: 60 }),
    fieldOfView: zSlider({ min: 30, max: 55 }),
  }),
  city: z.object({
    traffic: z.boolean(),
    surf: zSlider({ min: 0, max: 2, step: 0.05 }),
  }),
});

export type BillboardReaderProps = z.infer<typeof billboardReaderSchema>;

export const billboardReaderDefaults: BillboardReaderProps = {
  headline: '{{Headline}}',
  headlineAccent: '{{Headline Accent}}',
  tagline: '{{Tagline}}',
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    accent: '#f7a33c',
    board: '#2e2a4d',
    text: '#f7f3fb',
    tagline: '#c3bde0',
    suit: '#5b2fae',
    trim: '#3ccaa9',
    cape: '#d4634f',
    skyTop: '#7f6c96',
    skyHorizon: '#f6bfa2',
    ocean: '#a98fb6',
    roofs: '#6c70b0',
    walls: '#d4cade',
    lamp: '#ffe2b8',
    plate: '#f7f4fa',
  },
  showBackground: true,
  type: { headlineSize: 150, taglineSize: 64, nameSize: 70, uppercase: true },
  lockup: { logoHeight: 240, showPlate: true },
  board: { brackets: true, lampsAt: 24, lampGlow: 1 },
  reader: { show: true, flipAt: 90, kick: 1 },
  camera: { orbit: 33, rise: 18, endDistance: 46, fieldOfView: 40 },
  city: { traffic: true, surf: 1 },
};

export const billboardReaderMeta: ClipMeta = {
  id: 'billboard-reader',
  title: 'Billboard Reader',
  description:
    'A caped hero sits on top of your billboard high above a coastal city at dusk, reading the paper while the lamps light up your headline, tagline and logo and the camera cranes up past the board.',
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/billboard-reader.tsx',
  category: 'ad-reveals',
  tags: ['3d', 'billboard', 'camera-move', 'headline', 'logo', 'paper', 'orbit', 'glow'],
  durationInFrames: 300,
  posterFrame: 280,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
