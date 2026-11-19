import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const TEASER_FONTS = ['outfit', 'sora', 'lexend', 'poppins'] as const;

export type TeaserFont = (typeof TEASER_FONTS)[number];

export const goingLiveTeaserSchema = z.object({
  words: z.object({
    opener: z.string(),
    glitch: zMultiline(),
    bridge: z.string(),
    panel: z.string(),
    light: z.string(),
    lightAccent: z.string(),
    punchOne: zMultiline(),
    punchTwo: zMultiline(),
  }),
  companyName: z.string(),
  logo: zImage(),
  tagline: z.string(),
  website: z.string(),
  phone: z.string(),
  email: z.string(),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    text: zColor(),
    surface: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    panel: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(TEASER_FONTS),
    caps: z.boolean(),
    wordSize: zSlider({ min: 56, max: 180, step: 2 }),
    punchSize: zSlider({ min: 60, max: 220, step: 2 }),
    nameSize: zSlider({ min: 40, max: 140, step: 2 }),
    taglineSize: zSlider({ min: 24, max: 64, step: 1 }),
    contactSize: zSlider({ min: 18, max: 40, step: 1 }),
  }),
  effects: z.object({
    glitch: zSlider({ min: 0, max: 1, step: 0.05 }),
    sheets: z.boolean(),
    arcs: z.boolean(),
    smoke: zSlider({ min: 0, max: 1, step: 0.05 }),
    pulse: zSlider({ min: 0, max: 1, step: 0.05 }),
    echoes: zSlider({ min: 0, max: 10, step: 1 }),
    echoGap: zSlider({ min: 2, max: 24, step: 1 }),
    push: zSlider({ min: 0, max: 0.12, step: 0.005 }),
  }),
  endCard: z.object({
    plate: z.boolean(),
    logoWidth: zSlider({ min: 160, max: 800, step: 4 }),
    logoHeight: zSlider({ min: 80, max: 420, step: 4 }),
    accentLastWord: z.boolean(),
    underline: z.boolean(),
    icons: z.boolean(),
    name: z.boolean(),
  }),
  layout: z.object({
    wordY: zSlider({ min: 600, max: 1300, step: 2 }),
    logoY: zSlider({ min: 500, max: 1100, step: 2 }),
    taglineY: zSlider({ min: 1000, max: 1500, step: 2 }),
    contactsY: zSlider({ min: 1200, max: 1800, step: 2 }),
  }),
});

export type GoingLiveTeaserProps = z.infer<typeof goingLiveTeaserSchema>;

export const goingLiveTeaserDefaults: GoingLiveTeaserProps = {
  words: {
    opener: 'Something',
    glitch: 'Bold and\nunseen',
    bridge: 'is',
    panel: 'Ready to',
    light: 'Light',
    lightAccent: 'up',
    punchOne: 'Eyes\nopen',
    punchTwo: 'Arriving\nshortly',
  },
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  tagline: '{{Tagline}}',
  website: '{{Website}}',
  phone: '{{Phone}}',
  email: '{{Email}}',
  colors: {
    primary: '#fda45a',
    secondary: '#9b7bfd',
    text: '#f4ede2',
    surface: '#f4ede2',
    background: '#2f1f5f',
    backgroundEdge: '#100a25',
    panel: '#130d2e',
  },
  showBackground: true,
  type: {
    font: 'outfit',
    caps: true,
    wordSize: 100,
    punchSize: 124,
    nameSize: 76,
    taglineSize: 38,
    contactSize: 30,
  },
  effects: {
    glitch: 1,
    sheets: true,
    arcs: true,
    smoke: 1,
    pulse: 1,
    echoes: 6,
    echoGap: 9,
    push: 0.05,
  },
  endCard: {
    plate: true,
    logoWidth: 520,
    logoHeight: 260,
    accentLastWord: true,
    underline: true,
    icons: true,
    name: true,
  },
  layout: { wordY: 960, logoY: 820, taglineY: 1250, contactsY: 1420 },
};

export const goingLiveTeaserMeta: ClipMeta = {
  id: 'going-live-teaser',
  title: 'Going Live Teaser',
  description:
    'A launch teaser told one word group at a time on a deep purple stage, with a bar wipe, a glitch, a rising dashboard, an orange wipe with smoke and two echo-stack punches, before your name types in and your logo plate, tagline, website and contacts land.',
  source: 'src/compositions/scenes/text-reveals/going-live-teaser.tsx',
  posterFrame: 420,
  category: 'text-reveals',
  tags: ['kinetic', 'text', 'headline', 'reveal', 'logo', 'end-card', 'wipe'],
  theme: 'dark',
  durationInFrames: 450,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
