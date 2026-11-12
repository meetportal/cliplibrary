import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const burningPaperRevealSchema = z.object({
  headlineIntro: z.string(),
  headline: z.string(),
  headlineAccent: z.string(),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    accent: zColor(),
    text: zColor(),
    paper: zColor(),
    border: zColor(),
    backTop: zColor(),
    backLeft: zColor(),
    backRight: zColor(),
    backFloor: zColor(),
    skin: zColor(),
    cuff: zColor(),
    sleeve: zColor(),
    flame: zColor(),
    smoke: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    headlineSize: zSlider({ min: 110, max: 240, step: 2 }),
    scriptSize: zSlider({ min: 32, max: 80, step: 2 }),
    nameSize: zSlider({ min: 16, max: 40, step: 1 }),
  }),
  lockup: z.object({
    logoHeight: zSlider({ min: 32, max: 110, step: 2 }),
    showPlate: z.boolean(),
  }),
  burn: z.object({
    startAt: zSlider({ min: 0.05, max: 0.8, step: 0.01 }),
    sweepSeconds: zSlider({ min: 3, max: 10, step: 0.1 }),
    slant: zSlider({ min: -140, max: 140, step: 2 }),
    jag: zSlider({ min: 0, max: 1.5, step: 0.05 }),
  }),
  fire: z.object({
    height: zSlider({ min: 0, max: 2, step: 0.05 }),
    sparks: zSlider({ min: 0, max: 2, step: 0.05 }),
    smoke: zSlider({ min: 0, max: 2, step: 0.05 }),
    glow: zSlider({ min: 0, max: 1.5, step: 0.05 }),
  }),
  hand: z.object({
    show: z.boolean(),
  }),
  camera: z.object({
    pullBack: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    tilt: zSlider({ min: -8, max: 8, step: 0.5 }),
  }),
});

export type BurningPaperRevealProps = z.infer<typeof burningPaperRevealSchema>;

export const burningPaperRevealDefaults: BurningPaperRevealProps = {
  headlineIntro: '{{Headline Intro}}',
  headline: '{{Headline}}',
  headlineAccent: '{{Headline Accent}}',
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    accent: '#e0583a',
    text: '#1c2333',
    paper: '#efebe2',
    border: '#b9b3a6',
    backTop: '#1e5e5f',
    backLeft: '#a0c6b7',
    backRight: '#3d4d64',
    backFloor: '#26314a',
    skin: '#d69b70',
    cuff: '#a7803c',
    sleeve: '#d8c49a',
    flame: '#ff8a2a',
    smoke: '#c9d3d1',
    plate: '#ffffff',
  },
  showBackground: true,
  type: { headlineSize: 186, scriptSize: 54, nameSize: 26 },
  lockup: { logoHeight: 104, showPlate: false },
  burn: { startAt: 0.34, sweepSeconds: 5.8, slant: 56, jag: 1 },
  fire: { height: 1, sparks: 1, smoke: 1, glow: 1 },
  hand: { show: true },
  camera: { pullBack: 0.14, tilt: -2 },
};

export const burningPaperRevealMeta: ClipMeta = {
  id: 'burning-paper-reveal',
  title: 'Burning Paper Reveal',
  description:
    'A hand holds up a paper card while a flame runs across it in reverse, restoring the paper behind it so your headline, accent line, logo and name appear letter by letter, then the fire dies out and the finished card holds.',
  theme: 'dark',
  source: 'src/compositions/scenes/ad-reveals/burning-paper-reveal.tsx',
  category: 'ad-reveals',
  tags: ['reveal', 'paper', 'hand', 'headline', 'logo', 'glow', 'texture', 'camera-move'],
  durationInFrames: 360,
  posterFrame: 340,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
