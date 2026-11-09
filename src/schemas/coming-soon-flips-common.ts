import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import type { ClipMeta, ClipVariant } from './registry';

export const FLIP_WORD_FONTS = ['antonio', 'anton', 'bebas', 'big-shoulders', 'oswald'] as const;

export const FLIP_FLICKER_FONTS = [
  'main',
  'serif',
  'didone',
  'marker',
  'brush',
  'hand',
  'thin',
  'light',
  'fat-face',
] as const;

export const FLIP_TITLE_FONTS = ['extended', 'grotesk', 'serif', 'condensed'] as const;

export const FLIP_NAME_FONTS = ['rounded', 'grotesk', 'serif', 'condensed'] as const;

export const FLIP_PLATES = ['primary', 'background'] as const;

export const FLIP_OUTLINED = ['top', 'bottom', 'none'] as const;

export type FlipWordFont = (typeof FLIP_WORD_FONTS)[number];

export type FlipFlickerFont = (typeof FLIP_FLICKER_FONTS)[number];

export type FlipTitleFont = (typeof FLIP_TITLE_FONTS)[number];

export type FlipNameFont = (typeof FLIP_NAME_FONTS)[number];

export const flipWordSchema = z.object({
  text: z.string(),
  plate: z.enum(FLIP_PLATES),
  frames: zSlider({ min: 4, max: 90 }),
  flicker: z.boolean(),
});

export type FlipWord = z.infer<typeof flipWordSchema>;

export const comingSoonFlipsSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  words: z.array(flipWordSchema).min(1).max(12),
  colors: z.object({
    primary: zColor(),
    background: zColor(),
    text: zColor(),
    wall: zColor(),
    wallShade: zColor(),
    speck: zColor(),
    name: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(FLIP_WORD_FONTS),
    size: zSlider({ min: 80, max: 320, step: 2 }),
    tracking: zSlider({ min: -0.05, max: 0.3, step: 0.005 }),
    y: zSlider({ min: 0.2, max: 0.8, step: 0.005 }),
    flickerFonts: z.array(z.enum(FLIP_FLICKER_FONTS)).min(1).max(24),
    flickerHold: zSlider({ min: 1, max: 8 }),
  }),
  underline: z.object({
    show: z.boolean(),
    width: zSlider({ min: 0.05, max: 1.2, step: 0.01 }),
    startWidth: zSlider({ min: 0, max: 1, step: 0.01 }),
    thickness: zSlider({ min: 2, max: 40 }),
    gap: zSlider({ min: 0, max: 160 }),
  }),
  title: z.object({
    top: z.string(),
    bottom: z.string(),
    font: z.enum(FLIP_TITLE_FONTS),
    topSize: zSlider({ min: 40, max: 260, step: 2 }),
    bottomSize: zSlider({ min: 40, max: 360, step: 2 }),
    tracking: zSlider({ min: -0.05, max: 0.3, step: 0.005 }),
    gap: zSlider({ min: 0, max: 120 }),
    outlined: z.enum(FLIP_OUTLINED),
    outline: zSlider({ min: 1, max: 12, step: 0.5 }),
    y: zSlider({ min: 0.04, max: 0.9, step: 0.005 }),
    spread: zSlider({ min: 1, max: 3, step: 0.05 }),
    settleFrames: zSlider({ min: 4, max: 90 }),
    appearFrames: zSlider({ min: 0, max: 40 }),
    flickerFrames: zSlider({ min: 0, max: 30 }),
    seed: zSlider({ min: 1, max: 99 }),
  }),
  lockup: z.object({
    y: zSlider({ min: 0.15, max: 0.85, step: 0.005 }),
    logoSize: zSlider({ min: 120, max: 640, step: 4 }),
    logoMaxWidth: zSlider({ min: 200, max: 960, step: 4 }),
    plate: z.boolean(),
    platePadding: zSlider({ min: 0, max: 80 }),
    nameFont: z.enum(FLIP_NAME_FONTS),
    nameSize: zSlider({ min: 24, max: 140, step: 2 }),
    nameGap: zSlider({ min: 0, max: 160 }),
  }),
  wall: z.object({
    blotchScale: zSlider({ min: 0.002, max: 0.03, step: 0.0005 }),
    blotchAmount: zSlider({ min: 0, max: 1, step: 0.01 }),
    speckAmount: zSlider({ min: 0, max: 1, step: 0.01 }),
    seed: zSlider({ min: 1, max: 99 }),
  }),
  light: z.object({
    angle: zSlider({ min: 0, max: 180 }),
    slats: zSlider({ min: 1, max: 6 }),
    slatGap: zSlider({ min: 40, max: 600 }),
    softness: zSlider({ min: 20, max: 300 }),
    strength: zSlider({ min: 0.4, max: 1.6, step: 0.05 }),
    restWidth: zSlider({ min: 100, max: 900, step: 10 }),
    titleMargin: zSlider({ min: 0, max: 300 }),
    sweepFrames: zSlider({ min: 12, max: 120 }),
    swing: zSlider({ min: 0.1, max: 1, step: 0.05 }),
    settleFrames: zSlider({ min: 12, max: 120 }),
  }),
  flashFrames: zSlider({ min: 0, max: 8 }),
  grain: zSlider({ min: 0, max: 0.3, step: 0.01 }),
});

export type ComingSoonFlipsProps = z.infer<typeof comingSoonFlipsSchema>;

export const flipWord = (
  text: string,
  plate: FlipWord['plate'],
  frames: number,
  flicker = false,
): FlipWord => ({ text, plate, frames, flicker });

export const COMING_SOON_WORDS = (first: FlipWord['plate'], second: FlipWord['plate']) => [
  flipWord('HOLD', first, 26),
  flipWord('YOUR', second, 27),
  flipWord('BREATH', first, 23),
  flipWord('BREATH', second, 33, true),
  flipWord("WHAT'S", first, 21),
  flipWord('NEXT', second, 26),
  flipWord('IS', first, 27),
  flipWord('LANDING', second, 24),
];

export const comingSoonFlipsMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'kinetic-type',
  tags: ['kinetic', 'text', 'headline', 'flip', 'outline', 'reveal', 'logo', 'texture', 'end-card'],
  durationInFrames: 360,
  posterFrame: 350,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'coming-soon-flips',
  variant,
});
