import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const TEXT_RING_FONTS = ['sans', 'sans-bold', 'geometric', 'serif', 'serif-italic'] as const;

export const TEXT_RING_ENTRANCES = ['fade', 'write-on'] as const;

export const TEXT_RING_MARK_ENTRANCES = ['bloom', 'iris'] as const;

export type TextRingFont = (typeof TEXT_RING_FONTS)[number];

const ringTypeSchema = z.object({
  font: z.enum(TEXT_RING_FONTS),
  caps: z.boolean(),
  tracking: zSlider({ min: -0.04, max: 0.3, step: 0.005 }),
  opacity: zSlider({ min: 0.2, max: 1, step: 0.01 }),
  usePrimary: z.boolean(),
});

export const textRingsSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  tagline: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  nameRings: ringTypeSchema,
  taglineRings: ringTypeSchema,
  rings: z.object({
    separator: z.string(),
    separatorGap: zSlider({ min: 0, max: 2, step: 0.05 }),
    textSize: zSlider({ min: 0.08, max: 0.22, step: 0.005 }),
    spacing: zSlider({ min: 1.15, max: 1.8, step: 0.01 }),
    count: zSlider({ min: 3, max: 14 }),
    gap: zSlider({ min: 0, max: 160, step: 2 }),
    entrance: z.enum(TEXT_RING_ENTRANCES),
    entranceFrames: zSlider({ min: 6, max: 40 }),
  }),
  spin: z.object({
    speed: zSlider({ min: 0, max: 8, step: 0.25 }),
    alternate: z.boolean(),
    clockwise: z.boolean(),
    offset: zSlider({ min: 0, max: 180 }),
  }),
  mark: z.object({
    size: zSlider({ min: 240, max: 560, step: 2 }),
    wideGrow: zSlider({ min: 0, max: 0.6, step: 0.01 }),
    stroke: zSlider({ min: 1, max: 28, step: 0.5 }),
    logoFill: zSlider({ min: 0.5, max: 0.95, step: 0.01 }),
    plate: z.boolean(),
    entrance: z.enum(TEXT_RING_MARK_ENTRANCES),
  }),
  timing: z.object({
    drawFrames: zSlider({ min: 12, max: 48 }),
    logoAt: zSlider({ min: 0, max: 60 }),
    firstRing: zSlider({ min: 6, max: 60 }),
    settleAt: zSlider({ min: 80, max: 136 }),
    settleFrames: zSlider({ min: 12, max: 40 }),
  }),
});

export type TextRingsProps = z.infer<typeof textRingsSchema>;

type RingGroup = 'nameRings' | 'taglineRings';

const ringTypeMore = (group: RingGroup, who: string) =>
  [
    {
      path: `${group}.caps`,
      label: `${who} in capitals`,
      hint: 'Shows the words in capital letters; the text you typed is kept',
    },
    {
      path: `${group}.tracking`,
      label: `${who} letter spacing`,
      hint: 'Share of the text size; repeats still close evenly around each ring',
    },
    {
      path: `${group}.opacity`,
      label: `${who} opacity`,
      hint: 'Below 1 dims these rings for a layered look',
    },
    {
      path: `${group}.usePrimary`,
      label: `${who} in Primary color`,
      hint: 'Paints these rings with Primary color, darkened or lightened just enough to stay readable',
    },
  ] as const;

