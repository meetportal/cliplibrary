import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from './control';
import type { ClipMeta, ClipVariant } from './registry';
import type { ClipTheme } from './taxonomy';

export const MAGNIFIER_CAPTION_FONTS = ['bodoni', 'inter-tight', 'fraunces'] as const;

export type MagnifierCaptionFont = (typeof MAGNIFIER_CAPTION_FONTS)[number];

export const MAGNIFIER_BODY_FONTS = ['inter', 'manrope'] as const;

export type MagnifierBodyFont = (typeof MAGNIFIER_BODY_FONTS)[number];

export const MAGNIFIER_KEYWORD_STYLES = ['underline', 'highlight', 'plain'] as const;

export const MAGNIFIER_CELL_SHAPES = ['hexagon', 'circle'] as const;

export const magnifierCaptionSchema = z.object({
  headline: zMultiline(),
  logo: zImage(),
  companyName: z.string(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    secondary: zColor(),
    background: zColor(),
    surface: zColor(),
    rim: zColor(),
    glow: zColor(),
    glass: zColor(),
    handle: zColor(),
    spotlight: zColor(),
  }),
  showBackground: z.boolean(),
  caption: z.object({
    top: zSlider({ min: 80, max: 600, step: 2 }),
    keyword: z.enum(MAGNIFIER_KEYWORD_STYLES),
    flyWords: z.boolean(),
    typing: zSlider({ min: 0.5, max: 6, step: 0.1 }),
  }),
  type: z.object({
    caption: z.enum(MAGNIFIER_CAPTION_FONTS),
    body: z.enum(MAGNIFIER_BODY_FONTS),
    captionSize: zSlider({ min: 40, max: 110, step: 1 }),
    cellSize: zSlider({ min: 30, max: 80, step: 1 }),
    nameSize: zSlider({ min: 24, max: 72, step: 1 }),
    websiteSize: zSlider({ min: 16, max: 44, step: 1 }),
  }),
  cells: z.object({
    shape: z.enum(MAGNIFIER_CELL_SHAPES),
    words: zMultiline(),
    blur: zSlider({ min: 0, max: 20, step: 0.5 }),
    size: zSlider({ min: 100, max: 240, step: 2 }),
    spread: zSlider({ min: 1, max: 3, step: 0.05 }),
    seed: zSlider({ min: 1, max: 999 }),
  }),
  lens: z.object({
    radius: zSlider({ min: 160, max: 340, step: 2 }),
    magnify: zSlider({ min: 1, max: 1.8, step: 0.01 }),
    x: zSlider({ min: 200, max: 880, step: 2 }),
    y: zSlider({ min: 600, max: 1200, step: 2 }),
    tilt: zSlider({ min: -40, max: 40, step: 0.5 }),
    handle: zSlider({ min: 0, max: 460, step: 2 }),
    rimWidth: zSlider({ min: 2, max: 20, step: 0.5 }),
    glint: zSlider({ min: 0, max: 1, step: 0.01 }),
    sway: zSlider({ min: 0, max: 2, step: 0.05 }),
  }),
  timing: z.object({
    firstWord: zSlider({ min: 12, max: 120 }),
    lastWord: zSlider({ min: 120, max: 380 }),
    returnAt: zSlider({ min: 200, max: 410 }),
    returnFrames: zSlider({ min: 20, max: 90 }),
    glide: zSlider({ min: 0.5, max: 8, step: 0.1 }),
  }),
  brand: z.object({
    plate: z.boolean(),
    logoWidth: zSlider({ min: 120, max: 600, step: 4 }),
    logoHeight: zSlider({ min: 40, max: 200, step: 2 }),
    y: zSlider({ min: 1500, max: 1800, step: 2 }),
  }),
});

export type MagnifierCaptionProps = z.infer<typeof magnifierCaptionSchema>;

export const magnifierCaptionMeta = (
  variant: ClipVariant,
  theme: ClipTheme,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'text-reveals',
  tags: ['text', 'typing', 'glow', 'reveal', 'logo'],
  theme,
  durationInFrames: 450,
  posterFrame: 372,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'magnifier-caption',
  variant,
});

export const MAGNIFIER_CAPTION_DECOYS = [
  'Maybe',
  'Noise',
  'Later',
  'Guess',
  'Rush',
  'Someday',
  'Clutter',
  'Excuses',
  'Static',
  'Hype',
  'Detours',
  'Shortcuts',
  'Almost',
].join('\n');

export const MAGNIFIER_CAPTION_TOKENS = {
  headline: '{{Headline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
} as const;
