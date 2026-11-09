import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

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

export const wordPickerControls = defineControls<WordPickerProps>({
  sections: [
    {
      title: 'Brand',
      fields: [
        { path: 'logo', label: 'Logo', hint: 'Wide, square and round logos all fit the slot' },
        { path: 'companyName', label: 'Company name', hint: 'Sits beside or under the logo' },
      ],
      more: [
        {
          path: 'brand.logoSize',
          label: 'Logo size',
          hint: 'Height in pixels of a square logo; wide logos get the same area',
        },
        {
          path: 'brand.plate',
          label: 'Logo plate',
          hint: 'A Surface color plate behind the logo so it reads on any background',
        },
        { path: 'brand.nameSize', label: 'Name size', hint: 'In pixels; long names shrink to fit' },
        { path: 'brand.nameFont', label: 'Name font' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The picked word or its bar, the frame lines, corner dots, counter and glows',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The company name and the words next to the picked one',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'Words two or more steps away; words in between blend from the text color',
        },
        { path: 'colors.background', label: 'Background color' },
        { path: 'colors.surface', label: 'Surface color', hint: 'The plate behind the logo' },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the list over another clip; the glows go with it',
        },
        {
          path: 'glow.strength',
          label: 'Glow strength',
          hint: 'Soft Primary color light in two corners; 0 turns it off',
        },
        { path: 'glow.drift', label: 'Glow drift', hint: 'How far the corner glows wander' },
      ],
    },
    {
      title: 'Words',
      fields: [
        {
          path: 'items',
          label: 'Words',
          hint: 'The list, top to bottom; the first one is picked first',
        },
        {
          path: 'type.pickSize',
          label: 'Picked word size',
          hint: 'In pixels; the whole list shrinks when the longest word would not fit the frame',
        },
        {
          path: 'layout',
          label: 'Layout',
          hint: 'Stacked puts the brand above the list; Split puts it in a column on the left',
        },
      ],
      more: [
        { path: 'type.listFont', label: 'List font' },
        { path: 'type.pickFont', label: 'Picked word font', hint: 'Crossfades in as a word lands' },
        { path: 'type.size', label: 'Other words size', hint: 'In pixels, before any shrink' },
        { path: 'type.pitch', label: 'Line spacing', hint: 'Pixels between words' },
        {
          path: 'type.reach',
          label: 'Visible words each side',
          hint: 'Words fade out toward this many steps from the picked one',
        },
      ],
    },
    {
      title: 'Selection',
      fields: [
        {
          path: 'selection.style',
          label: 'Selection style',
          hint: 'Bracket is a tinted frame with corner lines; Bar is a solid Primary bar the words pass through',
        },
      ],
      more: [
        { path: 'selection.width', label: 'Frame width', hint: 'In pixels' },
        {
          path: 'selection.height',
          label: 'Frame height',
          hint: 'In pixels; never shorter than the picked word needs',
        },
        {
          path: 'selection.fillStrength',
          label: 'Frame tint',
          hint: 'Opacity of the Primary color fill inside the bracket',
        },
        { path: 'selection.lineWidth', label: 'Line thickness', hint: 'Bracket lines, in pixels' },
        {
          path: 'selection.corners',
          label: 'Corner lines and dots',
          hint: 'The two lines and dots that mark opposite corners of the frame',
        },
        {
          path: 'selection.counter',
          label: 'Counter',
          hint: 'Shows the number of the picked word and how many picks there are',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'steps.count',
          label: 'Number of moves',
          hint: 'The list stops after this many steps, or on the last word',
        },
        { path: 'steps.every', label: 'Time per word', hint: 'Frames between moves' },
      ],
      more: [
        { path: 'steps.firstAt', label: 'First move at', hint: 'Frame number' },
        {
          path: 'steps.moveFrames',
          label: 'Move length',
          hint: 'In frames, capped just under the time per word',
        },
        {
          path: 'entrance.drawFrames',
          label: 'Frame draw length',
          hint: 'In frames, from the first frame',
        },
        { path: 'entrance.wordsAt', label: 'First word in at', hint: 'Frame number it starts' },
        {
          path: 'entrance.stagger',
          label: 'Word entrance stagger',
          hint: 'Frames between each word rising in below the first',
        },
      ],
    },
  ],
});

export const wordPickerMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'list-pickers',
  tags: ['list', 'picker', 'scroll', 'text', 'logo', 'minimal'],
  durationInFrames: 180,
  posterFrame: 170,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'word-picker',
  variant,
});
