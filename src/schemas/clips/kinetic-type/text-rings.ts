import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const TEXT_RING_FONTS = ['sans', 'sans-bold', 'geometric', 'serif', 'serif-italic'] as const;

export const TEXT_RING_ENTRANCES = ['fade', 'write-on'] as const;

export const TEXT_RING_MARK_ENTRANCES = ['bloom', 'iris'] as const;

export type TextRingFont = (typeof TEXT_RING_FONTS)[number];

const ringTypeSchema = z.object({
  font: z.enum(TEXT_RING_FONTS),
  caps: z.boolean(),
  tracking: zSlider({ min: -0.04, max: 0.3, step: 0.005 }),
  opacity: zSlider({ min: 0.2, max: 1, step: 0.01 }),
  usePrimary: z.boolean(),
});

export const textRingsSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  nameRings: ringTypeSchema,
  taglineRings: ringTypeSchema,
  rings: z.object({
    separator: z.string(),
    separatorGap: zSlider({ min: 0, max: 2, step: 0.05 }),
    textSize: zSlider({ min: 0.08, max: 0.22, step: 0.005 }),
    spacing: zSlider({ min: 1.15, max: 1.8, step: 0.01 }),
    count: zSlider({ min: 3, max: 14 }),
    gap: zSlider({ min: 0, max: 160, step: 2 }),
    entrance: z.enum(TEXT_RING_ENTRANCES),
    entranceFrames: zSlider({ min: 6, max: 40 }),
  }),
  spin: z.object({
    speed: zSlider({ min: 0, max: 8, step: 0.25 }),
    alternate: z.boolean(),
    clockwise: z.boolean(),
    offset: zSlider({ min: 0, max: 180 }),
  }),
  mark: z.object({
    size: zSlider({ min: 240, max: 560, step: 2 }),
    wideGrow: zSlider({ min: 0, max: 0.6, step: 0.01 }),
    stroke: zSlider({ min: 1, max: 28, step: 0.5 }),
    logoFill: zSlider({ min: 0.5, max: 0.95, step: 0.01 }),
    plate: z.boolean(),
    entrance: z.enum(TEXT_RING_MARK_ENTRANCES),
  }),
  timing: z.object({
    drawFrames: zSlider({ min: 12, max: 48 }),
    logoAt: zSlider({ min: 0, max: 60 }),
    firstRing: zSlider({ min: 6, max: 60 }),
    settleAt: zSlider({ min: 80, max: 136 }),
    settleFrames: zSlider({ min: 12, max: 40 }),
  }),
});

export type TextRingsProps = z.infer<typeof textRingsSchema>;

export const textRingsDefaults: TextRingsProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#ff6b3d',
    text: '#f4f3ef',
    background: '#050505',
    plate: '#f4f3ef',
  },
  showBackground: true,
  nameRings: { font: 'sans-bold', caps: false, tracking: 0, opacity: 1, usePrimary: false },
  taglineRings: { font: 'sans', caps: false, tracking: 0.01, opacity: 1, usePrimary: false },
  rings: {
    separator: '·',
    separatorGap: 0.5,
    textSize: 0.15,
    spacing: 1.32,
    count: 6,
    gap: 26,
    entrance: 'fade',
    entranceFrames: 16,
  },
  spin: { speed: 2.5, alternate: true, clockwise: true, offset: 17 },
  mark: { size: 360, wideGrow: 0.35, stroke: 4, logoFill: 0.84, plate: true, entrance: 'bloom' },
  timing: { drawFrames: 16, logoAt: 0, firstRing: 26, settleAt: 118, settleFrames: 36 },
};

export const textRingsMeta: ClipMeta = {
  id: 'text-rings',
  title: 'Text Rings',
  description:
    'A thin circle draws on and your logo blooms inside it, then rings of your name and tagline grow out and spin in alternate directions until the frame fills with a vortex that settles and keeps turning.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/text-rings.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'text', 'repeat', 'spin', 'orbit', 'logo'],
  durationInFrames: 180,
  posterFrame: 165,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
};
