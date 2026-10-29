import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { inviteScriptFontSchema, inviteSerifFontSchema } from '../../invite-common';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

export const ITINERARY_SCENES = ['garden', 'garlands', 'lights', 'mandap'] as const;

export type ItineraryScene = (typeof ITINERARY_SCENES)[number];

const pagePaletteShape = {
  scene: z.enum(ITINERARY_SCENES),
  background: zColor(),
  textColor: zColor(),
  titleColor: zColor(),
  accent: zColor(),
  greenery: zColor(),
  structure: zColor(),
};

const pagePaletteSchema = z.object(pagePaletteShape);

export type ItineraryPalette = z.infer<typeof pagePaletteSchema>;

export const itineraryEventSchema = z.object({
  name: zMultiline(),
  date: z.string(),
  venue: zMultiline(),
  schedule: zMultiline(),
  ...pagePaletteShape,
});

export type ItineraryEvent = z.infer<typeof itineraryEventSchema>;

export const weddingItineraryPagesSchema = z.object({
  cover: z.object({
    monogram: z.string(),
    names: z.string(),
    dates: z.string(),
    hashtag: z.string(),
    ...pagePaletteShape,
  }),
  events: z.array(itineraryEventSchema).min(1).max(5),
  closing: z.object({
    message: zMultiline(),
    rsvp: z.string(),
    hosts: z.string(),
    ...pagePaletteShape,
  }),
  type: z.object({
    scriptFont: inviteScriptFontSchema,
    serifFont: inviteSerifFontSchema,
    titleSize: zSlider({ min: 60, max: 260 }),
    namesSize: zSlider({ min: 60, max: 260 }),
    messageSize: zSlider({ min: 50, max: 200 }),
    lineSize: zSlider({ min: 20, max: 72 }),
    monogramSize: zSlider({ min: 30, max: 200 }),
    serifWeight: zSlider({ min: 400, max: 700, step: 100 }),
    tracking: zSlider({ min: 0, max: 0.4, step: 0.005 }),
    lineSpacing: zSlider({ min: 1.1, max: 2.6, step: 0.05 }),
  }),
  ring: z.object({
    radius: zSlider({ min: 80, max: 340 }),
    width: zSlider({ min: 1, max: 12, step: 0.5 }),
    leaves: z.boolean(),
    start: zSlider({ min: 0, max: 60 }),
    drawFrames: zSlider({ min: 10, max: 120 }),
  }),
  layout: z.object({
    centerY: zSlider({ min: 300, max: 1400 }),
    titleGap: zSlider({ min: 0, max: 120 }),
    blockGap: zSlider({ min: 0, max: 80 }),
    divider: z.boolean(),
    dividerWidth: zSlider({ min: 40, max: 600 }),
  }),
  scenery: z.object({
    scale: zSlider({ min: 0.5, max: 1.5, step: 0.01 }),
    shadow: zSlider({ min: 0, max: 0.5, step: 0.01 }),
    drift: zSlider({ min: 0, max: 3, step: 0.05 }),
    sway: zSlider({ min: 0, max: 3, step: 0.05 }),
    riseFrames: zSlider({ min: 10, max: 90 }),
    riseDelay: zSlider({ min: 0, max: 40 }),
  }),
  timing: z.object({
    pageFrames: zSlider({ min: 60, max: 300 }),
    transitionFrames: zSlider({ min: 6, max: 40 }),
    titleDelay: zSlider({ min: 0, max: 60 }),
    typeDelay: zSlider({ min: 0, max: 90 }),
    coverDelay: zSlider({ min: 0, max: 90 }),
    charFrames: zSlider({ min: 0.25, max: 4, step: 0.05 }),
    lineGap: zSlider({ min: 0, max: 30 }),
    caretHold: zSlider({ min: 0, max: 60 }),
    caretBlink: zSlider({ min: 8, max: 40 }),
  }),
  look: z.object({
    showBackdrop: z.boolean(),
    glow: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  }),
  motion: motionSchema,
});

export type WeddingItineraryPagesProps = z.infer<typeof weddingItineraryPagesSchema>;

