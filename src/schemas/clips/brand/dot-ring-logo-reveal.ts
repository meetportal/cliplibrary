import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const DOT_RING_HANDOFFS = ['bloom', 'plate', 'frame'] as const;

export const DOT_RING_FONTS = ['poppins', 'outfit', 'sora', 'instrument-serif'] as const;

export type DotRingFont = (typeof DOT_RING_FONTS)[number];

export const dotRingLogoRevealSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    ring: zColor(),
    background: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  ring: z.object({
    handoff: z.enum(DOT_RING_HANDOFFS),
    size: zSlider({ min: 200, max: 560, step: 2 }),
    thickness: zSlider({ min: 12, max: 60 }),
    frameThickness: zSlider({ min: 2, max: 40 }),
  }),
  logoBox: z.object({
    width: zSlider({ min: 200, max: 960, step: 4 }),
    height: zSlider({ min: 120, max: 640, step: 4 }),
    padding: zSlider({ min: 0, max: 160, step: 2 }),
    roundness: zSlider({ min: 0, max: 100 }),
  }),
  name: z.object({
    font: z.enum(DOT_RING_FONTS),
    size: zSlider({ min: 48, max: 200, step: 2 }),
    tracking: zSlider({ min: -0.08, max: 0.2, step: 0.005 }),
    gap: zSlider({ min: 24, max: 240, step: 2 }),
    stopSize: zSlider({ min: 0.1, max: 0.4, step: 0.01 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -500, max: 500, step: 2 }),
  }),
  timing: z.object({
    start: zSlider({ min: 0, max: 24 }),
    ringFrames: zSlider({ min: 18, max: 40 }),
    pause: zSlider({ min: 0, max: 6 }),
    nameFrames: zSlider({ min: 14, max: 36 }),
  }),
});

export type DotRingLogoRevealProps = z.infer<typeof dotRingLogoRevealSchema>;

export const dotRingLogoRevealDefaults: DotRingLogoRevealProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  colors: {
    primary: '#ff59b6',
    text: '#1d1b19',
    ring: '#1d1b19',
    background: '#faf7f2',
    plate: '#efe9df',
  },
  showBackground: true,
  ring: { handoff: 'frame', size: 380, thickness: 32, frameThickness: 9 },
  logoBox: { width: 760, height: 320, padding: 36, roundness: 100 },
  name: { font: 'outfit', size: 124, tracking: -0.015, gap: 88, stopSize: 0.22 },
  layout: { offsetY: -40 },
  timing: { start: 24, ringFrames: 28, pause: 2, nameFrames: 24 },
};

export const dotRingLogoRevealMeta: ClipMeta = {
  id: 'dot-ring-logo-reveal',
  title: 'Dot Ring Logo Reveal',
  description:
    'A pink dot draws a thick ring that slims into a fine badge outline around your logo, then writes your name underneath and rests as its full stop.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-ring-logo-reveal.tsx',
  category: 'brand',
  tags: ['logo', 'reveal', 'draw', 'minimal', 'end-card'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-06-pinterest-logo-reveals',
};
