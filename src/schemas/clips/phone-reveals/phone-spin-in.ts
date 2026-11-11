import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import { PHONE_FINISHES, phoneStageSchema } from '../../phone-kit';
import type { ClipMeta } from '../../registry';

export const PHONE_SPIN_ARRANGEMENTS = ['text-left', 'text-right', 'split'] as const;

export type PhoneSpinArrangement = (typeof PHONE_SPIN_ARRANGEMENTS)[number];

export const PHONE_SPIN_FONTS = ['inter-tight', 'instrument-serif', 'manrope'] as const;

export type PhoneSpinFont = (typeof PHONE_SPIN_FONTS)[number];

export const PHONE_SPIN_LINKS = ['arrow', 'pill', 'underline'] as const;

export const phoneSpinInSchema = z.object({
  screen: zImage(),
  logo: zImage(),
  headline: zMultiline(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    headline: zColor(),
    website: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.object({
    arrangement: z.enum(PHONE_SPIN_ARRANGEMENTS),
    phoneSize: zSlider({ min: 0.8, max: 2, step: 0.01 }),
    phoneX: zSlider({ min: 0, max: 5, step: 0.05 }),
    phoneY: zSlider({ min: -2, max: 2, step: 0.05 }),
    textInset: zSlider({ min: 60, max: 400, step: 2 }),
    textWidth: zSlider({ min: 360, max: 900, step: 4 }),
    textGap: zSlider({ min: 30, max: 300, step: 2 }),
  }),
  type: z.object({
    font: z.enum(PHONE_SPIN_FONTS),
    headlineSize: zSlider({ min: 48, max: 140, step: 2 }),
    headlineLines: zSlider({ min: 1, max: 4 }),
    websiteSize: zSlider({ min: 20, max: 48 }),
    websiteStyle: z.enum(PHONE_SPIN_LINKS),
  }),
  logoBox: z.object({
    size: zSlider({ min: 60, max: 240, step: 2 }),
    plate: z.boolean(),
    padding: zSlider({ min: 0, max: 60 }),
    roundness: zSlider({ min: 0, max: 100 }),
  }),
  phone: z.object({
    finish: z.enum(PHONE_FINISHES),
    spinTurns: zSlider({ min: 0, max: 1, step: 0.05 }),
    restAngle: zSlider({ min: -0.8, max: 0.8, step: 0.01 }),
    startTip: zSlider({ min: 0, max: 1.2, step: 0.01 }),
    startLean: zSlider({ min: 0, max: 1, step: 0.01 }),
    slideIn: zSlider({ min: 0, max: 6, step: 0.05 }),
    float: zSlider({ min: 0, max: 0.3, step: 0.005 }),
    sway: zSlider({ min: 0, max: 0.2, step: 0.005 }),
  }),
  stage: phoneStageSchema,
  timing: z.object({
    spinFrames: zSlider({ min: 40, max: 140 }),
    textStart: zSlider({ min: 20, max: 120 }),
    textStagger: zSlider({ min: 0, max: 20 }),
  }),
});

export type PhoneSpinInProps = z.infer<typeof phoneSpinInSchema>;

export const phoneSpinInDefaults: PhoneSpinInProps = {
  screen: '{{Screen}}',
  logo: '{{Logo}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#2f5d46',
    headline: '#0b0b0c',
    website: '#0b0b0c',
    background: '#f4f4f2',
    backgroundEdge: '#e2e2dd',
    plate: '#ffffff',
  },
  showBackground: true,
  layout: {
    arrangement: 'text-left',
    phoneSize: 1.4,
    phoneX: 2.1,
    phoneY: -0.05,
    textInset: 170,
    textWidth: 720,
    textGap: 110,
  },
  type: {
    font: 'inter-tight',
    headlineSize: 92,
    headlineLines: 3,
    websiteSize: 30,
    websiteStyle: 'arrow',
  },
  logoBox: {
    size: 140,
    plate: false,
    padding: 20,
    roundness: 30,
  },
  phone: {
    finish: 'natural',
    spinTurns: 0.25,
    restAngle: 0.3,
    startTip: 0.45,
    startLean: 0.25,
    slideIn: 1.5,
    float: 0.08,
    sway: 0.03,
  },
  stage: {
    cameraDistance: 14,
    fieldOfView: 30,
    keyLight: 2,
    rimLight: 0.6,
    reflections: 1.1,
    shadow: 0.16,
    shadowSoftness: 18,
    cameraDrift: 0.35,
  },
  timing: { spinFrames: 84, textStart: 36, textStagger: 8 },
};

export const phoneSpinInMeta: ClipMeta = {
  id: 'phone-spin-in',
  title: 'Phone Spin In',
  description:
    'A 3D phone rises from below with a quarter spin and lands on the right of a light studio as your logo, headline and website rise in on the left.',
  theme: 'light',
  source: 'src/compositions/scenes/phone-reveals/phone-spin-in.tsx',
  category: 'phone-reveals',
  tags: ['3d', 'phone', 'spin', 'float', 'headline'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
};
