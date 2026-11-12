import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const REEL_BADGE_COUNT = 6;

const spotlightIndex = () => zSlider({ min: 1, max: REEL_BADGE_COUNT, step: 1 });

export const chalkBadgesReelSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  opener: z.object({ left: z.string(), right: z.string() }),
  words: z.array(z.string()).min(REEL_BADGE_COUNT).max(REEL_BADGE_COUNT),
  endCard: z.object({
    lineOne: z.string(),
    lineTwo: z.string(),
    tagline: z.string(),
    website: z.string(),
  }),
  spotlight: z.object({
    first: spotlightIndex(),
    second: spotlightIndex(),
    third: spotlightIndex(),
  }),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    ribbon: zColor(),
    accent: zColor(),
    chalk: zColor(),
    ink: zColor(),
    plate: zColor(),
    board: zColor(),
    boardEdge: zColor(),
    grid: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.object({
    badgeScale: zSlider({ min: 0.75, max: 1.2, step: 0.01 }),
    spotlightScale: zSlider({ min: 1.4, max: 2.6, step: 0.05 }),
    headlineScale: zSlider({ min: 0.75, max: 1.15, step: 0.01 }),
    logoHeight: zSlider({ min: 60, max: 180, step: 2 }),
    showPlate: z.boolean(),
  }),
  board: z.object({
    gridSize: zSlider({ min: 60, max: 300, step: 4 }),
    gridOpacity: zSlider({ min: 0, max: 1, step: 0.05 }),
    smudge: zSlider({ min: 0, max: 1, step: 0.05 }),
    grain: zSlider({ min: 0, max: 1, step: 0.05 }),
    lightDrift: zSlider({ min: 0, max: 500, step: 10 }),
  }),
  motion: z.object({
    ornaments: z.boolean(),
    twinkle: zSlider({ min: 0, max: 1, step: 0.05 }),
    eraseAtEnd: z.boolean(),
  }),
});

export type ChalkBadgesReelProps = z.infer<typeof chalkBadgesReelSchema>;

export const chalkBadgesReelDefaults: ChalkBadgesReelProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  opener: { left: '{{Opener Left}}', right: '{{Opener Right}}' },
  words: ['{{Word 1}}', '{{Word 2}}', '{{Word 3}}', '{{Word 4}}', '{{Word 5}}', '{{Word 6}}'],
  endCard: {
    lineOne: '{{Headline Line 1}}',
    lineTwo: '{{Headline Line 2}}',
    tagline: '{{Tagline}}',
    website: '{{Website}}',
  },
  spotlight: { first: 2, second: 3, third: 4 },
  colors: {
    primary: '#ec7c64',
    secondary: '#b9a9ec',
    ribbon: '#a3cfe6',
    accent: '#f0d47c',
    chalk: '#eef3ec',
    ink: '#23282a',
    plate: '#f5f2e8',
    board: '#33524a',
    boardEdge: '#1b322c',
    grid: '#55756b',
  },
  showBackground: true,
  layout: {
    badgeScale: 1,
    spotlightScale: 2,
    headlineScale: 1,
    logoHeight: 120,
    showPlate: true,
  },
  board: { gridSize: 144, gridOpacity: 0.5, smudge: 0.3, grain: 0.5, lightDrift: 260 },
  motion: { ornaments: true, twinkle: 0.7, eraseAtEnd: true },
};

export const chalkBadgesReelMeta: ClipMeta = {
  id: 'chalk-badges-reel',
  title: 'Chalk Badges Reel',
  description:
    'A chalkboard reel: a script pair with a sparkling ampersand, a sticker sheet of six chalk badges, three of them big one at a time, then an end card with your logo, a chunky headline and your website, wiped clean for the loop.',
  theme: 'dark',
  source: 'src/compositions/scenes/hand-drawn/chalk-badges-reel.tsx',
  category: 'hand-drawn',
  tags: ['chalkboard', 'handwriting', 'badge', 'grid', 'draw', 'texture', 'logo', 'end-card'],
  durationInFrames: 450,
  posterFrame: 400,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
