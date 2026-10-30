import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

const frames = (max = 165) => zSlider({ min: 0, max });

const size = () => zSlider({ min: 0.5, max: 1.5, step: 0.01 });

export const elevatorNewspaperSchema = z.object({
  masthead: z.object({
    brand: z.string(),
    edition: z.string(),
    date: z.string(),
  }),
  cover: z.object({
    headline: zMultiline(),
    headlineSize: size(),
    photo: zImage(),
    photoTint: unit(),
  }),
  story: z.object({
    headline: zMultiline(),
    headlineSize: size(),
    subhead: z.string(),
    teaserTitle: zMultiline(),
    teaser: zMultiline(),
    photo: zImage(),
    caption: zMultiline(),
    footer: z.string(),
  }),
  ink: z.object({
    text: zColor(),
    accent: zColor(),
    coverText: zColor(),
    tint: zColor(),
    rules: zColor(),
    filler: zColor(),
  }),
  print: z.object({
    strength: unit(),
    shading: unit(),
    softness: unit(2, 0.05),
  }),
  camera: z.object({
    zoom: zSlider({ min: 1, max: 2.6, step: 0.01 }),
    creep: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    focusX: zSlider({ min: 0, max: 1080 }),
    focusY: zSlider({ min: 0, max: 1920 }),
    pushStart: frames(),
    pushFrames: zSlider({ min: 1, max: 120 }),
    pullStart: frames(),
    pullFrames: zSlider({ min: 1, max: 120 }),
  }),
  motion: motionSchema,
});

export type ElevatorNewspaperProps = z.infer<typeof elevatorNewspaperSchema>;

export const elevatorNewspaperDefaults: ElevatorNewspaperProps = {
  masthead: {
    brand: 'MAREN & CO',
    edition: 'THE OPENING ISSUE',
    date: 'JUNE 12',
  },
  cover: {
    headline: 'COMING\nSOON',
    headlineSize: 1,
    photo: 'footage/elevator-newspaper/ring-hand.jpg',
    photoTint: 0.18,
  },
  story: {
    headline: 'NEW STORE',
    headlineSize: 1,
    subhead: 'FINE JEWELRY FOR EVERYDAY RITUALS',
    teaserTitle: "DON'T\nMISS OUT",
    teaser: 'Doors open on\nJune 12 with gifts\nfor the first\nhundred guests.',
    photo: 'footage/elevator-newspaper/boutique.jpg',
    caption: 'OUR NEW HOME\nON RUE CLEMENT',
    footer: 'STAY TUNED',
  },
  ink: {
    text: '#1c1a1a',
    accent: '#7a1f2b',
    coverText: '#fbf4ec',
    tint: '#3d0f1d',
    rules: '#1c1a1a',
    filler: '#8b8682',
  },
  print: {
    strength: 0.94,
    shading: 1,
    softness: 0.6,
  },
  camera: {
    zoom: 1.8,
    creep: 0.08,
    focusX: 548,
    focusY: 870,
    pushStart: 28,
    pushFrames: 44,
    pullStart: 106,
    pullFrames: 28,
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const elevatorNewspaperMeta: ClipMeta = {
  ...promoMeta,
  fps: 24,
  width: 1080,
  height: 1920,
  id: 'elevator-newspaper',
  title: 'Elevator Newspaper',
  description:
    'Elevator doors slide open on a woman hiding behind an open newspaper whose coming soon cover and new store page carry your own copy, the camera pushes in to read it, then eases out as the doors close.',
  category: 'ad-reveals',
  tags: ['footage', 'paper', 'reveal', 'headline', 'camera-move'],
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/elevator-newspaper.tsx',
  durationInFrames: 166,
  posterFrame: 84,
};
