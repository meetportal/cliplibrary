import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

const frames = (max = 263) => zSlider({ min: 0, max });

const length = (max = 120) => zSlider({ min: 1, max });

const size = () => zSlider({ min: 0.5, max: 1.5, step: 0.01 });

const photoCrop = {
  photo: zImage(),
  photoFocus: unit(),
  photoZoom: zSlider({ min: 1, max: 2.5, step: 0.01 }),
};

export const comingSoonNewspaperSchema = z.object({
  leftPage: z.object({
    brand: z.string(),
    dateline: z.string(),
    headline: zMultiline(),
    headlineSize: size(),
    ...photoCrop,
    kicker: z.string(),
    body: zMultiline(),
  }),
  rightPage: z.object({
    nameplate: z.string(),
    dateline: z.string(),
    headline: zMultiline(),
    headlineSize: size(),
    ...photoCrop,
    body: zMultiline(),
    footer: z.string(),
  }),
  photos: z.object({
    contrast: zSlider({ min: 0.5, max: 2.5, step: 0.01 }),
    brightness: zSlider({ min: 0.5, max: 1.5, step: 0.01 }),
    grain: unit(),
  }),
  ink: z.object({
    text: zColor(),
    headline: zColor(),
    photo: zColor(),
    paper: zColor(),
  }),
  print: z.object({
    strength: unit(),
    shading: unit(),
    softness: unit(2, 0.05),
    paperTint: unit(),
    fadeStart: zSlider({ min: 60, max: 119 }),
    fadeFrames: zSlider({ min: 1, max: 40 }),
  }),
  wordmark: z.object({
    brand: z.string(),
    second: z.string(),
    size: zSlider({ min: 30, max: 200 }),
    secondSize: zSlider({ min: 0.3, max: 1.2, step: 0.01 }),
    tracking: unit(0.8),
    gap: zSlider({ min: 0, max: 160 }),
    ruleHeight: zSlider({ min: 0, max: 240 }),
    offsetY: zSlider({ min: -600, max: 600 }),
    color: zColor(),
    ruleColor: zColor(),
    start: frames(),
    fadeFrames: length(60),
    rise: zSlider({ min: 0, max: 120 }),
  }),
  dim: z.object({
    color: zColor(),
    amount: unit(),
    start: frames(),
    frames: length(),
  }),
  camera: z.object({
    zoom: zSlider({ min: 1, max: 1.6, step: 0.01 }),
    creep: zSlider({ min: 0, max: 0.2, step: 0.01 }),
    focusX: zSlider({ min: 0, max: 1080 }),
    focusY: zSlider({ min: 0, max: 1920 }),
    pushStart: frames(),
    pushFrames: length(),
    pullStart: frames(),
    pullFrames: length(),
  }),
  motion: motionSchema,
});

export type ComingSoonNewspaperProps = z.infer<typeof comingSoonNewspaperSchema>;

const LEFT_BODY =
  'Pieces cut from washed linen and soft wool, made to be worn on a Tuesday as much as on a Sunday. ' +
  'A small collection, finished slowly, and ready for the season ahead.';

const RIGHT_BODY =
  'The first collection arrives this spring. Join the list to see it before anyone else and to hear when the doors open.';

export const comingSoonNewspaperDefaults: ComingSoonNewspaperProps = {
  leftPage: {
    brand: 'AVELINE',
    dateline: 'NO. 01  /  THE SPRING ISSUE  /  PARIS',
    headline: 'A NEW ERA OF\nEVERYDAY IS\nABOUT TO BEGIN',
    headlineSize: 1,
    photo: 'footage/coming-soon-newspaper/campaign-photo.jpg',
    photoFocus: 0.55,
    photoZoom: 1,
    kicker: 'WE ARE ALMOST READY',
    body: LEFT_BODY,
  },
  rightPage: {
    nameplate: 'The Morning Edit',
    dateline: 'SATURDAY  /  STYLE  /  PAGE 2',
    headline: 'WE ARE\nCOMING\nSOON',
    headlineSize: 1,
    photo: 'footage/coming-soon-newspaper/campaign-photo.jpg',
    photoFocus: 0.62,
    photoZoom: 1.6,
    body: RIGHT_BODY,
    footer: 'SUBSCRIBE FOR EARLY ACCESS',
  },
  photos: {
    contrast: 1.7,
    brightness: 0.88,
    grain: 0.5,
  },
  ink: {
    text: '#1d1b19',
    headline: '#1d1b19',
    photo: '#1d1b19',
    paper: '#efe9dd',
  },
  print: {
    strength: 0.94,
    shading: 0.75,
    softness: 0.5,
    paperTint: 0.4,
    fadeStart: 106,
    fadeFrames: 14,
  },
  wordmark: {
    brand: 'aveline',
    second: 'studio.',
    size: 92,
    secondSize: 0.62,
    tracking: 0.32,
    gap: 44,
    ruleHeight: 84,
    offsetY: 0,
    color: '#ffffff',
    ruleColor: '#ffffff',
    start: 212,
    fadeFrames: 30,
    rise: 26,
  },
  dim: {
    color: '#000000',
    amount: 1,
    start: 204,
    frames: 30,
  },
  camera: {
    zoom: 1.08,
    creep: 0.02,
    focusX: 542,
    focusY: 1020,
    pushStart: 0,
    pushFrames: 96,
    pullStart: 112,
    pullFrames: 52,
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const comingSoonNewspaperMeta: ClipMeta = {
  ...promoMeta,
  fps: 24,
  width: 1080,
  height: 1920,
  id: 'coming-soon-newspaper',
  title: 'Coming Soon Newspaper',
  description:
    'A woman in cream linen reads a broadsheet printed with your coming soon spread against a limestone wall, lowers and folds it, walks out of frame, and a spaced serif wordmark fades in as the shot dims to black.',
  category: 'ad-reveals',
  tags: ['footage', 'paper', 'reveal', 'headline', 'camera-move'],
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/coming-soon-newspaper.tsx',
  durationInFrames: 264,
  posterFrame: 60,
};
