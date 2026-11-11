import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const WORD_PICKER_FONTS = ['grotesk', 'geometric', 'serif', 'serif-italic'] as const;

export const WORD_PICKER_LAYOUTS = ['stacked', 'split'] as const;

export const WORD_PICKER_SELECTIONS = ['bracket', 'bar'] as const;

export type WordPickerFont = (typeof WORD_PICKER_FONTS)[number];

export const wordPickerSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  items: z.array(z.string()).min(2).max(12),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    secondary: zColor(),
    background: zColor(),
    surface: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.enum(WORD_PICKER_LAYOUTS),
  brand: z.object({
    logoSize: zSlider({ min: 60, max: 260, step: 2 }),
    plate: z.boolean(),
    nameSize: zSlider({ min: 24, max: 80 }),
    nameFont: z.enum(WORD_PICKER_FONTS),
  }),
  type: z.object({
    listFont: z.enum(WORD_PICKER_FONTS),
    pickFont: z.enum(WORD_PICKER_FONTS),
    pickSize: zSlider({ min: 60, max: 200 }),
    size: zSlider({ min: 30, max: 140 }),
    pitch: zSlider({ min: 90, max: 240 }),
    reach: zSlider({ min: 1.2, max: 3.5, step: 0.1 }),
  }),
  selection: z.object({
    style: z.enum(WORD_PICKER_SELECTIONS),
    width: zSlider({ min: 400, max: 1400, step: 10 }),
    height: zSlider({ min: 100, max: 280, step: 2 }),
    fillStrength: zSlider({ min: 0, max: 0.5, step: 0.01 }),
    lineWidth: zSlider({ min: 1, max: 10, step: 0.5 }),
    corners: z.boolean(),
    counter: z.boolean(),
  }),
  glow: z.object({
    strength: zSlider({ min: 0, max: 1, step: 0.05 }),
    drift: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  steps: z.object({
    count: zSlider({ min: 1, max: 11 }),
    firstAt: zSlider({ min: 20, max: 90 }),
    every: zSlider({ min: 24, max: 60 }),
    moveFrames: zSlider({ min: 10, max: 30 }),
  }),
  entrance: z.object({
    drawFrames: zSlider({ min: 8, max: 40 }),
    wordsAt: zSlider({ min: 0, max: 30 }),
    stagger: zSlider({ min: 0, max: 12 }),
  }),
});

export type WordPickerProps = z.infer<typeof wordPickerSchema>;

export const WORD_PICKER_ITEMS = [
  '{{Item 1}}',
  '{{Item 2}}',
  '{{Item 3}}',
  '{{Item 4}}',
  '{{Item 5}}',
  '{{Item 6}}',
];

export const wordPickerDefaults: WordPickerProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  items: WORD_PICKER_ITEMS,
  colors: {
    primary: '#0f766e',
    text: '#121417',
    secondary: '#8b9196',
    background: '#f5f7f7',
    surface: '#ffffff',
  },
  showBackground: true,
  layout: 'stacked',
  brand: { logoSize: 112, plate: true, nameSize: 54, nameFont: 'grotesk' },
  type: {
    listFont: 'grotesk',
    pickFont: 'grotesk',
    pickSize: 136,
    size: 76,
    pitch: 160,
    reach: 2.7,
  },
  selection: {
    style: 'bracket',
    width: 940,
    height: 176,
    fillStrength: 0.1,
    lineWidth: 3.5,
    corners: true,
    counter: false,
  },
  glow: { strength: 0.6, drift: 0.5 },
  steps: { count: 4, firstAt: 33, every: 33, moveFrames: 20 },
  entrance: { drawFrames: 22, wordsAt: 6, stagger: 6 },
};

export const wordPickerMeta: ClipMeta = {
  id: 'word-picker',
  title: 'Word Picker',
  description:
    'Your logo and name sit above a centered list of words that steps up one word at a time, each pick growing into a tinted frame with corner lines and dots, ending held on the last pick.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/word-picker.tsx',
  category: 'list-pickers',
  tags: ['list', 'picker', 'scroll', 'text', 'logo', 'minimal'],
  durationInFrames: 180,
  posterFrame: 170,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
};
