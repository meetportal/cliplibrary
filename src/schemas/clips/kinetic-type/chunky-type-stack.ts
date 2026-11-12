import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const chunkyTypeStackSchema = z.object({
  lines: z.object({
    first: z.string(),
    second: z.string(),
    third: z.string(),
    fourth: z.string(),
  }),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    grid: zColor(),
    surface: zColor(),
    shadow: zColor(),
  }),
  showBackground: z.boolean(),
  stack: z.object({
    caps: z.boolean(),
    firstSize: zSlider({ min: 48, max: 240 }),
    secondSize: zSlider({ min: 48, max: 240 }),
    thirdSize: zSlider({ min: 48, max: 240 }),
    fourthSize: zSlider({ min: 48, max: 240 }),
    step: zSlider({ min: 0, max: 200 }),
    lineGap: zSlider({ min: 0, max: 0.8, step: 0.01 }),
    tilt: zSlider({ min: 0, max: 10, step: 0.5 }),
    maxWidth: zSlider({ min: 900, max: 1800, step: 10 }),
    centerY: zSlider({ min: 250, max: 750 }),
  }),
  underline: z.object({
    show: z.boolean(),
    thickness: zSlider({ min: 2, max: 30 }),
    gap: zSlider({ min: 0, max: 0.8, step: 0.01 }),
  }),
  ampersand: z.object({
    show: z.boolean(),
    size: zSlider({ min: 200, max: 900, step: 10 }),
  }),
  endCard: z.object({
    nameSize: zSlider({ min: 60, max: 240 }),
    underline: z.boolean(),
  }),
  brand: z.object({
    y: zSlider({ min: 700, max: 1020 }),
    logoHeight: zSlider({ min: 48, max: 200 }),
    logoWidth: zSlider({ min: 120, max: 640, step: 10 }),
    plate: z.boolean(),
  }),
  motion: z.object({
    typeFrames: zSlider({ min: 30, max: 80 }),
    popFrames: zSlider({ min: 4, max: 14 }),
    lightDrift: zSlider({ min: 0, max: 800, step: 10 }),
    grain: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  }),
});

export type ChunkyTypeStackProps = z.infer<typeof chunkyTypeStackSchema>;

export const chunkyTypeStackDefaults: ChunkyTypeStackProps = {
  lines: {
    first: '{{Line 1}}',
    second: '{{Line 2}}',
    third: '{{Line 3}}',
    fourth: '{{Line 4}}',
  },
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#f08b76',
    text: '#f3dd8e',
    background: '#2e4a42',
    backgroundEdge: '#1d322c',
    grid: '#58766d',
    surface: '#fbf3e1',
    shadow: '#0c1814',
  },
  showBackground: true,
  stack: {
    caps: true,
    firstSize: 150,
    secondSize: 200,
    thirdSize: 140,
    fourthSize: 106,
    step: 100,
    lineGap: 0.34,
    tilt: 3.5,
    maxWidth: 1560,
    centerY: 450,
  },
  underline: { show: true, thickness: 12, gap: 0.3 },
  ampersand: { show: true, size: 620 },
  endCard: { nameSize: 176, underline: true },
  brand: { y: 905, logoHeight: 160, logoWidth: 520, plate: true },
  motion: { typeFrames: 62, popFrames: 10, lightDrift: 440, grain: 0.16 },
};

export const chunkyTypeStackMeta: ClipMeta = {
  id: 'chunky-type-stack',
  title: 'Chunky Type Stack',
  description:
    'Four lines of chunky cream poster type pop in letter by letter as a staircase on a green chalkboard grid, a Primary underline draws under the last line, the letters shrink away in a left to right sweep, a big Primary ampersand pops and shrinks, and your company name pops in over its underline above your logo, which stays on screen the whole time.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/chunky-type-stack.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'stack', 'reveal'],
  durationInFrames: 255,
  posterFrame: 112,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
