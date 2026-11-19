import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const FLOATING_CARDS_FONTS = ['jakarta', 'manrope', 'inter', 'dm-sans'] as const;

export type FloatingCardsFont = (typeof FLOATING_CARDS_FONTS)[number];

export const FLOATING_CARDS_ICONS = [
  'trending-up',
  'arrow-down-left',
  'target',
  'wallet',
  'piggy-bank',
  'credit-card',
  'circle-dollar-sign',
  'chart-line',
  'users',
  'star',
  'heart',
  'bell',
  'check',
  'zap',
  'shopping-bag',
  'calendar',
  'trophy',
  'gift',
] as const;

export type FloatingCardsIcon = (typeof FLOATING_CARDS_ICONS)[number];

export const FLOATING_CARDS_TONES = ['primary', 'secondary', 'accent'] as const;

export type FloatingCardsTone = (typeof FLOATING_CARDS_TONES)[number];

const cardSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.enum(FLOATING_CARDS_ICONS),
  tone: z.enum(FLOATING_CARDS_TONES),
  highlight: z.boolean(),
  x: zSlider({ min: 160, max: 1760, step: 2 }),
  y: zSlider({ min: 100, max: 980, step: 2 }),
  tilt: zSlider({ min: -8, max: 8, step: 0.1 }),
});

export const floatingCardsSchema = z.object({
  cards: z.array(cardSchema).min(1).max(4),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    accent: zColor(),
    value: zColor(),
    label: zColor(),
    surface: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    fade: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(FLOATING_CARDS_FONTS),
    labelSize: zSlider({ min: 12, max: 40 }),
    valueSize: zSlider({ min: 20, max: 72 }),
  }),
  card: z.object({
    size: zSlider({ min: 0.6, max: 1.6, step: 0.02 }),
    radius: zSlider({ min: 0, max: 48 }),
    padding: zSlider({ min: 12, max: 48 }),
    icon: zSlider({ min: 36, max: 96, step: 2 }),
    minWidth: zSlider({ min: 160, max: 520, step: 4 }),
    maxWidth: zSlider({ min: 320, max: 800, step: 4 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  float: z.object({
    height: zSlider({ min: 0, max: 60 }),
    cycle: zSlider({ min: 60, max: 300, step: 2 }),
    sway: zSlider({ min: 0, max: 3, step: 0.1 }),
    depth: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  layout: z.object({
    x: zSlider({ min: -400, max: 400, step: 2 }),
    y: zSlider({ min: -300, max: 300, step: 2 }),
  }),
  timing: z.object({
    lead: zSlider({ min: 0, max: 20 }),
    entrance: zSlider({ min: 12, max: 60 }),
    stagger: zSlider({ min: 0, max: 30 }),
    rise: zSlider({ min: 0, max: 120, step: 2 }),
    exit: zSlider({ min: 0, max: 30 }),
  }),
});

export type FloatingCardsProps = z.infer<typeof floatingCardsSchema>;

export const floatingCardsDefaults: FloatingCardsProps = {
  cards: [
    {
      label: '{{Stat 1 Label}}',
      value: '{{Stat 1 Value}}',
      icon: 'trending-up',
      tone: 'secondary',
      highlight: false,
      x: 558,
      y: 350,
      tilt: 1,
    },
    {
      label: '{{Stat 2 Label}}',
      value: '{{Stat 2 Value}}',
      icon: 'arrow-down-left',
      tone: 'primary',
      highlight: true,
      x: 1386,
      y: 514,
      tilt: 0.4,
    },
    {
      label: '{{Stat 3 Label}}',
      value: '{{Stat 3 Value}}',
      icon: 'target',
      tone: 'accent',
      highlight: false,
      x: 760,
      y: 778,
      tilt: -1.2,
    },
  ],
  colors: {
    primary: '#1fb07f',
    secondary: '#6b54e6',
    accent: '#ef6a55',
    value: '#121216',
    label: '#7d7b83',
    surface: '#ffffff',
    background: '#f6f6f3',
    backgroundEdge: '#ebebe8',
    fade: '#000000',
  },
  showBackground: true,
  type: { font: 'jakarta', labelSize: 20, valueSize: 36 },
  card: {
    size: 1,
    radius: 22,
    padding: 26,
    icon: 64,
    minWidth: 300,
    maxWidth: 540,
    shadow: 0.6,
  },
  float: { height: 24, cycle: 140, sway: 0.5, depth: 0.6 },
  layout: { x: 0, y: 0 },
  timing: { lead: 10, entrance: 30, stagger: 13, rise: 40, exit: 14 },
};

export const floatingCardsMeta: ClipMeta = {
  id: 'floating-cards',
  title: 'Floating Cards',
  description:
    'Three white app-style stat cards, each with a tinted icon tile, a small grey label and a bold number, drift up one after another over a soft off-white backdrop, float gently out of step with soft shadows that deepen as they lift, then the frame dips to black.',
  theme: 'light',
  source: 'src/compositions/scenes/overlays/floating-cards.tsx',
  category: 'overlays',
  tags: ['cards', 'notification', 'overlay', 'float', 'minimal'],
  durationInFrames: 150,
  posterFrame: 96,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
