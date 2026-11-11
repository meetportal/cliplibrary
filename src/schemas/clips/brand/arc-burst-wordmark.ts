import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const ARC_BURST_FONTS = [
  'lexend',
  'archivo-black',
  'comfortaa',
  'fredoka',
  'unbounded',
] as const;

export type ArcBurstFont = (typeof ARC_BURST_FONTS)[number];

export const ARC_BURST_CASES = ['as-typed', 'lowercase', 'uppercase'] as const;

export const ARC_BURST_WIPES = ['iris', 'split'] as const;

export const ARC_BURST_BUILDS = ['slices', 'swing'] as const;

export const arcBurstWordmarkSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    field: zColor(),
    comet: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  name: z.object({
    font: z.enum(ARC_BURST_FONTS),
    letterCase: z.enum(ARC_BURST_CASES),
    size: zSlider({ min: 60, max: 320, step: 2 }),
    tracking: zSlider({ min: -0.08, max: 0.2, step: 0.005 }),
    maxWidth: zSlider({ min: 40, max: 92 }),
    wrap: z.boolean(),
    offsetY: zSlider({ min: -400, max: 400, step: 2 }),
  }),
  mark: z.object({
    show: z.boolean(),
    width: zSlider({ min: 80, max: 1000, step: 4 }),
    height: zSlider({ min: 40, max: 420, step: 2 }),
    gap: zSlider({ min: 0, max: 200, step: 2 }),
    plate: z.boolean(),
    padding: zSlider({ min: 0, max: 80, step: 2 }),
    roundness: zSlider({ min: 0, max: 50 }),
  }),
  swirl: z.object({
    arcs: zSlider({ min: 0, max: 16 }),
    comets: zSlider({ min: 0, max: 6 }),
    spin: zSlider({ min: 0, max: 3, step: 0.05 }),
  }),
  burst: z.object({
    style: z.enum(ARC_BURST_WIPES),
    at: zSlider({ min: 16, max: 60 }),
    length: zSlider({ min: 10, max: 30 }),
  }),
  build: z.object({
    style: z.enum(ARC_BURST_BUILDS),
    delay: zSlider({ min: 0, max: 24 }),
    spread: zSlider({ min: 0, max: 40 }),
    flight: zSlider({ min: 10, max: 36 }),
    swing: zSlider({ min: 10, max: 120 }),
    orbits: zSlider({ min: 0, max: 12 }),
  }),
  accent: z.object({
    show: z.boolean(),
    thickness: zSlider({ min: 2, max: 30 }),
    gap: zSlider({ min: 0, max: 120, step: 2 }),
  }),
});

export type ArcBurstWordmarkProps = z.infer<typeof arcBurstWordmarkSchema>;

export const arcBurstWordmarkDefaults: ArcBurstWordmarkProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff8c05',
    text: '#0b0b0c',
    background: '#ffffff',
    field: '#050505',
    comet: '#ffffff',
    plate: '#f4f1ea',
  },
  showBackground: true,
  name: {
    font: 'lexend',
    letterCase: 'lowercase',
    size: 210,
    tracking: -0.035,
    maxWidth: 78,
    wrap: true,
    offsetY: 0,
  },
  mark: { show: true, width: 720, height: 280, gap: 56, plate: false, padding: 24, roundness: 22 },
  swirl: { arcs: 10, comets: 4, spin: 1 },
  burst: { style: 'iris', at: 28, length: 16 },
  build: { style: 'slices', delay: 4, spread: 14, flight: 18, swing: 70, orbits: 6 },
  accent: { show: false, thickness: 12, gap: 44 },
};

export const arcBurstWordmarkMeta: ClipMeta = {
  id: 'arc-burst-wordmark',
  title: 'Arc Burst Wordmark',
  description:
    'Orange arcs and white comets swirl on black, an orange iris bursts the frame open to white, and your name pivots together from spinning slices as the orange settles away.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/arc-burst-wordmark.tsx',
  category: 'brand',
  tags: ['logo', 'reveal', 'kinetic', 'orbit', 'wipe', 'end-card'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1440,
  height: 1080,
  batch: '2026-11-07-pinterest-wordmark-reveals',
};
