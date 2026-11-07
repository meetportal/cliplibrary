import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const DOT_MORPH_FONTS = ['urbanist', 'quicksand', 'sora', 'fraunces'] as const;

export const DOT_MORPH_STYLES = ['bloom', 'underline'] as const;

export type DotMorphFont = (typeof DOT_MORPH_FONTS)[number];

export type DotMorphStyle = (typeof DOT_MORPH_STYLES)[number];

export const dotMorphWordmarkSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    primaryEnd: zColor(),
    text: zColor(),
    dots: zColor(),
    background: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  name: z.object({
    font: z.enum(DOT_MORPH_FONTS),
    size: zSlider({ min: 80, max: 300, step: 2 }),
    tracking: zSlider({ min: -0.06, max: 0.16, step: 0.005 }),
    openTracking: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    fullStop: z.boolean(),
  }),
  mark: z.object({
    show: z.boolean(),
    plate: z.boolean(),
    height: zSlider({ min: 60, max: 360, step: 2 }),
    width: zSlider({ min: 120, max: 900, step: 4 }),
    gap: zSlider({ min: 0, max: 240, step: 2 }),
    padding: zSlider({ min: 0, max: 80, step: 1 }),
  }),
  dots: z.object({
    count: zSlider({ min: 2, max: 6, step: 1 }),
    size: zSlider({ min: 40, max: 160, step: 2 }),
    hop: zSlider({ min: 0, max: 4, step: 0.1 }),
    squash: zSlider({ min: 0, max: 0.5, step: 0.01 }),
  }),
  morph: z.object({
    style: z.enum(DOT_MORPH_STYLES),
    tint: zSlider({ min: 0, max: 30 }),
  }),
  layout: z.object({
    offsetY: zSlider({ min: -600, max: 600, step: 2 }),
  }),
  timing: z.object({
    start: zSlider({ min: 0, max: 20 }),
    pace: zSlider({ min: 0.8, max: 1.2, step: 0.05 }),
    stagger: zSlider({ min: 2, max: 8 }),
    tighten: zSlider({ min: 0, max: 40 }),
  }),
});

export type DotMorphWordmarkProps = z.infer<typeof dotMorphWordmarkSchema>;

export const dotMorphWordmarkControls = defineControls<DotMorphWordmarkProps>({
  sections: [
    {
      title: 'Name',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'The dots turn into these letters; long names shrink to fit one line',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Settles in above the name as the letters close up; wide, square and round logos all fit',
        },
        { path: 'name.font', label: 'Name font' },
        {
          path: 'name.fullStop',
          label: 'Full stop',
          hint: 'The last colored dot leaves a full stop after the name',
        },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'name.tracking',
          label: 'Final letter spacing',
          hint: 'Share of the name size, once the name has settled',
        },
        {
          path: 'name.openTracking',
          label: 'Open letter spacing',
          hint: 'Share of the name size as the letters land, before they close up; long names open less',
        },
        {
          path: 'layout.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the name and logo up',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.primaryEnd'],
          label: 'Primary color',
          hint: 'The gradient dots and the full stop. Scroll to More options to set each end of the gradient',
        },
        {
          link: ['colors.text', 'colors.dots'],
          label: 'Text color',
          hint: 'The letters and the plain dots',
        },
        { path: 'colors.background', label: 'Background color' },
      ],
      more: [
        { path: 'colors.primary', label: 'Gradient top' },
        { path: 'colors.primaryEnd', label: 'Gradient bottom' },
        { path: 'colors.text', label: 'Letter color' },
        { path: 'colors.dots', label: 'Plain dot color' },
        {
          path: 'colors.plate',
          label: 'Logo plate color',
          hint: 'The rounded plate behind the logo; shows when Logo plate is on',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the wordmark over another clip',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'mark.show',
          label: 'Show logo',
          hint: 'Turn off for the name alone; an empty logo hides it too',
        },
        {
          path: 'mark.plate',
          label: 'Logo plate',
          hint: 'A soft rounded plate behind the logo, so a dark logo reads on a dark background',
        },
      ],
      more: [
        {
          path: 'mark.height',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels, plate included; it keeps its shape',
        },
        {
          path: 'mark.width',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels, plate included; wide logos stop here',
        },
        { path: 'mark.gap', label: 'Space above the name', hint: 'In pixels, under the logo' },
        { path: 'mark.padding', label: 'Plate padding', hint: 'In pixels around the logo' },
      ],
    },
    {
      title: 'Dots',
      fields: [
        {
          path: 'dots.count',
          label: 'Number of dots',
          hint: 'Each dot becomes a run of letters; a shorter name uses one dot per letter',
        },
        { path: 'dots.size', label: 'Dot size', hint: 'Diameter in pixels in the row' },
        {
          path: 'morph.style',
          label: 'Dot to letters',
          hint: 'Bloom grows the letters out of each dot as it lands; Underline spreads each dot into a line the letters rise from, and the last line pulls into the full stop',
        },
      ],
      more: [
        {
          path: 'dots.hop',
          label: 'Hop height',
          hint: 'How high each dot jumps before it drops onto the name, in dot sizes; 0 slides it across',
        },
        {
          path: 'dots.squash',
          label: 'Squash and stretch',
          hint: 'How much the dots flatten in the row and stretch as they jump and fall; 0 keeps them round',
        },
        {
          path: 'morph.tint',
          label: 'Letter tint',
          hint: 'Frames each new letter keeps the color of its dot before it turns the letter color; 0 is off',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.pace',
          label: 'Pace',
          hint: 'Stretches or tightens the whole dance; 1 is the designed pace',
        },
        {
          path: 'timing.tighten',
          label: 'Close up length',
          hint: 'In frames, as the open letters close up; 0 lands them at the final spacing',
        },
      ],
      more: [
        { path: 'timing.start', label: 'First dot', hint: 'Frame the first dot appears' },
        {
          path: 'timing.stagger',
          label: 'Dot stagger',
          hint: 'In frames between one dot turning into letters and the next',
        },
      ],
    },
  ],
});

export const dotMorphWordmarkMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'brand',
  tags: ['logo', 'reveal', 'kinetic', 'text', 'minimal', 'end-card'],
  durationInFrames: 180,
  posterFrame: 165,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-07-pinterest-wordmark-reveals',
  variantOf: 'dot-morph-wordmark',
  variant,
});
