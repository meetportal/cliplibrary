import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const CHALK_TITLE_SCRIPTS = ['kaushan', 'yellowtail', 'pacifico', 'damion'] as const;
export type ChalkTitleScript = (typeof CHALK_TITLE_SCRIPTS)[number];

export const CHALK_TITLE_AMPERSANDS = ['playfair', 'abril', 'dm-serif', 'lobster'] as const;
export type ChalkTitleAmpersand = (typeof CHALK_TITLE_AMPERSANDS)[number];

export const chalkTitleSchema = z.object({
  titleStart: z.string(),
  titleEnd: z.string(),
  caption: z.string(),
  colors: z.object({
    primary: zColor(),
    chalk: zColor(),
    board: zColor(),
    boardEdge: zColor(),
    grid: zColor(),
  }),
  showBackground: z.boolean(),
  title: z.object({
    font: z.enum(CHALK_TITLE_SCRIPTS),
    size: zSlider({ min: 80, max: 220, step: 2 }),
    gap: zSlider({ min: 0, max: 160, step: 2 }),
    raiseEnd: zSlider({ min: -60, max: 60, step: 1 }),
    offsetY: zSlider({ min: -300, max: 300, step: 2 }),
  }),
  ampersand: z.object({
    font: z.enum(CHALK_TITLE_AMPERSANDS),
    size: zSlider({ min: 140, max: 420, step: 2 }),
    dropLine: z.boolean(),
  }),
  byline: z.object({
    show: z.boolean(),
    size: zSlider({ min: 18, max: 56, step: 1 }),
    tracking: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    gap: zSlider({ min: 20, max: 220, step: 2 }),
    uppercase: z.boolean(),
  }),
  sparkles: z.object({
    show: z.boolean(),
    size: zSlider({ min: 0.5, max: 2, step: 0.05 }),
    twinkle: zSlider({ min: 0, max: 1, step: 0.05 }),
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
    writeSeconds: zSlider({ min: 0.4, max: 1, step: 0.05 }),
    eraseAtEnd: z.boolean(),
    smear: zSlider({ min: 0, max: 0.3, step: 0.01 }),
  }),
});

export type ChalkTitleProps = z.infer<typeof chalkTitleSchema>;

export const chalkTitleDefaults: ChalkTitleProps = {
  titleStart: '{{Title Start}}',
  titleEnd: '{{Title End}}',
  caption: '{{Company Name}}',
  colors: {
    primary: '#e8c25a',
    chalk: '#ecf3ef',
    board: '#2e4a42',
    boardEdge: '#1b312b',
    grid: '#5a756e',
  },
  showBackground: true,
  title: { font: 'kaushan', size: 132, gap: 64, raiseEnd: 12, offsetY: 0 },
  ampersand: { font: 'playfair', size: 300, dropLine: true },
  byline: { show: true, size: 30, tracking: 0.24, gap: 96, uppercase: true },
  sparkles: { show: true, size: 1, twinkle: 0.6 },
  board: { gridSize: 144, gridOpacity: 0.55, smudge: 0.45, grain: 0.55, dust: 1, lightDrift: 380 },
  motion: { writeSeconds: 0.65, eraseAtEnd: true, smear: 0.06 },
};

export const chalkTitleMeta: ClipMeta = {
  id: 'chalk-title',
  title: 'Chalk Title',
  description:
    'Two words joined by a big ampersand are written one piece at a time in chalk on a gridded green board, crowned by three sparkles in your colour and signed with your name, then erased right to left.',
  theme: 'dark',
  source: 'src/compositions/scenes/hand-drawn/chalk-title.tsx',
  category: 'hand-drawn',
  tags: ['chalkboard', 'handwriting', 'headline', 'draw', 'texture', 'wipe', 'grid', 'text'],
  durationInFrames: 150,
  posterFrame: 100,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
