import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

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

const MAGNIFIER_CAPTION_DECOYS = [
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

export const magnifierCaptionDefaults: MagnifierCaptionProps = {
  headline: '{{Headline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  colors: {
    primary: '#ffad42',
    text: '#f4efe4',
    secondary: '#5a6ca6',
    background: '#070a18',
    surface: '#f4efe4',
    rim: '#f0d5a0',
    glow: '#d4e2ff',
    glass: '#0c1332',
    handle: '#1b2452',
    spotlight: '#18224d',
  },
  showBackground: true,
  caption: { top: 270, keyword: 'underline', flyWords: false, typing: 2.5 },
  type: {
    caption: 'bodoni',
    body: 'inter',
    captionSize: 74,
    cellSize: 52,
    nameSize: 44,
    websiteSize: 28,
  },
  cells: {
    shape: 'hexagon',
    words: MAGNIFIER_CAPTION_DECOYS,
    blur: 7,
    size: 150,
    spread: 2,
    seed: 7,
  },
  lens: {
    radius: 250,
    magnify: 1,
    x: 540,
    y: 930,
    tilt: -12,
    handle: 300,
    rimWidth: 9,
    glint: 0.55,
    sway: 1,
  },
  timing: { firstWord: 36, lastWord: 315, returnAt: 393, returnFrames: 42, glide: 2.5 },
  brand: { plate: true, logoWidth: 300, logoHeight: 150, y: 1640 },
};

export const magnifierCaptionMeta: ClipMeta = {
  id: 'magnifier-caption',
  title: 'Magnifier Caption',
  description:
    'A gold-rimmed magnifying glass glides over a blurred navy honeycomb of words; each word under the lens lights up as a Bodoni caption types in, ending on an amber underlined keyword above your logo, name and website.',
  source: 'src/compositions/scenes/text-reveals/magnifier-caption.tsx',
  theme: 'dark',
  category: 'text-reveals',
  tags: ['text', 'typing', 'glow', 'reveal', 'logo'],
  durationInFrames: 450,
  posterFrame: 372,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
};
