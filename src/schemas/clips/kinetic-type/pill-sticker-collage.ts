import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const PILL_STICKER_FONTS = ['montserrat', 'poppins', 'outfit', 'sora'] as const;

export type PillStickerFont = (typeof PILL_STICKER_FONTS)[number];

export const pillStickerCollageSchema = z.object({
  headline: zMultiline(),
  companyName: z.string(),
  website: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    glow: zColor(),
    surface: zColor(),
    ink: zColor(),
    text: zColor(),
    background: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(PILL_STICKER_FONTS),
    wordSize: zSlider({ min: 120, max: 230 }),
    nameSize: zSlider({ min: 110, max: 230 }),
    websiteSize: zSlider({ min: 56, max: 110 }),
  }),
  stickers: z.object({
    badges: zSlider({ min: 0, max: 4 }),
    tilt: zSlider({ min: 0, max: 16, step: 0.5 }),
    outline: zSlider({ min: 1, max: 8, step: 0.5 }),
    shadow: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    rowWidth: zSlider({ min: 900, max: 1740, step: 10 }),
    rowSpacing: zSlider({ min: 0.9, max: 1.5, step: 0.01 }),
    scatter: zSlider({ min: 0, max: 400, step: 5 }),
  }),
  brand: z.object({
    logoSize: zSlider({ min: 0.8, max: 1.5, step: 0.01 }),
    lift: zSlider({ min: -120, max: 120 }),
    websiteArrow: z.boolean(),
  }),
  backdrop: z.object({
    glow: zSlider({ min: 0, max: 1, step: 0.01 }),
    reach: zSlider({ min: 0.3, max: 1, step: 0.01 }),
    drift: zSlider({ min: 0, max: 1, step: 0.01 }),
    dither: zSlider({ min: 0, max: 0.12, step: 0.005 }),
  }),
  timing: z.object({
    interval: zSlider({ min: 8, max: 24 }),
    popFrames: zSlider({ min: 10, max: 30 }),
    brandPause: zSlider({ min: 0, max: 40 }),
    settleFrames: zSlider({ min: 16, max: 80, step: 2 }),
    spin: zSlider({ min: 0, max: 4, step: 0.1 }),
  }),
});

export type PillStickerCollageProps = z.infer<typeof pillStickerCollageSchema>;

export const pillStickerCollageDefaults: PillStickerCollageProps = {
  headline: '{{Headline}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ef4a5c',
    glow: '#a3303f',
    surface: '#ffffff',
    ink: '#111111',
    text: '#ffffff',
    background: '#111010',
  },
  showBackground: true,
  type: { font: 'montserrat', wordSize: 190, nameSize: 200, websiteSize: 84 },
  stickers: {
    badges: 4,
    tilt: 11,
    outline: 2.5,
    shadow: 0.35,
    rowWidth: 1740,
    rowSpacing: 1.1,
    scatter: 320,
  },
  brand: { logoSize: 1.1, lift: -20, websiteArrow: true },
  backdrop: { glow: 0.85, reach: 0.62, drift: 0.4, dither: 0.035 },
  timing: {
    interval: 14,
    popFrames: 18,
    brandPause: 4,
    settleFrames: 48,
    spin: 1.2,
  },
};

export const pillStickerCollageMeta: ClipMeta = {
  id: 'pill-sticker-collage',
  title: 'Pill Sticker Collage',
  description:
    'Your headline slaps down word by word as tilted pill and disc stickers, filled, white and outlined, mixed with arrow, starburst and hash badges, while the pile drifts up and to the right over a dark crimson glow. The drift slows to a stop as your company name lands as the biggest sticker, with your logo on a white plate and your website beside an arrow.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/pill-sticker-collage.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'stack', 'badge', 'camera-move', 'logo', 'end-card'],
  durationInFrames: 300,
  posterFrame: 258,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-19-mixed-launch-promos',
};
