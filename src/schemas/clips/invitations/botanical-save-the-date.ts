import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const BOTANICAL_DISPLAY_FONTS = ['bodoni-moda', 'playfair-display', 'cormorant'] as const;

export type BotanicalDisplayFont = (typeof BOTANICAL_DISPLAY_FONTS)[number];

export const BOTANICAL_CAPS_FONTS = ['cinzel', 'marcellus', 'cormorant'] as const;

export type BotanicalCapsFont = (typeof BOTANICAL_CAPS_FONTS)[number];

export const BOTANICAL_SCRIPT_FONTS = ['great-vibes', 'pinyon-script', 'parisienne'] as const;

export type BotanicalScriptFont = (typeof BOTANICAL_SCRIPT_FONTS)[number];

export const BOTANICAL_FRAMES = ['none', 'arch', 'hexagon'] as const;

export const BOTANICAL_REVEALS = ['soft-type', 'block-cursor'] as const;

const frameNumber = () => zSlider({ min: 0, max: 360 });

export const botanicalSaveTheDateSchema = z.object({
  partnerOne: z.string(),
  partnerTwo: z.string(),
  logo: zImage(),
  verse: zMultiline(),
  date: z.string(),
  venue: z.string(),
  words: z.object({
    saveTop: z.string(),
    saveJoiner: z.string(),
    saveBottom: z.string(),
    intro: z.string(),
    joiner: z.string(),
  }),
  colors: z.object({
    leaf: zColor(),
    script: zColor(),
    ink: zColor(),
    background: zColor(),
    surface: zColor(),
    petal: zColor(),
    heart: zColor(),
    gold: zColor(),
    ghost: zColor(),
    line: zColor(),
  }),
  showBackground: z.boolean(),
  backdrop: z.object({
    frame: z.enum(BOTANICAL_FRAMES),
    wash: z.boolean(),
    washOpacity: zSlider({ min: 0, max: 1, step: 0.01 }),
    lineWidth: zSlider({ min: 1, max: 10, step: 0.5 }),
  }),
  florals: z.object({
    size: zSlider({ min: 0.6, max: 1.3, step: 0.01 }),
    sway: zSlider({ min: 0, max: 6, step: 0.1 }),
    swayPeriod: zSlider({ min: 60, max: 400 }),
    slide: zSlider({ min: 0, max: 500 }),
    enterFrames: zSlider({ min: 8, max: 60 }),
    stagger: zSlider({ min: 0, max: 40 }),
    goldLines: z.boolean(),
  }),
  lettering: z.object({
    displayFont: z.enum(BOTANICAL_DISPLAY_FONTS),
    capsFont: z.enum(BOTANICAL_CAPS_FONTS),
    scriptFont: z.enum(BOTANICAL_SCRIPT_FONTS),
    reveal: z.enum(BOTANICAL_REVEALS),
    nameSize: zSlider({ min: 60, max: 180 }),
    saveSize: zSlider({ min: 80, max: 220 }),
    capsSize: zSlider({ min: 22, max: 60 }),
    scriptSize: zSlider({ min: 40, max: 130 }),
    tracking: zSlider({ min: 0, max: 0.3, step: 0.01 }),
    top: zSlider({ min: 380, max: 800, step: 2 }),
    logoHeight: zSlider({ min: 50, max: 200, step: 2 }),
  }),
  timing: z.object({
    verseAt: frameNumber(),
    eraseAt: frameNumber(),
    saveAt: frameNumber(),
    dateAt: frameNumber(),
    venueAt: frameNumber(),
    logoAt: frameNumber(),
    typeFrames: zSlider({ min: 8, max: 90 }),
    lineStagger: zSlider({ min: 0, max: 30 }),
    eraseFrames: zSlider({ min: 6, max: 40 }),
  }),
});

export type BotanicalSaveTheDateProps = z.infer<typeof botanicalSaveTheDateSchema>;

export const botanicalSaveTheDateDefaults: BotanicalSaveTheDateProps = {
  partnerOne: '{{Partner One}}',
  partnerTwo: '{{Partner Two}}',
  logo: '{{Logo}}',
  verse: '{{Tagline}}',
  date: '{{Event Date}}',
  venue: '{{Venue}}',
  words: {
    saveTop: 'Save',
    saveJoiner: 'the',
    saveBottom: 'Date',
    intro: 'for the wedding of',
    joiner: 'and',
  },
  colors: {
    leaf: '#6f9078',
    script: '#4b3045',
    ink: '#3f2a3a',
    background: '#fae8e7',
    surface: '#f0c3ae',
    petal: '#f6f1f2',
    heart: '#9c6f86',
    gold: '#c9a265',
    ghost: '#cdbfc4',
    line: '#e9cdbd',
  },
  showBackground: true,
  backdrop: { frame: 'none', wash: true, washOpacity: 0.85, lineWidth: 4 },
  florals: {
    size: 0.92,
    sway: 1.4,
    swayPeriod: 210,
    slide: 300,
    enterFrames: 30,
    stagger: 14,
    goldLines: true,
  },
  lettering: {
    displayFont: 'bodoni-moda',
    capsFont: 'cinzel',
    scriptFont: 'great-vibes',
    reveal: 'soft-type',
    nameSize: 112,
    saveSize: 140,
    capsSize: 32,
    scriptSize: 76,
    tracking: 0.08,
    top: 545,
    logoHeight: 120,
  },
  timing: {
    verseAt: 24,
    eraseAt: 126,
    saveAt: 150,
    dateAt: 172,
    venueAt: 222,
    logoAt: 262,
    typeFrames: 44,
    lineStagger: 8,
    eraseFrames: 22,
  },
};

export const botanicalSaveTheDateMeta: ClipMeta = {
  id: 'botanical-save-the-date',
  title: 'Botanical Save the Date',
  description:
    "A blush save the date: watercolour leaf sprays with pale blossoms fly in from opposite corners around the couple's names over a peach wash, a verse types in and erases, then a bold SAVE the DATE, the date, the venue and a small crest arrive.",
  source: 'src/compositions/scenes/invitations/botanical-save-the-date.tsx',
  posterFrame: 300,
  category: 'invitations',
  tags: ['wedding', 'invitation', 'floral', 'typing', 'text'],
  theme: 'light',
  durationInFrames: 390,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
};
