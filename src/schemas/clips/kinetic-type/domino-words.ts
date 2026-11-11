import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const DOMINO_WORD_FONTS = ['geometric', 'condensed', 'rounded'] as const;

export const DOMINO_WORD_LOOKS = ['outline', 'tile', 'neon'] as const;

export const DOMINO_PUSHER_STYLES = ['striped', 'solid', 'glow'] as const;

export type DominoWordFont = (typeof DOMINO_WORD_FONTS)[number];

export type DominoWordLook = (typeof DOMINO_WORD_LOOKS)[number];

export type DominoPusherStyle = (typeof DOMINO_PUSHER_STYLES)[number];

export const dominoWordsSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  headline: zMultiline(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    text: zColor(),
    background: zColor(),
    surface: zColor(),
    idle: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  words: z.object({
    font: z.enum(DOMINO_WORD_FONTS),
    look: z.enum(DOMINO_WORD_LOOKS),
    caps: z.boolean(),
    size: zSlider({ min: 60, max: 200 }),
    growth: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    letters: zSlider({ min: 4, max: 16 }),
    spacing: zSlider({ min: 0.25, max: 0.75, step: 0.01 }),
    padding: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    outline: zSlider({ min: 0, max: 8, step: 0.25 }),
    firstLit: z.boolean(),
    lightFrames: zSlider({ min: 1, max: 20 }),
    glow: zSlider({ min: 0, max: 2, step: 0.05 }),
  }),
  pusher: z.object({
    show: z.boolean(),
    style: z.enum(DOMINO_PUSHER_STYLES),
    radius: zSlider({ min: 24, max: 120 }),
    rebound: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  floor: z.object({
    y: zSlider({ min: 900, max: 1500 }),
    thickness: zSlider({ min: 1, max: 14, step: 0.5 }),
    glow: zSlider({ min: 0, max: 2, step: 0.05 }),
    trail: z.boolean(),
    reflection: zSlider({ min: 0, max: 0.6, step: 0.01 }),
    reflectionDepth: zSlider({ min: 80, max: 600 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  camera: z.object({
    frontAt: zSlider({ min: 0.2, max: 0.7, step: 0.01 }),
    pullDelay: zSlider({ min: -30, max: 30 }),
    pullFrames: zSlider({ min: 20, max: 90 }),
    margin: zSlider({ min: 0, max: 200 }),
  }),
  timing: z.object({
    hitAt: zSlider({ min: 20, max: 120 }),
    chainFrames: zSlider({ min: 40, max: 160 }),
    lastFrames: zSlider({ min: 16, max: 80 }),
    settle: zSlider({ min: 0, max: 8, step: 0.25 }),
  }),
  brand: z.object({
    top: zSlider({ min: 40, max: 400 }),
    logoHeight: zSlider({ min: 48, max: 200 }),
    nameSize: zSlider({ min: 24, max: 90 }),
    plate: z.boolean(),
    footerSize: zSlider({ min: 16, max: 48 }),
  }),
});

export type DominoWordsProps = z.infer<typeof dominoWordsSchema>;

export const dominoWordsDefaults: DominoWordsProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#3cf2c0',
    secondary: '#ffa53a',
    text: '#fbf3e4',
    background: '#161a3a',
    surface: '#fbf3e4',
    idle: '#868cc4',
    backgroundEdge: '#04050d',
  },
  showBackground: true,
  words: {
    font: 'geometric',
    look: 'outline',
    caps: true,
    size: 132,
    growth: 0.15,
    letters: 11,
    spacing: 0.32,
    padding: 0.13,
    outline: 2.75,
    firstLit: true,
    lightFrames: 6,
    glow: 0.85,
  },
  pusher: { show: true, style: 'striped', radius: 56, rebound: 0.35 },
  floor: {
    y: 1240,
    thickness: 4,
    glow: 0.9,
    trail: false,
    reflection: 0.22,
    reflectionDepth: 360,
    shadow: 0,
  },
  camera: { frontAt: 0.4, pullDelay: -6, pullFrames: 54, margin: 72 },
  timing: { hitAt: 63, chainFrames: 96, lastFrames: 44, settle: 3 },
  brand: { top: 120, logoHeight: 150, nameSize: 46, plate: true, footerSize: 30 },
};

export const dominoWordsMeta: ClipMeta = {
  id: 'domino-words',
  title: 'Domino Words',
  description:
    'A striped ball rolls along a glowing amber floor and knocks over a row of hollow upright words that fill in as they topple like dominoes, the camera following the chain until the last word lands flat in your Primary color and the camera pulls back over the whole fallen sentence, with your logo and name at the top.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/domino-words.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'drop', 'camera-move', 'zoom', 'glow'],
  durationInFrames: 315,
  posterFrame: 300,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
};
