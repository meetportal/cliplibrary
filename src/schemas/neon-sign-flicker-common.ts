import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const NEON_FONTS = ['tilt-neon', 'comfortaa', 'quicksand', 'monoton'] as const;

export type NeonFont = (typeof NEON_FONTS)[number];

export const NEON_LABEL_FONTS = ['outfit', 'dm-mono', 'josefin-sans'] as const;

export type NeonLabelFont = (typeof NEON_LABEL_FONTS)[number];

export const NEON_ENDINGS = ['burn-out', 'relight'] as const;

export const NEON_OPENINGS = ['lit', 'switch-on'] as const;

export const neonSignFlickerSchema = z.object({
  headline: z.string(),
  tagline: zMultiline(),
  logo: zImage(),
  companyName: z.string(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    lamp: zColor(),
    plate: zColor(),
    glass: zColor(),
  }),
  showBackground: z.boolean(),
  neon: z.object({
    font: z.enum(NEON_FONTS),
    uppercase: z.boolean(),
    size: zSlider({ min: 80, max: 320, step: 2 }),
    tracking: zSlider({ min: -0.05, max: 0.3, step: 0.005 }),
    glow: zSlider({ min: 0, max: 1.5, step: 0.05 }),
    wallGlow: zSlider({ min: 0, max: 1, step: 0.01 }),
    hum: zSlider({ min: 0, max: 0.15, step: 0.005 }),
  }),
  flicker: z.object({
    letter: zSlider({ min: 1, max: 20 }),
    ending: z.enum(NEON_ENDINGS),
    start: zSlider({ min: 0, max: 150 }),
    bursts: zSlider({ min: 1, max: 10 }),
    firstBurst: zSlider({ min: 6, max: 40 }),
    shrink: zSlider({ min: 0, max: 8, step: 0.5 }),
    gap: zSlider({ min: 4, max: 30 }),
    pattern: zSlider({ min: 1, max: 99 }),
  }),
  opening: z.object({
    style: z.enum(NEON_OPENINGS),
    length: zSlider({ min: 24, max: 90 }),
  }),
  lamp: z.object({
    show: z.boolean(),
    beam: zSlider({ min: 0, max: 1.5, step: 0.05 }),
    sway: zSlider({ min: 0, max: 6, step: 0.1 }),
    height: zSlider({ min: 60, max: 360, step: 2 }),
    size: zSlider({ min: 80, max: 220, step: 2 }),
  }),
  type: z.object({
    font: z.enum(NEON_LABEL_FONTS),
    uppercase: z.boolean(),
    taglineSize: zSlider({ min: 28, max: 72 }),
    tracking: zSlider({ min: -0.02, max: 0.3, step: 0.005 }),
    nameSize: zSlider({ min: 32, max: 96 }),
    websiteSize: zSlider({ min: 18, max: 44 }),
  }),
  lockup: z.object({
    plate: z.boolean(),
    logoWidth: zSlider({ min: 200, max: 800, step: 4 }),
    logoHeight: zSlider({ min: 80, max: 360, step: 4 }),
    padding: zSlider({ min: 0, max: 80, step: 2 }),
  }),
  layout: z.object({
    signY: zSlider({ min: 500, max: 1200, step: 2 }),
    lockupY: zSlider({ min: 1200, max: 1800, step: 2 }),
  }),
});

export type NeonSignFlickerProps = z.infer<typeof neonSignFlickerSchema>;

export const neonSignFlickerMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'source' | 'posterFrame'>,
): ClipMeta => ({
  ...extra,
  category: 'text-reveals',
  tags: ['glow', 'text', 'headline', 'logo'],
  theme: 'dark',
  durationInFrames: 300,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'neon-sign-flicker',
  variant,
});

const FRAMES = 'In frames, at 30 per second';