export const textRingsControls = defineControls<TextRingsProps>({
  sections: [
    {
      title: 'Logo and words',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Sits in the circle at the centre; wide, square and round logos all fit',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Repeated around every other ring; long names repeat fewer times per ring',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Repeated around the rings between the name rings. Leave empty to use the name on every ring',
        },
      ],
      more: [
        {
          path: 'rings.separator',
          label: 'Separator',
          hint: 'Sits halfway between repeats, in Primary color. Leave empty for plain gaps',
        },
        {
          path: 'rings.separatorGap',
          label: 'Gap around separator',
          hint: 'In em, on each side. Larger gaps fit fewer repeats per ring',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The drawn circle, the separators and any rings set to use it',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The ring words' },
        { path: 'colors.background', label: 'Background color' },
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The disc behind the logo; Logo disc must be on',
        },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the rings over another clip',
        },
      ],
    },
    {
      title: 'Rings',
      fields: [
        {
          path: 'rings.textSize',
          label: 'Text size',
          hint: 'Share of each ring radius, so outer rings carry bigger words',
        },
        {
          path: 'rings.entrance',
          label: 'Ring entrance',
          hint: 'Fade brings each new ring in at once; Write on writes its words in clockwise',
        },
      ],
      more: [
        {
          path: 'rings.spacing',
          label: 'Ring spacing',
          hint: 'How many times wider each ring is than the one inside it; never tighter than the text allows',
        },
        {
          path: 'rings.count',
          label: 'Number of rings',
          hint: 'Rings born in total; the oldest ones grow past the frame edges',
        },
        {
          path: 'rings.gap',
          label: 'Gap outside the circle',
          hint: 'Pixels between the circle and the words of a new ring',
        },
        { path: 'rings.entranceFrames', label: 'Ring entrance length', hint: 'In frames' },
      ],
    },
    {
      title: 'Ring type',
      fields: [
        { path: 'nameRings.font', label: 'Name font' },
        { path: 'taglineRings.font', label: 'Tagline font' },
      ],
      more: [...ringTypeMore('nameRings', 'Name'), ...ringTypeMore('taglineRings', 'Tagline')],
    },
    {
      title: 'Spin',
      fields: [
        {
          path: 'spin.speed',
          label: 'Spin speed',
          hint: 'Pixels per frame along each ring, so small rings turn faster. 0 stops the spin',
        },
      ],
      more: [
        {
          path: 'spin.alternate',
          label: 'Alternate directions',
          hint: 'Neighbouring rings turn opposite ways',
        },
        {
          path: 'spin.clockwise',
          label: 'First ring clockwise',
          hint: 'Off turns the first ring counterclockwise',
        },
        {
          path: 'spin.offset',
          label: 'Ring turn offset',
          hint: 'In degrees, how far each ring starts turned from the one before',
        },
      ],
    },
    {
      title: 'Center mark',
      fields: [
        {
          path: 'mark.entrance',
          label: 'Logo entrance',
          hint: 'Bloom grows the logo and its disc into place; Iris closes the disc in from the circle edge around the logo',
        },
      ],
      more: [
        { path: 'mark.size', label: 'Circle size', hint: 'Diameter in pixels for a square logo' },
        {
          path: 'mark.wideGrow',
          label: 'Grow for wide logos',
          hint: 'Extra circle size for a wide logo, as a share; 0 keeps every logo in the same circle',
        },
        { path: 'mark.stroke', label: 'Circle line width', hint: 'In pixels' },
        {
          path: 'mark.logoFill',
          label: 'Logo size',
          hint: 'Share of the circle the logo may reach',
        },
        {
          path: 'mark.plate',
          label: 'Logo disc',
          hint: 'A Surface color disc behind the logo so it reads on any background',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.settleAt',
          label: 'Settle at',
          hint: 'Frame number where the rings start slowing to a stop',
        },
      ],
      more: [
        { path: 'timing.drawFrames', label: 'Circle draw length', hint: 'In frames, from frame 0' },
        {
          path: 'timing.logoAt',
          label: 'Logo in by',
          hint: 'Frame number the logo is fully in; 0 shows it from the first frame',
        },
        { path: 'timing.firstRing', label: 'First ring at', hint: 'Frame number' },
        {
          path: 'timing.settleFrames',
          label: 'Settle length',
          hint: 'In frames, while the rings slow to a stop; they keep spinning after',
        },
      ],
    },
  ],
});

export const textRingsMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'kinetic-type',
  tags: ['kinetic', 'text', 'repeat', 'spin', 'orbit', 'logo'],
  durationInFrames: 180,
  posterFrame: 165,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'text-rings',
  variant,
});
