import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const TECH_STACK_FONTS = ['urbanist', 'outfit', 'sora', 'manrope', 'inter-tight'] as const;

export type TechStackFont = (typeof TECH_STACK_FONTS)[number];

export const TECH_STACK_ICONS = ['asterisk', 'dot', 'none'] as const;

export type TechStackIcon = (typeof TECH_STACK_ICONS)[number];

export const techStackBranchesSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  logo: zImage(),
  items: z
    .array(z.object({ title: z.string(), detail: z.string() }))
    .min(4)
    .max(8),
  colors: z.object({
    primary: zColor(),
    root: zColor(),
    secondary: zColor(),
    text: zColor(),
    lines: zColor(),
    plate: zColor(),
  }),
  background: z.object({
    show: z.boolean(),
    top: zColor(),
    glow: zColor(),
    bottom: zColor(),
    drift: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  pills: z.object({
    font: z.enum(TECH_STACK_FONTS),
    titleSize: zSlider({ min: 40, max: 64, step: 1 }),
    detailSize: zSlider({ min: 22, max: 36, step: 1 }),
    height: zSlider({ min: 110, max: 160, step: 2 }),
    icon: z.enum(TECH_STACK_ICONS),
    rim: zSlider({ min: 0, max: 1, step: 0.01 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  wheel: z.object({
    spacing: zSlider({ min: 260, max: 420, step: 2 }),
    curve: zSlider({ min: 0, max: 1, step: 0.01 }),
    sideScale: zSlider({ min: 0.7, max: 1, step: 0.01 }),
    fade: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    dashes: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  branch: z.object({
    reach: zSlider({ min: 100, max: 360, step: 2 }),
    width: zSlider({ min: 1, max: 6, step: 0.5 }),
    pulse: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  brand: z.object({
    logoWidth: zSlider({ min: 170, max: 360, step: 2 }),
    logoHeight: zSlider({ min: 0.4, max: 0.8, step: 0.01 }),
    plate: z.boolean(),
    gap: zSlider({ min: 8, max: 60, step: 1 }),
  }),
  layout: z.object({
    y: zSlider({ min: -160, max: 160, step: 2 }),
    margin: zSlider({ min: 48, max: 160, step: 2 }),
  }),
  timing: z.object({
    intro: zSlider({ min: 16, max: 44 }),
    spin: zSlider({ min: 1, max: 5 }),
    interval: zSlider({ min: 12, max: 26 }),
    swing: zSlider({ min: 4, max: 10 }),
    drift: zSlider({ min: 0.1, max: 0.4, step: 0.01 }),
    returnToFirst: z.boolean(),
  }),
});

export type TechStackBranchesProps = z.infer<typeof techStackBranchesSchema>;

export const techStackBranchesDefaults: TechStackBranchesProps = {
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  items: [1, 2, 3, 4, 5, 6].map((at) => ({
    title: `{{Item ${at}}}`,
    detail: `{{Item ${at} Detail}}`,
  })),
  colors: {
    primary: '#f4545a',
    root: '#f4545a',
    secondary: '#f9845f',
    text: '#ffffff',
    lines: '#ffffff',
    plate: '#ffffff',
  },
  background: {
    show: true,
    top: '#feb197',
    glow: '#fe7f80',
    bottom: '#fde3dc',
    drift: 0.85,
  },
  pills: {
    font: 'urbanist',
    titleSize: 58,
    detailSize: 32,
    height: 148,
    icon: 'asterisk',
    rim: 0.55,
    shadow: 0.45,
  },
  wheel: { spacing: 384, curve: 0.97, sideScale: 0.88, fade: 0.35, dashes: 0.75 },
  branch: { reach: 190, width: 2.5, pulse: 0.8 },
  brand: { logoWidth: 240, logoHeight: 0.62, plate: true, gap: 22 },
  layout: { y: 0, margin: 96 },
  timing: { intro: 30, spin: 3, interval: 21, swing: 8, drift: 0.22, returnToFirst: true },
};

export const techStackBranchesMeta: ClipMeta = {
  id: 'tech-stack-branches',
  title: 'Tech Stack Branches',
  description:
    'A root pill carrying the logo chip, company name and tagline is wired by a hairline to a wheel of capability pills on a dashed arc, which ticks upward one item at a time so each part lights up beside the root.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/tech-stack-branches.tsx',
  posterFrame: 172,
  category: 'list-pickers',
  tags: ['list', 'picker', 'wheel', 'scroll', 'logo', 'text'],
  durationInFrames: 188,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-19-mixed-launch-promos',
};
