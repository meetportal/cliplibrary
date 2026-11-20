import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const GROWTH_CALL_FONTS = ['raleway', 'poppins', 'montserrat', 'inter'] as const;

export type GrowthCallFont = (typeof GROWTH_CALL_FONTS)[number];

export const growthCallScreenSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  leadLine: z.string(),
  headline: z.string(),
  trailLine: z.string(),
  slideLabel: z.string(),
  website: z.string(),
  remindLabel: z.string(),
  messageLabel: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    surface: zColor(),
    accent: zColor(),
    knob: zColor(),
    plate: zColor(),
    label: zColor(),
    shimmer: zColor(),
  }),
  showBackground: z.boolean(),
  glow: zSlider({ min: 0, max: 40 }),
  type: z.object({
    font: z.enum(GROWTH_CALL_FONTS),
    headlineSize: zSlider({ min: 72, max: 150, step: 2 }),
    lineSize: zSlider({ min: 48, max: 120, step: 2 }),
    nameSize: zSlider({ min: 24, max: 64 }),
  }),
  caller: z.object({
    showLogo: z.boolean(),
    plate: z.boolean(),
    logoSize: zSlider({ min: 120, max: 320, step: 2 }),
    showName: z.boolean(),
    ripples: zSlider({ min: 0, max: 3 }),
    rippleReach: zSlider({ min: 10, max: 80 }),
  }),
  shimmer: z.object({
    every: zSlider({ min: 24, max: 90 }),
    width: zSlider({ min: 10, max: 60 }),
  }),
  answer: z.object({
    show: z.boolean(),
    at: zSlider({ min: 90, max: 220 }),
    length: zSlider({ min: 12, max: 40 }),
  }),
  layout: z.object({
    barWidth: zSlider({ min: 60, max: 90 }),
    barY: zSlider({ min: 1300, max: 1700, step: 2 }),
    showActions: z.boolean(),
    callerY: zSlider({ min: -200, max: 200, step: 2 }),
  }),
});

export type GrowthCallScreenProps = z.infer<typeof growthCallScreenSchema>;

export const growthCallScreenDefaults: GrowthCallScreenProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  leadLine: 'Your',
  headline: '{{Headline}}',
  trailLine: 'is calling...',
  slideLabel: 'slide to answer',
  website: '{{Website}}',
  remindLabel: 'Remind Me',
  messageLabel: 'Message',
  colors: {
    primary: '#eebc14',
    text: '#ffffff',
    background: '#000000',
    surface: '#1f2222',
    accent: '#3fae4d',
    knob: '#f9f9f9',
    plate: '#ffffff',
    label: '#6b6f6f',
    shimmer: '#ffffff',
  },
  showBackground: true,
  glow: 14,
  type: { font: 'raleway', headlineSize: 112, lineSize: 90, nameSize: 40 },
  caller: {
    showLogo: true,
    plate: true,
    logoSize: 210,
    showName: true,
    ripples: 2,
    rippleReach: 34,
  },
  shimmer: { every: 42, width: 30 },
  answer: { show: true, at: 184, length: 28 },
  layout: { barWidth: 70, barY: 1478, showActions: true, callerY: 0 },
};

export const growthCallScreenMeta: ClipMeta = {
  id: 'growth-call-screen',
  title: 'Growth Call Screen',
  description:
    'A black incoming-call screen with your logo as the caller rings with soft accent ripples while a shimmer sweeps "slide to answer", then the knob slides across and the filled bar shows your website.',
  theme: 'dark',
  source: 'src/compositions/scenes/screen-demos/growth-call-screen.tsx',
  category: 'screen-demos',
  tags: ['phone', 'screen', 'headline', 'slide', 'cta', 'logo', 'minimal'],
  durationInFrames: 270,
  posterFrame: 255,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-19-mixed-launch-promos',
};
