import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const chargeCompareSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  headlineLead: z.string(),
  headlineAccent: z.string(),
  soloLabel: z.string(),
  teamLabel: z.string(),
  tagline: z.string(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    low: zColor(),
    text: zColor(),
    muted: zColor(),
    background: zColor(),
    phone: zColor(),
    phoneEdge: zColor(),
    cable: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  battery: z.object({
    soloLevel: zSlider({ min: 2, max: 40 }),
    startLevel: zSlider({ min: 0, max: 40 }),
    showPercent: z.boolean(),
    glow: zSlider({ min: 0, max: 1, step: 0.05 }),
    flicker: z.boolean(),
  }),
  type: z.object({
    headlineSize: zSlider({ min: 60, max: 130, step: 2 }),
    uppercase: z.boolean(),
    labelSize: zSlider({ min: 24, max: 44 }),
    nameSize: zSlider({ min: 70, max: 150, step: 2 }),
    taglineSize: zSlider({ min: 28, max: 52 }),
    websiteSize: zSlider({ min: 28, max: 48 }),
  }),
  badge: z.object({
    height: zSlider({ min: 140, max: 240, step: 2 }),
    endScale: zSlider({ min: 1.2, max: 2.2, step: 0.05 }),
    showPlate: z.boolean(),
  }),
  timing: z.object({
    plugAt: zSlider({ min: 0, max: 30 }),
    chargeFrames: zSlider({ min: 36, max: 100 }),
    fullHold: zSlider({ min: 0, max: 30 }),
  }),
});

export type ChargeCompareProps = z.infer<typeof chargeCompareSchema>;

export const chargeCompareDefaults: ChargeCompareProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headlineLead: 'Your',
  headlineAccent: '{{Metric}}',
  soloLabel: 'Going solo',
  teamLabel: 'Teamed up',
  tagline: '{{Tagline}}',
  website: '{{Website}}',
  colors: {
    primary: '#5ee6c0',
    secondary: '#6a8cff',
    low: '#ff4d5e',
    text: '#eef0ff',
    muted: '#9aa0c8',
    background: '#090c1b',
    phone: '#070914',
    phoneEdge: '#2c3163',
    cable: '#dcdcf5',
    plate: '#f4f5fb',
  },
  showBackground: true,
  battery: { soloLevel: 8, startLevel: 8, showPercent: true, glow: 0.8, flicker: true },
  type: {
    headlineSize: 100,
    uppercase: true,
    labelSize: 34,
    nameSize: 120,
    taglineSize: 42,
    websiteSize: 38,
  },
  badge: { height: 220, endScale: 1.9, showPlate: true },
  timing: { plugAt: 18, chargeFrames: 66, fullHold: 10 },
};

export const chargeCompareMeta: ClipMeta = {
  id: 'charge-compare',
  title: 'Charge Compare',
  description:
    'Two phones side by side under your headline: the one going solo barely charges while the one teamed up with you charges to full in your colour, then your logo glides to the centre for an end card with your name, tagline and website.',
  theme: 'dark',
  source: 'src/compositions/scenes/phone-layouts/charge-compare.tsx',
  category: 'phone-layouts',
  tags: ['phone', 'multi-phone', 'counter', 'glow', 'logo', 'cta', 'end-card', 'typing'],
  durationInFrames: 265,
  posterFrame: 245,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
