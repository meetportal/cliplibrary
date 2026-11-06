import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import type { ClipControls, ControlField, ControlPath } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const CHEVRON_FLIP_STYLES = ['snap', 'diamond'] as const;
export const CHEVRON_END_STYLES = ['fade', 'diamond'] as const;
export const CHEVRON_LOGO_ENTRANCES = ['rise', 'unfold'] as const;
export const CHEVRON_NAME_FONTS = ['sans', 'serif'] as const;

export type ChevronNameFont = (typeof CHEVRON_NAME_FONTS)[number];

export const chevronMarkAssembleSchema = z.object({
  brand: z.object({
    logo: zImage(),
    name: z.string(),
    nameFont: z.enum(CHEVRON_NAME_FONTS),
    nameSize: zSlider({ min: 48, max: 140 }),
    logoSize: zSlider({ min: 200, max: 480 }),
    logoEntrance: z.enum(CHEVRON_LOGO_ENTRANCES),
  }),
  plate: z.object({
    show: z.boolean(),
    roundness: zSlider({ min: 0, max: 100 }),
    padding: zSlider({ min: 0, max: 120 }),
  }),
  colors: z.object({
    primary: zColor(),
    lightField: zColor(),
    darkField: zColor(),
    endField: zColor(),
    plate: zColor(),
  }),
  mark: z.object({
    cell: zSlider({ min: 56, max: 120 }),
    pieceScale: zSlider({ min: 60, max: 100 }),
    tumble: zSlider({ min: 0, max: 2, step: 0.25 }),
    emblem: zSlider({ min: 20, max: 70 }),
    keystone: z.boolean(),
  }),
  flips: z.object({
    style: z.enum(CHEVRON_FLIP_STYLES),
    frames: zSlider({ min: 2, max: 16 }),
  }),
  ending: z.object({
    style: z.enum(CHEVRON_END_STYLES),
    frames: zSlider({ min: 16, max: 48 }),
  }),
  timing: z.object({
    speed: zSlider({ min: 1, max: 1.3, step: 0.05 }),
  }),
});

export type ChevronMarkAssembleProps = z.infer<typeof chevronMarkAssembleSchema>;

export const chevronMarkAssembleBase: ChevronMarkAssembleProps = {
  brand: {
    logo: '{{Logo}}',
    name: '{{Company Name}}',
    nameFont: 'sans',
    nameSize: 92,
    logoSize: 340,
    logoEntrance: 'rise',
  },
  plate: { show: true, roundness: 18, padding: 44 },
  colors: {
    primary: '#ff5a36',
    lightField: '#fafafa',
    darkField: '#050505',
    endField: '#0d0d0f',
    plate: '#ffffff',
  },
  mark: { cell: 92, pieceScale: 86, tumble: 0.5, emblem: 52, keystone: true },
  flips: { style: 'snap', frames: 4 },
  ending: { style: 'fade', frames: 30 },
  timing: { speed: 1 },
};

export const CHEVRON_FRAMES = 300;

export const chevronMarkAssembleMeta = (
  variant: ClipVariant,
  meta: Pick<ClipMeta, 'id' | 'title' | 'description' | 'source' | 'theme' | 'tags'>,
): ClipMeta => ({
  ...meta,
  category: 'brand',
  batch: '2026-11-06-pinterest-logo-reveals',
  variantOf: 'chevron-mark-assemble',
  variant,
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: CHEVRON_FRAMES,
  posterFrame: 288,
});

type Path = ControlPath<ChevronMarkAssembleProps>;

const ONE_OF_TWO = 'The squares swap between these two as the background flips';

export const chevronMarkAssembleControls = (
  colors: readonly ControlField<Path>[],
  colorsMore: readonly ControlField<Path>[],
): ClipControls<Path> => ({
  sections: [
    {
      title: 'Logo and name',
      fields: [
        { path: 'brand.logo', label: 'Logo', hint: 'Wide, square or round; it sits on the plate' },
        { path: 'brand.name', label: 'Company name', hint: 'Shrinks and wraps to two lines' },
        { path: 'brand.nameFont', label: 'Name font' },
      ],
      more: [
        { path: 'brand.nameSize', label: 'Largest name size', hint: 'In pixels, for short names' },
        {
          path: 'brand.logoSize',
          label: 'Logo size',
          hint: 'Side of a square logo in pixels; wide logos keep the same area',
        },
        { path: 'brand.logoEntrance', label: 'Logo entrance' },
        { path: 'plate.show', label: 'Logo plate', hint: 'A card behind the logo' },
        {
          path: 'plate.roundness',
          label: 'Plate roundness',
          hint: '100 makes a pill, or a circle for a square or round logo',
        },
        { path: 'plate.padding', label: 'Plate padding', hint: 'In pixels around the logo' },
      ],
    },
    { title: 'Colors', fields: colors, more: colorsMore },
    {
      title: 'Falling squares',
      fields: [
        { path: 'mark.cell', label: 'Mark size', hint: 'One grid cell of the chevron, in pixels' },
        { path: 'mark.tumble', label: 'Tumble', hint: 'Half turns each square spins as it falls' },
        { path: 'flips.style', label: 'Background flip' },
      ],
      more: [
        {
          path: 'mark.pieceScale',
          label: 'Square size',
          hint: 'Share of a grid cell; smaller opens the gap inside the chevron',
        },
        {
          path: 'mark.keystone',
          label: 'Accent keystone',
          hint: 'Fills the top diamond with the primary color once it locks',
        },
        { path: 'flips.frames', label: 'Flip length', hint: 'In frames' },
      ],
    },
    {
      title: 'Ending',
      fields: [
        { path: 'ending.style', label: 'Final background change' },
        { path: 'mark.emblem', label: 'Emblem size', hint: 'Share of the mark size at the end' },
      ],
      more: [
        { path: 'ending.frames', label: 'Final change length', hint: 'In frames' },
        {
          path: 'timing.speed',
          label: 'Build speed',
          hint: 'Above 1 builds faster and holds the end frame longer',
        },
      ],
    },
  ],
});

export const CHEVRON_FIELD_COLORS: readonly ControlField<Path>[] = [
  { path: 'colors.lightField', label: 'Light background', hint: ONE_OF_TWO },
  { path: 'colors.darkField', label: 'Dark background', hint: ONE_OF_TWO },
];
