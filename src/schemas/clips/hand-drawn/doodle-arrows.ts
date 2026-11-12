import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const doodleArrowsSchema = z.object({
  headline: z.string(),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    pencil: zColor(),
    text: zColor(),
    paper: zColor(),
    rules: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    headlineSize: zSlider({ min: 70, max: 170, step: 2 }),
    nameSize: zSlider({ min: 22, max: 52, step: 1 }),
  }),
  lockup: z.object({
    logoHeight: zSlider({ min: 40, max: 120, step: 2 }),
    showPlate: z.boolean(),
  }),
  arrows: z.object({
    strokeWidth: zSlider({ min: 3, max: 14, step: 0.5 }),
    headSize: zSlider({ min: 20, max: 70, step: 1 }),
    drawFrames: zSlider({ min: 20, max: 50, step: 1 }),
    wobble: zSlider({ min: 0, max: 2, step: 0.05 }),
    showUnderline: z.boolean(),
  }),
  paper: z.object({
    showRules: z.boolean(),
    ruleSpacing: zSlider({ min: 36, max: 90, step: 1 }),
    lightDrift: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
});

export type DoodleArrowsProps = z.infer<typeof doodleArrowsSchema>;

export const doodleArrowsDefaults: DoodleArrowsProps = {
  headline: '{{Headline}}',
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#d9482b',
    pencil: '#26262b',
    text: '#1d2230',
    paper: '#eef1f4',
    rules: '#d3d9e0',
    plate: '#ffffff',
  },
  showBackground: true,
  type: { headlineSize: 132, nameSize: 38 },
  lockup: { logoHeight: 92, showPlate: false },
  arrows: { strokeWidth: 8, headSize: 40, drawFrames: 36, wobble: 1, showUnderline: true },
  paper: { showRules: true, ruleSpacing: 54, lightDrift: 0.6 },
};

export const doodleArrowsMeta: ClipMeta = {
  id: 'doodle-arrows',
  title: 'Doodle Arrows',
  description:
    'Two pencil arrows sketch themselves on ruled notebook paper, a wavy graphite one and a straight one in the brand colour, both rising to the upper right where a handwritten headline writes itself on and gets underlined beside the logo and company name.',
  theme: 'light',
  source: 'src/compositions/scenes/hand-drawn/doodle-arrows.tsx',
  category: 'hand-drawn',
  tags: ['doodle', 'arrows', 'draw', 'sketch', 'handwriting', 'headline', 'logo', 'paper'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-11-archive-old-clips',
};
