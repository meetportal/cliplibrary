import { z } from 'zod';
import { zColor, zImage, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const ANNIVERSARY_WORD_FONTS = ['grotesk', 'geometric', 'editorial'] as const;

export const ANNIVERSARY_VALUE_FONTS = ['mono', 'grotesk', 'wide'] as const;

export type AnniversaryWordFont = (typeof ANNIVERSARY_WORD_FONTS)[number];

export type AnniversaryValueFont = (typeof ANNIVERSARY_VALUE_FONTS)[number];

export const anniversaryKineticSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  years: z.string(),
  founded: z.string(),
  tagline: z.string(),
  badgeLine: z.string(),
  opening: z.object({
    intro: z.string(),
    leanIn: z.string(),
    leanInRepeats: zSlider({ min: 1, max: 4 }),
  }),
  news: z.object({
    weveGot: z.string(),
    bigNews: z.string(),
    soGood: z.string(),
    toShare: z.string(),
    withYou: z.string(),
  }),
  journey: z.object({
    look: z.string(),
    howFar: z.string(),
    weve: z.string(),
    come: z.string(),
    and: z.string(),
    still: z.string(),
    going: z.string(),
    strong: z.string(),
  }),
  milestone: z.object({
    turning: z.string(),
    today: z.string(),
    ordinal: z.boolean(),
  }),
  values: z.object({
    first: z.string(),
    second: z.string(),
    third: z.string(),
    fourth: z.string(),
  }),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    text: zColor(),
    background: zColor(),
    surface: zColor(),
    deep: zColor(),
    plum: zColor(),
    highlight: zColor(),
    name: zColor(),
    muted: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    font: z.enum(ANNIVERSARY_WORD_FONTS),
    valueFont: z.enum(ANNIVERSARY_VALUE_FONTS),
    size: zSlider({ min: 90, max: 220 }),
    valueSize: zSlider({ min: 80, max: 200 }),
  }),
  effects: z.object({
    glitch: zSlider({ min: 0, max: 2, step: 0.05 }),
    noise: zSlider({ min: 0, max: 1, step: 0.05 }),
    streaks: zSlider({ min: 0, max: 1, step: 0.05 }),
    outlines: zSlider({ min: 0, max: 1, step: 0.05 }),
    stars: zSlider({ min: 0, max: 200 }),
    grain: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    bandTilt: zSlider({ min: -12, max: 12, step: 0.5 }),
  }),
  timing: z.object({
    pace: zSlider({ min: 0.85, max: 1.1, step: 0.01 }),
    endBuild: zSlider({ min: 12, max: 48 }),
  }),
  badge: z.object({
    size: zSlider({ min: 300, max: 640 }),
    dots: zSlider({ min: 24, max: 90 }),
    ring: zSlider({ min: 0, max: 12, step: 0.5 }),
    spin: zSlider({ min: 0, max: 1, step: 0.05 }),
  }),
  brand: z.object({
    logoHeight: zSlider({ min: 60, max: 240 }),
    plate: z.boolean(),
    nameCaps: z.boolean(),
    nameSize: zSlider({ min: 60, max: 160 }),
    nameTracking: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    taglineSize: zSlider({ min: 24, max: 64 }),
  }),
});

export type AnniversaryKineticProps = z.infer<typeof anniversaryKineticSchema>;

export const anniversaryKineticDefaults: AnniversaryKineticProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  years: '{{Years}}',
  founded: 'Est. {{Founded Year}}',
  tagline: '{{Tagline}}',
  badgeLine: '{{Badge Line}}',
  opening: { intro: 'Ahem...', leanIn: 'Lean in!', leanInRepeats: 3 },
  news: {
    weveGot: 'We’ve got',
    bigNews: 'big news',
    soGood: 'so good',
    toShare: 'to share',
    withYou: 'with you',
  },
  journey: {
    look: 'Look',
    howFar: 'how far',
    weve: 'we’ve',
    come: 'come',
    and: 'and',
    still: 'still',
    going: 'going',
    strong: 'strong',
  },
  milestone: { turning: 'Turning', today: 'today!', ordinal: true },
  values: { first: 'BOLDER.', second: 'BRIGHTER.', third: 'KINDER.', fourth: 'FEARLESS.' },
  colors: {
    primary: '#de5f37',
    secondary: '#8b6cc4',
    text: '#f4ede2',
    background: '#0b0a13',
    surface: '#f4ede2',
    deep: '#0b292a',
    plum: '#271a36',
    highlight: '#b5e655',
    name: '#1d5550',
    muted: '#6b5a7a',
  },
  showBackground: true,
  type: { font: 'grotesk', valueFont: 'mono', size: 190, valueSize: 180 },
  effects: {
    glitch: 1,
    noise: 0.5,
    streaks: 0.8,
    outlines: 0.8,
    stars: 70,
    grain: 0.12,
    bandTilt: -6,
  },
  timing: { pace: 1, endBuild: 26 },
  badge: { size: 480, dots: 54, ring: 6, spin: 0.3 },
  brand: {
    logoHeight: 170,
    plate: false,
    nameCaps: true,
    nameSize: 112,
    nameTracking: 0.14,
    taglineSize: 44,
  },
};

export const anniversaryKineticMeta: ClipMeta = {
  id: 'anniversary-kinetic',
  title: 'Anniversary Kinetic',
  description:
    'A fast kinetic-type anniversary teaser: "Ahem... Lean in! We’ve got big news so good to share with you. Look how far we’ve come and still going strong. Turning 25 today!" one or two words at a time, each with its own glitch, whip, wave or band, then your values in slab caps, landing on a cream end card with an anniversary badge, your logo and your name.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/anniversary-kinetic.tsx',
  category: 'kinetic-type',
  tags: [
    'kinetic',
    'headline',
    'text',
    'typing',
    'outline',
    'repeat',
    'stack',
    'badge',
    'end-card',
  ],
  durationInFrames: 450,
  posterFrame: 432,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