export const neonSignFlickerControls = defineControls<NeonSignFlickerProps>({
  sections: [
    {
      title: 'Sign',
      fields: [
        {
          path: 'headline',
          label: 'Neon word',
          hint: 'Shrinks to fit the width; two or more words may stack on two lines',
        },
        {
          path: 'tagline',
          label: 'Line under the sign',
          hint: 'Wraps to at most three lines and shrinks if it needs more',
        },
      ],
      more: [
        {
          path: 'neon.uppercase',
          label: 'Neon in capitals',
          hint: 'Off shows the word as typed',
        },
        {
          path: 'neon.size',
          label: 'Neon size',
          hint: 'Largest size in pixels; long words shrink',
        },
        { path: 'neon.tracking', label: 'Neon letter spacing', hint: 'Share of the neon size' },
        {
          path: 'neon.glow',
          label: 'Tube glow',
          hint: 'Strength of the glow around the tubes; 0 leaves bare tubes',
        },
        {
          path: 'neon.wallGlow',
          label: 'Wall glow',
          hint: 'How much the sign lights the wall behind it; 0 turns it off',
        },
        {
          path: 'neon.hum',
          label: 'Glow hum',
          hint: 'A slow breathing of the glow; 0 holds it steady',
        },
        {
          path: 'layout.signY',
          label: 'Sign position',
          hint: 'Pixels from the top to the middle of the neon word',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The neon tubes, their glow, the wall glow and the glow around the logo plate',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The line under the sign, the company name and the website',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The wall' },
        { path: 'colors.lamp', label: 'Accent color', hint: 'The light from the pendant lamp' },
        { path: 'colors.plate', label: 'Surface color', hint: 'The lit plate behind the logo' },
      ],
      more: [
        {
          path: 'colors.glass',
          label: 'Unlit glass color',
          hint: 'A tube when it is off; also tints the lamp shade',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the sign over another clip',
        },
      ],
    },
    {
      title: 'Logo and name',
      fields: [
        { path: 'logo', label: 'Logo', hint: 'Wide, square or round; it fits the logo box' },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Under the logo; long names shrink to one line',
        },
        { path: 'website', label: 'Website', hint: 'Last line, shown in capitals' },
      ],
      more: [
        {
          path: 'lockup.plate',
          label: 'Lit plate behind the logo',
          hint: 'Keeps dark logos readable on the dark wall; turn off for a light logo',
        },
        {
          path: 'lockup.logoWidth',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels',
        },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels',
        },
        {
          path: 'lockup.padding',
          label: 'Plate padding',
          hint: 'Space around the logo, in pixels',
        },
        {
          path: 'type.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'type.websiteSize',
          label: 'Website size',
          hint: 'Largest size in pixels; long addresses shrink',
        },
        {
          path: 'layout.lockupY',
          label: 'Logo position',
          hint: 'Pixels from the top to the middle of the logo',
        },
      ],
    },
    {
      title: 'Flicker',
      fields: [
        {
          path: 'flicker.letter',
          label: 'Failing letter',
          hint: 'Which letter sputters, counting from 1 and skipping spaces; past the end picks the last',
        },
        {
          path: 'flicker.ending',
          label: 'How it ends',
          hint: 'Burn out leaves the letter dark glass; Relight lets it catch and stay lit',
        },
      ],
      more: [
        {
          path: 'flicker.start',
          label: 'First sputter',
          hint: `${FRAMES}; with Switch on it waits for the sign to light`,
        },
        { path: 'flicker.bursts', label: 'Bursts', hint: 'How many times the letter fights back' },
        { path: 'flicker.firstBurst', label: 'First burst length', hint: FRAMES },
        {
          path: 'flicker.shrink',
          label: 'Burst shortening',
          hint: 'Frames each burst loses against the one before',
        },
        { path: 'flicker.gap', label: 'Dark gap', hint: `${FRAMES}, between bursts` },
        {
          path: 'flicker.pattern',
          label: 'Stutter pattern',
          hint: 'Pick another number for a different rhythm of drop-outs',
        },
        {
          path: 'opening.style',
          label: 'Opening',
          hint: 'Lit starts with the sign on; Switch on lights the lamp, then each letter in turn, while the line, logo and name show from the start',
        },
        {
          path: 'opening.length',
          label: 'Switch on length',
          hint: `${FRAMES}, until the last letter lights; Switch on only`,
        },
      ],
    },
    {
      title: 'Type',
      fields: [
        { path: 'neon.font', label: 'Neon lettering' },
        {
          path: 'type.font',
          label: 'Text font',
          hint: 'The line under the sign, name and website',
        },
      ],
      more: [
        { path: 'type.uppercase', label: 'Line in capitals', hint: 'Off shows the line as typed' },
        { path: 'type.taglineSize', label: 'Line size', hint: 'Largest size in pixels' },
        { path: 'type.tracking', label: 'Line letter spacing', hint: 'Share of the line size' },
      ],
    },
    {
      title: 'Lamp',
      fields: [],
      more: [
        { path: 'lamp.show', label: 'Show lamp', hint: 'It hangs over the failing letter' },
        { path: 'lamp.beam', label: 'Beam brightness', hint: '0 leaves only the lit shade' },
        { path: 'lamp.sway', label: 'Sway', hint: 'In degrees either side; 0 holds it still' },
        {
          path: 'lamp.height',
          label: 'Hang height',
          hint: 'Pixels between the lamp and the top of the neon',
        },
        { path: 'lamp.size', label: 'Shade width', hint: 'In pixels' },
      ],
    },
  ],
});
