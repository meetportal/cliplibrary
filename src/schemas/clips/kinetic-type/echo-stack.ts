import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const ECHO_STACK_FONTS = ['figtree', 'montserrat', 'inter-tight'] as const;

export type EchoStackFont = (typeof ECHO_STACK_FONTS)[number];

export const echoStackSchema = z.object({
  line: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(ECHO_STACK_FONTS),
    size: zSlider({ min: 48, max: 180, step: 2 }),
    caps: z.boolean(),
    tracking: zSlider({ min: -0.04, max: 0.16, step: 0.01 }),
    maxWidth: zSlider({ min: 600, max: 1760, step: 10 }),
  }),
  stack: z.object({
    lines: zSlider({ min: 3, max: 9, step: 2 }),
    spacing: zSlider({ min: 1.05, max: 1.8, step: 0.01 }),
    echoOpacity: zSlider({ min: 0.2, max: 1, step: 0.05 }),
  }),
  band: z.object({
    show: z.boolean(),
    padding: zSlider({ min: 0.08, max: 0.3, step: 0.01 }),
    radius: zSlider({ min: 0, max: 0.5, step: 0.01 }),
    pulse: zSlider({ min: 0, max: 0.08, step: 0.005 }),
    breath: zSlider({ min: 0, max: 0.05, step: 0.005 }),
  }),
  motion: z.object({
    startDelay: zSlider({ min: 0, max: 20 }),
    stagger: zSlider({ min: 1, max: 6 }),
    rise: zSlider({ min: 0, max: 120, step: 2 }),
    riseFrames: zSlider({ min: 6, max: 30 }),
    exitFrames: zSlider({ min: 6, max: 20 }),
    exitDrop: zSlider({ min: 0, max: 80, step: 2 }),
    exitBlur: zSlider({ min: 0, max: 30 }),
    endHold: zSlider({ min: 10, max: 60 }),
    drift: zSlider({ min: 0, max: 30 }),
  }),
});

export type EchoStackProps = z.infer<typeof echoStackSchema>;

export const echoStackDefaults: EchoStackProps = {
  line: '{{Company Name}} {{Tagline}}',
  colors: {
    primary: '#ff5b2e',
    text: '#ebebe8',
    background: '#151515',
    backgroundEdge: '#060606',
  },
  showBackground: true,
  type: { font: 'figtree', size: 112, caps: true, tracking: 0, maxWidth: 1680 },
  stack: { lines: 7, spacing: 1.24, echoOpacity: 1 },
  band: { show: true, padding: 0.17, radius: 0.12, pulse: 0.04, breath: 0.02 },
  motion: {
    startDelay: 4,
    stagger: 3,
    rise: 48,
    riseFrames: 14,
    exitFrames: 9,
    exitDrop: 36,
    exitBlur: 14,
    endHold: 36,
    drift: 12,
  },
};

export const echoStackMeta: ClipMeta = {
  id: 'echo-stack',
  title: 'Echo Stack',
  description:
    'Your name and a word on a Primary band hold the centre while white echoes of the line cascade in above and below until they fill the frame, drift as a wall, then slide down and blur away top to bottom, leaving the band.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/echo-stack.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'repeat', 'stack', 'minimal'],
  durationInFrames: 150,
  posterFrame: 64,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
