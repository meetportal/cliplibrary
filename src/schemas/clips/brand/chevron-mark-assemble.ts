import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

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

const CHEVRON_FRAMES = 300;

export const chevronMarkAssembleDefaults: ChevronMarkAssembleProps = {
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

export const chevronMarkAssembleMeta: ClipMeta = {
  id: 'chevron-mark-assemble',
  title: 'Chevron Mark Assemble',
  description:
    'Squares tumble on flipping black and white fields, lock into a chevron mark, then the field fades to black and the mark becomes an emblem over the logo and name.',
  source: 'src/compositions/scenes/brand/chevron-mark-assemble.tsx',
  theme: 'dark',
  tags: ['logo', 'drop', 'flip', 'minimal', 'end-card'],
  category: 'brand',
  batch: '2026-11-06-pinterest-logo-reveals',
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: CHEVRON_FRAMES,
  posterFrame: 288,
};
