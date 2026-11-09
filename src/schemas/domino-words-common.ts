import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from './control';
import type { ClipMeta, ClipVariant } from './registry';

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

export const dominoWordsMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'drop', 'camera-move', 'zoom', 'glow'],
  durationInFrames: 315,
  posterFrame: 300,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'domino-words',
  variant,
});
