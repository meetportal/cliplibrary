import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const ARC_BURST_FONTS = [
  'lexend',
  'archivo-black',
  'comfortaa',
  'fredoka',
  'unbounded',
] as const;

export type ArcBurstFont = (typeof ARC_BURST_FONTS)[number];

export const ARC_BURST_CASES = ['as-typed', 'lowercase', 'uppercase'] as const;

export const ARC_BURST_WIPES = ['iris', 'split'] as const;

export const ARC_BURST_BUILDS = ['slices', 'swing'] as const;

export const arcBurstWordmarkSchema = z.object({
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    field: zColor(),
    comet: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  name: z.object({
    font: z.enum(ARC_BURST_FONTS),
    letterCase: z.enum(ARC_BURST_CASES),
    size: zSlider({ min: 60, max: 320, step: 2 }),
    tracking: zSlider({ min: -0.08, max: 0.2, step: 0.005 }),
    maxWidth: zSlider({ min: 40, max: 92 }),
    wrap: z.boolean(),
    offsetY: zSlider({ min: -400, max: 400, step: 2 }),
  }),
  mark: z.object({
    show: z.boolean(),
    width: zSlider({ min: 80, max: 1000, step: 4 }),
    height: zSlider({ min: 40, max: 420, step: 2 }),
    gap: zSlider({ min: 0, max: 200, step: 2 }),
    plate: z.boolean(),
    padding: zSlider({ min: 0, max: 80, step: 2 }),
    roundness: zSlider({ min: 0, max: 50 }),
  }),
  swirl: z.object({
    arcs: zSlider({ min: 0, max: 16 }),
    comets: zSlider({ min: 0, max: 6 }),
    spin: zSlider({ min: 0, max: 3, step: 0.05 }),
  }),
  burst: z.object({
    style: z.enum(ARC_BURST_WIPES),
    at: zSlider({ min: 16, max: 60 }),
    length: zSlider({ min: 10, max: 30 }),
  }),
  build: z.object({
    style: z.enum(ARC_BURST_BUILDS),
    delay: zSlider({ min: 0, max: 24 }),
    spread: zSlider({ min: 0, max: 40 }),
    flight: zSlider({ min: 10, max: 36 }),
    swing: zSlider({ min: 10, max: 120 }),
    orbits: zSlider({ min: 0, max: 12 }),
  }),
  accent: z.object({
    show: z.boolean(),
    thickness: zSlider({ min: 2, max: 30 }),
    gap: zSlider({ min: 0, max: 120, step: 2 }),
  }),
});

export type ArcBurstWordmarkProps = z.infer<typeof arcBurstWordmarkSchema>;

export const arcBurstWordmarkControls = (logoHint: string) =>
  defineControls<ArcBurstWordmarkProps>({
    sections: [
      {
        title: 'Wordmark',
        fields: [
          {
            path: 'companyName',
            label: 'Company name',
            hint: 'Built from spinning pieces in the middle; long names shrink to fit or break onto two lines',
          },
          { path: 'logo', label: 'Logo', hint: logoHint },
          { path: 'name.font', label: 'Font' },
          {
            path: 'name.letterCase',
            label: 'Letter case',
            hint: 'Lowercase gives the soft wordmark look; As typed keeps your capitals',
          },
        ],
        more: [
          {
            path: 'name.size',
            label: 'Largest size',
            hint: 'In pixels; long names shrink below it',
          },
          { path: 'name.tracking', label: 'Letter spacing', hint: 'Share of the letter size' },
          {
            path: 'name.maxWidth',
            label: 'Widest the name may be',
            hint: 'Percent of the frame width',
          },
          {
            path: 'name.wrap',
            label: 'Two lines for long names',
            hint: 'Breaks a long name at the most balanced space instead of shrinking it on one line',
          },
          {
            path: 'name.offsetY',
            label: 'Move up or down',
            hint: 'In pixels; negative moves the name and logo up',
          },
        ],
      },
      {
        title: 'Colors',
        fields: [
          {
            path: 'colors.primary',
            label: 'Primary color',
            hint: 'The burst, the swirling arcs, the pieces as they fly in and the accent arc',
          },
          { path: 'colors.text', label: 'Text color', hint: 'The finished name' },
          {
            path: 'colors.background',
            label: 'Background color',
            hint: 'The stage the burst opens onto, behind the name',
          },
          {
            path: 'colors.field',
            label: 'Surface color',
            hint: 'The dark field the arcs and comets swirl over before the burst',
          },
        ],
        more: [
          {
            path: 'colors.plate',
            label: 'Logo plate color',
            hint: 'The rounded plate behind the logo; shows when Logo plate is on',
          },
          {
            path: 'colors.comet',
            label: 'Comet color',
            hint: 'The comet heads and tails and the sparkles in the burst',
          },
          {
            path: 'showBackground',
            label: 'Show background',
            hint: 'Turn off to layer the reveal over another clip; the burst shapes still show',
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
            hint: 'A rounded plate behind the logo, so a dark logo reads on a dark stage',
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
          {
            path: 'mark.roundness',
            label: 'Plate roundness',
            hint: 'Percent of the plate height; 50 makes a pill',
          },
        ],
      },
      {
        title: 'Swirl and burst',
        fields: [
          {
            path: 'burst.style',
            label: 'Burst style',
            hint: 'Iris rings out from the centre; Split closes two big discs over the frame and parts them',
          },
          { path: 'swirl.arcs', label: 'Arcs', hint: 'Dotted and dashed arcs before the burst' },
        ],
        more: [
          {
            path: 'burst.at',
            label: 'Burst frame',
            hint: 'Frame number the comets meet in the middle and the burst starts',
          },
          { path: 'burst.length', label: 'Burst length', hint: 'In frames' },
          { path: 'swirl.comets', label: 'Comets', hint: 'Comets that streak into the middle' },
          { path: 'swirl.spin', label: 'Arc spin speed', hint: '0 holds the arcs still' },
        ],
      },
      {
        title: 'Letters',
        fields: [
          {
            path: 'build.style',
            label: 'How letters arrive',
            hint: 'Slices pivot three pieces of each letter together; Swing hinges whole letters up',
          },
          {
            path: 'accent.show',
            label: 'Accent arc',
            hint: 'A Primary color arc that draws out under the finished name and stays',
          },
        ],
        more: [
          {
            path: 'build.flight',
            label: 'Letter flight',
            hint: 'In frames, from first sight to landing',
          },
          {
            path: 'build.delay',
            label: 'Wait after the burst',
            hint: 'In frames before the first letter starts',
          },
          {
            path: 'build.spread',
            label: 'Left to right spread',
            hint: 'In frames between the first and the last letter starting, whatever the length',
          },
          {
            path: 'build.swing',
            label: 'Swing angle',
            hint: 'In degrees, how far each piece turns',
          },
          {
            path: 'build.orbits',
            label: 'Orbit arcs',
            hint: 'Arcs that spin around the letters and pull away; 0 turns them off',
          },
          { path: 'accent.thickness', label: 'Arc thickness', hint: 'In pixels' },
          {
            path: 'accent.gap',
            label: 'Space under the name',
            hint: 'In pixels below the letters',
          },
        ],
      },
    ],
  });

export const arcBurstWordmarkMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'brand',
  tags: ['logo', 'reveal', 'kinetic', 'orbit', 'wipe', 'end-card'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1440,
  height: 1080,
  batch: '2026-11-07-pinterest-wordmark-reveals',
  variantOf: 'arc-burst-wordmark',
  variant,
});
