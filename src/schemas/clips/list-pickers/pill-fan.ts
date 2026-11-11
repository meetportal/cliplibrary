import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const PILL_FAN_FONTS = ['sora', 'quicksand', 'fraunces', 'outfit', 'inter-tight'] as const;

export type PillFanFont = (typeof PILL_FAN_FONTS)[number];

export const PILL_FAN_TRAILS = ['tint', 'outline'] as const;

export const PILL_FAN_PLACEMENTS = ['corner', 'below-line'] as const;

export const PILL_FAN_DIRECTIONS = ['down', 'up'] as const;

export const pillFanSchema = z.object({
  headline: z.string(),
  words: z.array(z.string()).min(2).max(10),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    pillText: zColor(),
    text: zColor(),
    background: zColor(),
    glow: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  phrase: z.object({
    font: z.enum(PILL_FAN_FONTS),
    size: zSlider({ min: 48, max: 160, step: 2 }),
    tilt: zSlider({ min: -15, max: 15, step: 0.5 }),
    gap: zSlider({ min: 0, max: 120, step: 2 }),
  }),
  pills: z.object({
    font: z.enum(PILL_FAN_FONTS),
    textSize: zSlider({ min: 32, max: 120, step: 2 }),
    height: zSlider({ min: 60, max: 200, step: 2 }),
    padding: zSlider({ min: 16, max: 100, step: 2 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.01 }),
    trail: z.enum(PILL_FAN_TRAILS),
  }),
  fan: z.object({
    angle: zSlider({ min: -40, max: 20, step: 0.5 }),
    direction: z.enum(PILL_FAN_DIRECTIONS),
    spread: zSlider({ min: 20, max: 60, step: 0.5 }),
    swingIn: zSlider({ min: 10, max: 90, step: 1 }),
    hinge: zSlider({ min: 0, max: 160, step: 2 }),
    slide: zSlider({ min: 0, max: 80, step: 1 }),
    shrink: zSlider({ min: 0, max: 0.15, step: 0.005 }),
    trail: zSlider({ min: 1, max: 5 }),
    fade: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    clearAtEnd: z.boolean(),
  }),
  brand: z.object({
    placement: z.enum(PILL_FAN_PLACEMENTS),
    logoWidth: zSlider({ min: 80, max: 420, step: 2 }),
    logoHeight: zSlider({ min: 40, max: 200, step: 2 }),
    nameSize: zSlider({ min: 20, max: 80, step: 1 }),
    plate: z.boolean(),
    gap: zSlider({ min: 60, max: 320, step: 2 }),
  }),
  glow: z.object({
    strength: zSlider({ min: 0, max: 1, step: 0.01 }),
    drift: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  layout: z.object({
    x: zSlider({ min: -600, max: 600, step: 2 }),
    y: zSlider({ min: -400, max: 400, step: 2 }),
    margin: zSlider({ min: 40, max: 200, step: 2 }),
  }),
  timing: z.object({
    intro: zSlider({ min: 10, max: 40 }),
    firstSwap: zSlider({ min: 12, max: 60 }),
    interval: zSlider({ min: 12, max: 60 }),
    swing: zSlider({ min: 8, max: 30 }),
    drift: zSlider({ min: 0.05, max: 0.4, step: 0.01 }),
  }),
});

export type PillFanProps = z.infer<typeof pillFanSchema>;

export const PILL_FAN_WORDS = [
  '{{Item 1}}',
  '{{Item 2}}',
  '{{Item 3}}',
  '{{Item 4}}',
  '{{Item 5}}',
  '{{Item 6}}',
];

export const pillFanDefaults: PillFanProps = {
  headline: '{{Headline}}',
  words: PILL_FAN_WORDS,
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#5b4bdb',
    pillText: '#ffffff',
    text: '#14121f',
    background: '#f8f7fc',
    glow: '#a99df0',
    plate: '#ffffff',
  },
  showBackground: true,
  phrase: { font: 'sora', size: 96, tilt: -4, gap: 12 },
  pills: { font: 'quicksand', textSize: 66, height: 108, padding: 40, shadow: 0.45, trail: 'tint' },
  fan: {
    angle: -10,
    direction: 'down',
    spread: 38,
    swingIn: 28,
    hinge: 44,
    slide: 40,
    shrink: 0.05,
    trail: 3,
    fade: 0.2,
    clearAtEnd: false,
  },
  brand: {
    placement: 'corner',
    logoWidth: 330,
    logoHeight: 110,
    nameSize: 44,
    plate: false,
    gap: 170,
  },
  glow: { strength: 0.62, drift: 0.6 },
  layout: { x: -60, y: -100, margin: 96 },
  timing: { intro: 18, firstSwap: 32, interval: 23, swing: 18, drift: 0.15 },
};

export const pillFanMeta: ClipMeta = {
  id: 'pill-fan',
  title: 'Pill Fan',
  description:
    'A phrase is completed by violet word pills that swing in on top and fan away around a hinge into a readable trail, with the logo and name in the corner.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/pill-fan.tsx',
  posterFrame: 150,
  category: 'list-pickers',
  tags: ['list', 'picker', 'text', 'kinetic'],
  durationInFrames: 180,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
};
