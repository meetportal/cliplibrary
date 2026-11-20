import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const APP_SCREENS_FONTS = ['manrope', 'lato', 'inter-tight'] as const;

export type AppScreensFont = (typeof APP_SCREENS_FONTS)[number];

const featureSchema = z.object({
  title: z.string(),
  line: zMultiline(),
});

export const appScreensPromoSchema = z.object({
  screen1: zImage(),
  screen2: zImage(),
  screen3: zImage(),
  logo: zImage(),
  companyName: z.string(),
  feature1: featureSchema,
  feature2: featureSchema,
  tagline: zMultiline(),
  badges: z.object({
    show: z.boolean(),
    appStoreTop: z.string(),
    appStore: z.string(),
    playTop: z.string(),
    play: z.string(),
  }),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    line: zColor(),
    badge: zColor(),
    background: zColor(),
    phone: zColor(),
    tile: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(APP_SCREENS_FONTS),
    nameSize: zSlider({ min: 72, max: 160, step: 2 }),
    captionSize: zSlider({ min: 64, max: 150, step: 2 }),
    lineSize: zSlider({ min: 22, max: 44 }),
  }),
  phones: z.object({
    size: zSlider({ min: 0.8, max: 1.2, step: 0.01 }),
    tilt: zSlider({ min: 0, max: 20, step: 0.5 }),
    fanSpread: zSlider({ min: 300, max: 480, step: 2 }),
    float: zSlider({ min: 0, max: 16, step: 0.5 }),
    shadow: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  }),
  tile: z.object({
    size: zSlider({ min: 340, max: 620, step: 2 }),
    tilt: zSlider({ min: 0, max: 34 }),
    roundness: zSlider({ min: 0.08, max: 0.5, step: 0.01 }),
    logoPadding: zSlider({ min: 0.08, max: 0.3, step: 0.01 }),
  }),
  backdrop: z.object({
    shapeDepth: zSlider({ min: 0, max: 0.12, step: 0.005 }),
    drift: zSlider({ min: 0, max: 2, step: 0.05 }),
  }),
  timing: z.object({
    riseFrames: zSlider({ min: 40, max: 64 }),
    textStagger: zSlider({ min: 0, max: 10 }),
  }),
});

export type AppScreensPromoProps = z.infer<typeof appScreensPromoSchema>;

export const appScreensPromoDefaults: AppScreensPromoProps = {
  screen1: '{{Screen 1}}',
  screen2: '{{Screen 2}}',
  screen3: '{{Screen 3}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  feature1: { title: '{{Feature 1}}', line: '{{Feature 1 Line}}' },
  feature2: { title: '{{Feature 2}}', line: '{{Feature 2 Line}}' },
  tagline: '{{Tagline}}',
  badges: {
    show: true,
    appStoreTop: 'Download on the',
    appStore: 'App Store',
    playTop: 'Get it on',
    play: 'Google Play',
  },
  colors: {
    primary: '#b02fd6',
    text: '#1c1d26',
    line: '#4a4e63',
    badge: '#16161d',
    background: '#e2e2f0',
    phone: '#201f2b',
    tile: '#ffffff',
  },
  showBackground: true,
  type: { font: 'manrope', nameSize: 148, captionSize: 128, lineSize: 40 },
  phones: { size: 1, tilt: 11, fanSpread: 450, float: 7, shadow: 0.26 },
  tile: { size: 540, tilt: 28, roundness: 0.24, logoPadding: 0.16 },
  backdrop: { shapeDepth: 0.022, drift: 1 },
  timing: { riseFrames: 48, textStagger: 5 },
};

export const appScreensPromoMeta: ClipMeta = {
  id: 'app-screens-promo',
  title: 'App Screens Promo',
  description:
    'Your app icon flips in beside the name, then dark phones carrying your screens rise, fan out and fly up past camera one set after another, with two feature captions and an end card of logo, name, tagline and store badges.',
  theme: 'light',
  source: 'src/compositions/scenes/phone-layouts/app-screens-promo.tsx',
  category: 'phone-layouts',
  tags: ['multi-phone', 'phone', 'screen', 'flip', 'float', 'headline', 'end-card', 'badge'],
  durationInFrames: 450,
  posterFrame: 440,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-19-mixed-launch-promos',
};
