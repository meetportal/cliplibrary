import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const CIRCLE_POP_FONTS = ['grotesk', 'geometric', 'condensed'] as const;

export type CirclePopFont = (typeof CIRCLE_POP_FONTS)[number];

export const circlePopSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    surface: zColor(),
    background: zColor(),
  }),
  showBackground: z.boolean(),
  name: z.object({
    font: z.enum(CIRCLE_POP_FONTS),
    size: zSlider({ min: 120, max: 360 }),
    tilt: zSlider({ min: -12, max: 12, step: 0.5 }),
    centerY: zSlider({ min: 0.3, max: 0.6, step: 0.01 }),
  }),
  circle: z.object({
    size: zSlider({ min: 280, max: 640 }),
    lobes: zSlider({ min: 4, max: 12 }),
    wobble: zSlider({ min: 0, max: 0.14, step: 0.005 }),
    wobbleSpeed: zSlider({ min: 0, max: 3, step: 0.05 }),
    echo: zSlider({ min: 0, max: 0.3, step: 0.01 }),
  }),
  ripple: z.object({
    show: z.boolean(),
    width: zSlider({ min: 2, max: 24, step: 0.5 }),
    reach: zSlider({ min: 1.2, max: 3, step: 0.05 }),
  }),
  line: z.object({
    size: zSlider({ min: 32, max: 80 }),
    gap: zSlider({ min: 20, max: 160 }),
    squiggle: z.boolean(),
    squiggleWidth: zSlider({ min: 120, max: 520 }),
  }),
  timing: z.object({
    popFrames: zSlider({ min: 8, max: 24 }),
    floodAt: zSlider({ min: 36, max: 72 }),
    floodFrames: zSlider({ min: 8, max: 24 }),
    collapseFrames: zSlider({ min: 16, max: 40 }),
  }),
});

export type CirclePopProps = z.infer<typeof circlePopSchema>;

export const circlePopDefaults: CirclePopProps = {
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#ff5a36',
    text: '#0d0d0f',
    surface: '#efeeea',
    background: '#050506',
  },
  showBackground: true,
  name: { font: 'grotesk', size: 300, tilt: 4, centerY: 0.46 },
  circle: { size: 430, lobes: 7, wobble: 0.055, wobbleSpeed: 1, echo: 0.16 },
  ripple: { show: true, width: 8, reach: 1.9 },
  line: { size: 56, gap: 64, squiggle: true, squiggleWidth: 300 },
  timing: { popFrames: 14, floodAt: 50, floodFrames: 12, collapseFrames: 28 },
};

export const circlePopMeta: ClipMeta = {
  id: 'circle-pop',
  title: 'Circle Pop',
  description:
    'Your company name pops in on a small off-white circle with a Primary ripple ring, the circle turns into a wobbling blob, then bursts to flood the screen so the tilted name fills the frame, a tagline rises in over a waving Primary squiggle, and the field shrinks back into the circle so it loops.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/circle-pop.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'zoom', 'reveal', 'minimal', 'cover'],
  durationInFrames: 180,
  posterFrame: 118,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
