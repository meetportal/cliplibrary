import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const COLOR_PILLS_FONTS = ['quicksand', 'nunito', 'sora', 'outfit'] as const;

export type ColorPillsFont = (typeof COLOR_PILLS_FONTS)[number];

export const colorPillsSchema = z.object({
  pills: z
    .array(
      z.object({
        label: z.string(),
        hue: zSlider({ min: -180, max: 180 }),
        shade: zSlider({ min: -0.3, max: 0.3, step: 0.01 }),
        vividness: zSlider({ min: 0.2, max: 1.6, step: 0.02 }),
        offset: zSlider({ min: -160, max: 160, step: 2 }),
      }),
    )
    .min(2)
    .max(7),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    secondary: zColor(),
    background: zColor(),
  }),
  showBackground: z.boolean(),
  palette: z.object({
    spread: zSlider({ min: 0, max: 1.5, step: 0.05 }),
    halo: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  type: z.object({
    font: z.enum(COLOR_PILLS_FONTS),
    size: zSlider({ min: 28, max: 80, step: 2 }),
    bullet: z.boolean(),
  }),
  pill: z.object({
    height: zSlider({ min: 64, max: 160, step: 2 }),
    padding: zSlider({ min: 16, max: 90, step: 2 }),
  }),
  layout: z.object({
    x: zSlider({ min: -600, max: 600, step: 4 }),
    y: zSlider({ min: -300, max: 300, step: 4 }),
    pitch: zSlider({ min: 90, max: 220, step: 2 }),
  }),
  cursor: z.object({
    show: z.boolean(),
    size: zSlider({ min: 12, max: 60, step: 2 }),
    push: zSlider({ min: 0, max: 120, step: 2 }),
    grow: zSlider({ min: 0, max: 0.3, step: 0.01 }),
    lift: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  glow: z.object({
    strength: zSlider({ min: 0, max: 1, step: 0.05 }),
    drift: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  timing: z.object({
    entrance: zSlider({ min: 8, max: 30 }),
    stagger: zSlider({ min: 0, max: 12 }),
    cursorAt: zSlider({ min: 10, max: 90 }),
    every: zSlider({ min: 12, max: 40 }),
    move: zSlider({ min: 6, max: 24 }),
  }),
});

export type ColorPillsProps = z.infer<typeof colorPillsSchema>;

export const colorPillsDefaults: ColorPillsProps = {
  pills: [
    { label: '{{Item 1}}', hue: 0, shade: 0, vividness: 1, offset: 2 },
    { label: '{{Item 2}}', hue: 81, shade: 0.15, vividness: 0.86, offset: -32 },
    { label: '{{Item 3}}', hue: -142, shade: 0.11, vividness: 0.58, offset: 22 },
    { label: '{{Item 4}}', hue: -34, shade: -0.1, vividness: 0.92, offset: -2 },
    { label: '{{Item 5}}', hue: -63, shade: 0.08, vividness: 0.62, offset: 32 },
    { label: '{{Item 6}}', hue: 69, shade: 0.04, vividness: 0.9, offset: -20 },
  ],
  colors: {
    primary: '#8e2dd2',
    text: '#ffffff',
    secondary: '#1c2041',
    background: '#eef0fa',
  },
  showBackground: true,
  palette: { spread: 1, halo: 0.55 },
  type: { font: 'quicksand', size: 50, bullet: true },
  pill: { height: 104, padding: 36 },
  layout: { x: -40, y: 0, pitch: 150 },
  cursor: { show: true, size: 30, push: 96, grow: 0.08, lift: 0.6 },
  glow: { strength: 0.7, drift: 0.7 },
  timing: {
    entrance: 16,
    stagger: 4,
    cursorAt: 36,
    every: 18,
    move: 12,
  },
};

export const colorPillsMeta: ClipMeta = {
  id: 'color-pills',
  title: 'Color Pills',
  description:
    'Six bright rounded pills rise into a zigzag column, then a small dark cursor walks down the list and nudges each pill aside in turn, then holds on the settled list.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/color-pills.tsx',
  category: 'list-pickers',
  tags: ['list', 'picker', 'text', 'slide', 'minimal'],
  durationInFrames: 210,
  posterFrame: 186,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
