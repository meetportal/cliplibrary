import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const CHALK_GRID_WORD_COUNT = 10;

export const chalkBadgeGridSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  words: z.array(z.string()).min(CHALK_GRID_WORD_COUNT).max(CHALK_GRID_WORD_COUNT),
  colors: z.object({
    primary: zColor(),
    warm: zColor(),
    pink: zColor(),
    secondary: zColor(),
    accent: zColor(),
    highlight: zColor(),
    chalk: zColor(),
    ink: zColor(),
    plate: zColor(),
    board: zColor(),
    boardEdge: zColor(),
    grid: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.object({
    spreadX: zSlider({ min: 0.8, max: 1.1, step: 0.01 }),
    spreadY: zSlider({ min: 0.8, max: 1.1, step: 0.01 }),
    scale: zSlider({ min: 0.75, max: 1.2, step: 0.01 }),
  }),
  logoBadge: z.object({
    height: zSlider({ min: 60, max: 150, step: 2 }),
    showPlate: z.boolean(),
  }),
  ornaments: z.object({
    show: z.boolean(),
    twinkle: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  board: z.object({
    gridSize: zSlider({ min: 60, max: 300, step: 4 }),
    gridOpacity: zSlider({ min: 0, max: 1, step: 0.05 }),
    smudge: zSlider({ min: 0, max: 1, step: 0.05 }),
    grain: zSlider({ min: 0, max: 1, step: 0.05 }),
    lightDrift: zSlider({ min: 0, max: 500, step: 10 }),
  }),
  motion: z.object({
    drawSeconds: zSlider({ min: 0.5, max: 1.3, step: 0.05 }),
    stagger: zSlider({ min: 0, max: 5, step: 1 }),
    eraseAtEnd: z.boolean(),
  }),
});

export type ChalkBadgeGridProps = z.infer<typeof chalkBadgeGridSchema>;

export const chalkBadgeGridDefaults: ChalkBadgeGridProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  words: [
    '{{Word 1}}',
    '{{Word 2}}',
    '{{Word 3}}',
    '{{Word 4}}',
    '{{Word 5}}',
    '{{Word 6}}',
    '{{Word 7}}',
    '{{Word 8}}',
    '{{Word 9}}',
    '{{Word 10}}',
  ],
  colors: {
    primary: '#ec7a62',
    warm: '#f0a882',
    pink: '#eea6c0',
    secondary: '#c0b2ea',
    accent: '#a9d3e8',
    highlight: '#e9d27c',
    chalk: '#eef5ee',
    ink: '#272a26',
    plate: '#f6f4ec',
    board: '#36524a',
    boardEdge: '#1a312b',
    grid: '#567269',
  },
  showBackground: true,
  layout: { spreadX: 1, spreadY: 1, scale: 1 },
  logoBadge: { height: 128, showPlate: true },
  ornaments: { show: true, twinkle: 0.7 },
  board: { gridSize: 144, gridOpacity: 0.5, smudge: 0.6, grain: 0.55, lightDrift: 300 },
  motion: { drawSeconds: 1, stagger: 3, eraseAtEnd: true },
};

export const chalkBadgeGridMeta: ClipMeta = {
  id: 'chalk-badge-grid',
  title: 'Chalk Badge Grid',
  description:
    'A sticker sheet of twelve chalk-lettered badges on a gridded green chalkboard: your logo and name on a ribbon land first, then ten words chalk in, each in its own style of script, tape, burst, ring, bubble or arrow, hold with twinkling sparkles and wipe clean.',
  theme: 'dark',
  source: 'src/compositions/scenes/hand-drawn/chalk-badge-grid.tsx',
  category: 'hand-drawn',
  tags: ['chalkboard', 'handwriting', 'badge', 'grid', 'draw', 'texture', 'logo', 'wipe'],
  durationInFrames: 210,
  posterFrame: 120,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
