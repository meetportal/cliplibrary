import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const CTA_END_CARD_FONTS = ['inter-tight', 'sora', 'outfit'] as const;

export type CtaEndCardFont = (typeof CTA_END_CARD_FONTS)[number];

const buttonSchema = z.object({
  caption: z.string(),
  label: z.string(),
});

export const ctaEndCardSchema = z.object({
  logo: zImage(),
  headline: z.object({
    lead: z.string(),
    name: z.string(),
    tail: z.string(),
  }),
  tagline: z.string(),
  website: z.string(),
  primaryButton: buttonSchema,
  secondaryButton: buttonSchema.extend({ show: z.boolean() }),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    secondary: zColor(),
    surface: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
  }),
  showBackground: z.boolean(),
  lockup: z.object({
    size: zSlider({ min: 60, max: 220, step: 2 }),
    maxWidth: zSlider({ min: 160, max: 760, step: 10 }),
    plate: z.boolean(),
    padding: zSlider({ min: 0, max: 48, step: 2 }),
  }),
  type: z.object({
    font: z.enum(CTA_END_CARD_FONTS),
    size: zSlider({ min: 56, max: 160, step: 2 }),
    maxWidth: zSlider({ min: 800, max: 1800, step: 10 }),
    taglineSize: zSlider({ min: 20, max: 56, step: 1 }),
    websiteSize: zSlider({ min: 14, max: 40, step: 1 }),
    websiteTracking: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    uppercaseWebsite: z.boolean(),
  }),
  underline: z.object({
    show: z.boolean(),
    thickness: zSlider({ min: 2, max: 20, step: 1 }),
  }),
  buttons: z.object({
    height: zSlider({ min: 60, max: 130, step: 2 }),
    labelSize: zSlider({ min: 18, max: 44, step: 1 }),
    gap: zSlider({ min: 8, max: 60, step: 2 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -300, max: 300, step: 4 }),
    spacing: zSlider({ min: 0.6, max: 1.6, step: 0.05 }),
  }),
  motion: z.object({
    start: zSlider({ min: 0, max: 30 }),
    stagger: zSlider({ min: 2, max: 12 }),
    rise: zSlider({ min: 0, max: 80, step: 2 }),
    sheen: zSlider({ min: 0, max: 1, step: 0.05 }),
    drift: zSlider({ min: 0, max: 1, step: 0.05 }),
    exit: z.boolean(),
  }),
});

export type CtaEndCardProps = z.infer<typeof ctaEndCardSchema>;

export const ctaEndCardDefaults: CtaEndCardProps = {
  logo: '{{Logo}}',
  headline: { lead: 'Download', name: '{{Company Name}}', tail: 'today.' },
  tagline: '{{Tagline}}',
  website: '{{Website}}',
  primaryButton: { caption: 'Download for', label: 'iOS' },
  secondaryButton: { caption: 'Get it on', label: 'Android', show: true },
  colors: {
    primary: '#2f5bff',
    text: '#0b0b0c',
    secondary: '#74747a',
    surface: '#ffffff',
    background: '#f5f5f2',
    backgroundEdge: '#e2e2dc',
  },
  showBackground: true,
  lockup: { size: 150, maxWidth: 460, plate: true, padding: 18 },
  type: {
    font: 'inter-tight',
    size: 104,
    maxWidth: 1560,
    taglineSize: 34,
    websiteSize: 22,
    websiteTracking: 0.22,
    uppercaseWebsite: true,
  },
  underline: { show: true, thickness: 8 },
  buttons: { height: 88, labelSize: 30, gap: 20 },
  layout: { offsetY: 0, spacing: 1 },
  motion: { start: 0, stagger: 5, rise: 36, sheen: 0.6, drift: 0.6, exit: false },
};

export const ctaEndCardMeta: ClipMeta = {
  id: 'cta-end-card',
  title: 'CTA End Card',
  description:
    'A calm app end card: the logo sits on a soft white plate while the headline rises in with the company name in the accent colour, an underline draws under the name, then the tagline, two download buttons and the web address arrive and hold.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/cta-end-card.tsx',
  category: 'brand',
  tags: ['cta', 'end-card', 'logo', 'headline', 'text', 'minimal'],
  durationInFrames: 150,
  posterFrame: 110,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
