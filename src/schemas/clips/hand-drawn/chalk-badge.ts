import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const CHALK_SCRIPTS = ['kaushan', 'yellowtail', 'pacifico', 'damion'] as const;
export type ChalkScript = (typeof CHALK_SCRIPTS)[number];

export const chalkBadgeSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    chalk: zColor(),
    board: zColor(),
    boardEdge: zColor(),
    grid: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  word: z.object({
    font: z.enum(CHALK_SCRIPTS),
    size: zSlider({ min: 90, max: 280, step: 2 }),
    maxWidth: zSlider({ min: 600, max: 1600, step: 10 }),
    rise: zSlider({ min: -200, max: 200, step: 2 }),
  }),
  caption: z.object({
    size: zSlider({ min: 16, max: 44, step: 1 }),
    tracking: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    top: zSlider({ min: 40, max: 260, step: 2 }),
  }),
  swoosh: z.object({
    show: z.boolean(),
    loop: z.boolean(),
    thickness: zSlider({ min: 0.03, max: 0.12, step: 0.005 }),
  }),
  sparkles: z.object({
    show: z.boolean(),
    size: zSlider({ min: 0.5, max: 2, step: 0.05 }),
    twinkle: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  lockup: z.object({
    show: z.boolean(),
    height: zSlider({ min: 60, max: 200, step: 2 }),
    bottom: zSlider({ min: 60, max: 360, step: 2 }),
    showPlate: z.boolean(),
  }),
  board: z.object({
    gridSize: zSlider({ min: 60, max: 300, step: 4 }),
    gridOpacity: zSlider({ min: 0, max: 1, step: 0.05 }),
    smudge: zSlider({ min: 0, max: 1, step: 0.05 }),
    grain: zSlider({ min: 0, max: 1, step: 0.05 }),
    dust: zSlider({ min: 0, max: 2, step: 0.1 }),
    lightDrift: zSlider({ min: 0, max: 500, step: 10 }),
  }),
  motion: z.object({
    writeSeconds: zSlider({ min: 0.4, max: 2, step: 0.05 }),
    eraseAtEnd: z.boolean(),
  }),
});

export type ChalkBadgeProps = z.infer<typeof chalkBadgeSchema>;

export const chalkBadgeDefaults: ChalkBadgeProps = {
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#f2a4bc',
    chalk: '#e9f0ea',
    board: '#2b463f',
    boardEdge: '#192f2a',
    grid: '#55716a',
    plate: '#f7f6f1',
  },
  showBackground: true,
  word: { font: 'kaushan', size: 190, maxWidth: 1240, rise: 0 },
  caption: { size: 26, tracking: 0.16, top: 92 },
  swoosh: { show: true, loop: true, thickness: 0.06 },
  sparkles: { show: true, size: 1, twinkle: 0.6 },
  lockup: { show: true, height: 118, bottom: 176, showPlate: true },
  board: { gridSize: 144, gridOpacity: 0.55, smudge: 0.6, grain: 0.6, dust: 1, lightDrift: 320 },
  motion: { writeSeconds: 0.9, eraseAtEnd: true },
};

export const chalkBadgeMeta: ClipMeta = {
  id: 'chalk-badge',
  title: 'Chalk Badge',
  description:
    'Your name is written in brush chalk on a gridded green chalkboard, underlined with a swoosh that curls into a loop, winked at by two sparkles in your colour, signed with your logo, then wiped clean.',
  theme: 'dark',
  source: 'src/compositions/scenes/hand-drawn/chalk-badge.tsx',
  category: 'hand-drawn',
  tags: ['chalkboard', 'handwriting', 'badge', 'draw', 'texture', 'logo', 'wipe', 'grid'],
  durationInFrames: 180,
  posterFrame: 110,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