export const weddingItineraryPagesDefaults: WeddingItineraryPagesProps = {
  cover: {
    monogram: 'A | K',
    names: 'Anaya & Kabir',
    dates: '21 . 22 . 23 November 2026',
    // biome-ignore lint/security/noSecrets: a wedding hashtag, not a secret
    hashtag: '#KabirFoundHisAnaya',
    scene: 'garden',
    background: '#edf0e2',
    textColor: '#46553f',
    titleColor: '#2f4636',
    accent: '#b08a4f',
    greenery: '#7f9f78',
    structure: '#f4e7cc',
  },
  events: [
    {
      name: 'Haldi',
      date: 'Saturday | 21 November 2026',
      venue: 'The Marigold Courtyard\nMehra Haveli, Jaipur',
      schedule: 'Haldi at 10 am\nLunch at 1 pm',
      scene: 'garlands',
      background: '#f8e5a6',
      textColor: '#6a4a1e',
      titleColor: '#9b5a14',
      accent: '#ee8f22',
      greenery: '#7f9640',
      structure: '#c8553d',
    },
    {
      name: 'Sangeet',
      date: 'Sunday | 22 November 2026',
      venue: 'The Lantern Lawns\nAmber View Gardens, Jaipur',
      schedule: 'Music, dance and dinner\nFrom 7 pm',
      scene: 'lights',
      background: '#14393f',
      textColor: '#efe6d2',
      titleColor: '#f0cf86',
      accent: '#ffd47a',
      greenery: '#0b2629',
      structure: '#b4533f',
    },
    {
      name: 'Wedding &\nReception',
      date: 'Monday | 23 November 2026',
      venue: 'The Rose Terrace\nAmber View Gardens, Jaipur',
      schedule: 'Pheras at 6 pm\nReception from 8 pm',
      scene: 'mandap',
      background: '#f6dcd5',
      textColor: '#6b2f36',
      titleColor: '#8e3443',
      accent: '#d86f7d',
      greenery: '#8aa07f',
      structure: '#cfa15e',
    },
  ],
  closing: {
    message: "We can't wait\nto celebrate with you",
    rsvp: 'RSVP by 1 October',
    hosts: 'Ritu & Vikram Mehra',
    scene: 'garden',
    background: '#f4e4cf',
    textColor: '#5a3f33',
    titleColor: '#7a3f2c',
    accent: '#c0874a',
    greenery: '#8c9c6b',
    structure: '#fbf1e1',
  },
  type: {
    scriptFont: 'great-vibes',
    serifFont: 'cinzel',
    titleSize: 150,
    namesSize: 132,
    messageSize: 96,
    lineSize: 34,
    monogramSize: 84,
    serifWeight: 500,
    tracking: 0.08,
    lineSpacing: 1.75,
  },
  ring: {
    radius: 170,
    width: 3.5,
    leaves: true,
    start: 4,
    drawFrames: 54,
  },
  layout: {
    centerY: 730,
    titleGap: 30,
    blockGap: 22,
    divider: true,
    dividerWidth: 200,
  },
  scenery: {
    scale: 1.12,
    shadow: 0.14,
    drift: 1,
    sway: 1,
    riseFrames: 50,
    riseDelay: 6,
  },
  timing: {
    pageFrames: 120,
    transitionFrames: 20,
    titleDelay: 16,
    typeDelay: 32,
    coverDelay: 26,
    charFrames: 0.5,
    lineGap: 4,
    caretHold: 26,
    caretBlink: 18,
  },
  look: {
    showBackdrop: true,
    glow: 0.16,
  },
  motion: defaultMotion({ exit: 'fade', exitFrames: 16 }),
};

export const weddingItineraryPagesMeta: ClipMeta = {
  ...promoMeta,
  width: 1080,
  height: 1920,
  id: 'wedding-itinerary-pages',
  title: 'Wedding Itinerary Pages',
  description:
    'A vertical wedding invite that turns through a monogram cover, one page per event and an RSVP page, each line typing on with a caret while a paper-cut scene rises at the bottom.',
  category: 'invitations',
  tags: ['wedding', 'invitation', 'typing', 'caret', 'floral', 'monogram', 'paper', 'crossfade'],
  theme: 'light',
  source: 'src/compositions/scenes/invitations/wedding-itinerary-pages.tsx',
  durationInFrames: 620,
  posterFrame: 100,
};
