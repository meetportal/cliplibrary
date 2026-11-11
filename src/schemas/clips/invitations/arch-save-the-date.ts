import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const ARCH_SCRIPT_FONTS = ['great-vibes', 'pinyon-script', 'parisienne', 'allura'] as const;

export type ArchScriptFont = (typeof ARCH_SCRIPT_FONTS)[number];

export const ARCH_CAPS_FONTS = ['marcellus', 'cinzel', 'cormorant-garamond'] as const;

export type ArchCapsFont = (typeof ARCH_CAPS_FONTS)[number];

const frameNumber = () => zSlider({ min: 0, max: 360 });

export const archSaveTheDateSchema = z.object({
  partnerOne: z.string(),
  partnerTwo: z.string(),
  eventDate: z.string(),
  venue: z.string(),
  host: z.string(),
  words: z.object({
    saveTop: z.string(),
    saveJoiner: z.string(),
    saveBottom: z.string(),
    intro: z.string(),
    joiner: z.string(),
    signOff: z.string(),
  }),
  colors: z.object({
    arch: zColor(),
    script: zColor(),
    text: zColor(),
    sky: zColor(),
    cloud: zColor(),
    dusk: zColor(),
    foliage: zColor(),
    flowers: zColor(),
    stone: zColor(),
    crystal: zColor(),
    gold: zColor(),
    jasmine: zColor(),
  }),
  showScenery: z.boolean(),
  lettering: z.object({
    scriptFont: z.enum(ARCH_SCRIPT_FONTS),
    capsFont: z.enum(ARCH_CAPS_FONTS),
    titleSize: zSlider({ min: 100, max: 240 }),
    nameSize: zSlider({ min: 36, max: 90 }),
    detailSize: zSlider({ min: 20, max: 44 }),
    hostSize: zSlider({ min: 36, max: 90 }),
    top: zSlider({ min: 520, max: 760, step: 2 }),
    haze: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  arcade: z.object({
    arches: zSlider({ min: 2, max: 8 }),
    dollyFrames: zSlider({ min: 60, max: 300 }),
    chandelier: z.boolean(),
    garlands: z.boolean(),
    sway: zSlider({ min: 0, max: 6, step: 0.1 }),
    rosettes: z.boolean(),
  }),
  sky: z.object({
    cloudDrift: zSlider({ min: 0, max: 2, step: 0.05 }),
    birds: zSlider({ min: 0, max: 9 }),
    duskStrength: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  timing: z.object({
    titleAt: frameNumber(),
    titleFrames: zSlider({ min: 6, max: 60 }),
    flourishAt: frameNumber(),
    flourishFrames: zSlider({ min: 10, max: 90 }),
    detailsAt: frameNumber(),
    lineStagger: zSlider({ min: 0, max: 30 }),
    wipeFrames: zSlider({ min: 6, max: 60 }),
    duskAt: frameNumber(),
  }),
});

export type ArchSaveTheDateProps = z.infer<typeof archSaveTheDateSchema>;

export const archSaveTheDateDefaults: ArchSaveTheDateProps = {
  partnerOne: '{{Partner One}}',
  partnerTwo: '{{Partner Two}}',
  eventDate: '{{Event Date}}',
  venue: '{{Venue}}, {{City}}',
  host: 'The {{Last Name}} Family',
  words: {
    saveTop: 'Save',
    saveJoiner: 'the',
    saveBottom: 'Date',
    intro: 'For the wedding of',
    joiner: '&',
    signOff: 'With love',
  },
  colors: {
    arch: '#e3949b',
    script: '#7d2148',
    text: '#5e2340',
    sky: '#8db5df',
    cloud: '#ffffff',
    dusk: '#f6c6c4',
    foliage: '#7dbb72',
    flowers: '#e0457e',
    stone: '#f5f1de',
    crystal: '#dfeaf5',
    gold: '#d1a85c',
    jasmine: '#fbf3dc',
  },
  showScenery: true,
  lettering: {
    scriptFont: 'great-vibes',
    capsFont: 'marcellus',
    titleSize: 172,
    nameSize: 62,
    detailSize: 30,
    hostSize: 60,
    top: 600,
    haze: 0.55,
  },
  arcade: {
    arches: 2,
    dollyFrames: 130,
    chandelier: true,
    garlands: true,
    sway: 3,
    rosettes: true,
  },
  sky: {
    cloudDrift: 1.3,
    birds: 8,
    duskStrength: 0.6,
  },
  timing: {
    titleAt: 0,
    titleFrames: 24,
    flourishAt: 20,
    flourishFrames: 44,
    detailsAt: 46,
    lineStagger: 9,
    wipeFrames: 28,
    duskAt: 60,
  },
};

export const archSaveTheDateMeta: ClipMeta = {
  id: 'arch-save-the-date',
  title: 'Palace Arch Save the Date',
  description:
    'A pink palace save the date: the camera glides through a row of scalloped arches hung with jasmine and crystal chandeliers to a sunny terrace, a script Save the Date fades in with drawn flourishes, then the couple, date, venue and hosts wipe in while the sky warms.',
  source: 'src/compositions/scenes/invitations/arch-save-the-date.tsx',
  posterFrame: 300,
  category: 'invitations',
  tags: ['wedding', 'invitation', 'camera-move', 'zoom', 'text'],
  theme: 'light',
  durationInFrames: 390,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
