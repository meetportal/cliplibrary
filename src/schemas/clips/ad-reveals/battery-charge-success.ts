import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

const cableSchema = z.object({
  label: z.string(),
  color: zColor(),
});

export const batteryChargeSuccessSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  tagline: z.string(),
  website: z.string(),
  cables: z.object({
    leftTop: cableSchema,
    leftBottom: cableSchema,
    rightTop: cableSchema,
    rightBottom: cableSchema,
    bottom: cableSchema,
  }),
  colors: z.object({
    charged: zColor(),
    empty: zColor(),
    text: zColor(),
    background: zColor(),
    beam: zColor(),
    shell: zColor(),
    body: zColor(),
    wire: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  battery: z.object({
    width: zSlider({ min: 280, max: 460, step: 2 }),
    height: zSlider({ min: 480, max: 760, step: 2 }),
    centerY: zSlider({ min: 700, max: 900, step: 2 }),
    roundness: zSlider({ min: 8, max: 80 }),
    glow: zSlider({ min: 0, max: 1, step: 0.05 }),
    lowTint: zSlider({ min: -90, max: 90 }),
  }),
  type: z.object({
    nameSize: zSlider({ min: 48, max: 120, step: 2 }),
    nameTracking: zSlider({ min: 0, max: 0.3, step: 0.01 }),
    uppercase: z.boolean(),
    labelSize: zSlider({ min: 24, max: 44 }),
    percentSize: zSlider({ min: 40, max: 80, step: 2 }),
    taglineSize: zSlider({ min: 36, max: 64, step: 2 }),
    websiteSize: zSlider({ min: 24, max: 44 }),
  }),
  lockup: z.object({
    logoHeight: zSlider({ min: 100, max: 320, step: 2 }),
    logoWidth: zSlider({ min: 300, max: 760, step: 4 }),
    showPlate: z.boolean(),
  }),
  timing: z.object({
    plugAt: zSlider({ min: 0, max: 40 }),
    plugFrames: zSlider({ min: 24, max: 50 }),
    chargeFrames: zSlider({ min: 70, max: 140 }),
    fullHold: zSlider({ min: 0, max: 40 }),
  }),
  motion: z.object({
    sway: zSlider({ min: 0, max: 2, step: 0.05 }),
    wave: zSlider({ min: 0, max: 2, step: 0.05 }),
    pulses: zSlider({ min: 0, max: 4 }),
    bubbles: z.boolean(),
    rings: z.boolean(),
  }),
});

export type BatteryChargeSuccessProps = z.infer<typeof batteryChargeSuccessSchema>;

export const batteryChargeSuccessDefaults: BatteryChargeSuccessProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  tagline: '{{Tagline}}',
  website: '{{Website}}',
  cables: {
    leftTop: { label: '{{Item 1}}', color: '#5ee6c8' },
    leftBottom: { label: '{{Item 2}}', color: '#ffd166' },
    rightTop: { label: '{{Item 3}}', color: '#5cc8ff' },
    rightBottom: { label: '{{Item 4}}', color: '#b6f36b' },
    bottom: { label: '{{Item 5}}', color: '#7fb8ff' },
  },
  colors: {
    charged: '#34d9b4',
    empty: '#ff7a2f',
    text: '#f2f7f5',
    background: '#06090b',
    beam: '#16262a',
    shell: '#e6f2ee',
    body: '#0b1416',
    wire: '#dfe7e5',
    plate: '#f4f8f6',
  },
  showBackground: true,
  battery: { width: 368, height: 620, centerY: 802, roundness: 34, glow: 0.8, lowTint: -12 },
  type: {
    nameSize: 80,
    nameTracking: 0.12,
    uppercase: true,
    labelSize: 34,
    percentSize: 58,
    taglineSize: 58,
    websiteSize: 40,
  },
  lockup: { logoHeight: 240, logoWidth: 600, showPlate: true },
  timing: { plugAt: 30, plugFrames: 40, chargeFrames: 128, fullHold: 18 },
  motion: { sway: 1, wave: 1, pulses: 2, bubbles: true, rings: true },
};

export const batteryChargeSuccessMeta: ClipMeta = {
  id: 'battery-charge-success',
  title: 'Battery Charge Success',
  description:
    'Five named cables swing up and plug into an empty battery, it charges from warning orange to full in your colour under your name, then the cables drop away and your logo, tagline and website rise in.',
  theme: 'dark',
  source: 'src/compositions/scenes/ad-reveals/battery-charge-success.tsx',
  category: 'ad-reveals',
  tags: ['counter', 'glow', 'reveal', 'logo', 'cta', 'end-card', 'list'],
  durationInFrames: 360,
  posterFrame: 350,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
