import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { inviteScriptFontSchema, inviteSerifFontSchema } from '../../invite-common';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const frames = (max: number) => zSlider({ min: 0, max });

const goldEventSchema = z.object({
  title: z.string(),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
});

export type GoldEvent = z.infer<typeof goldEventSchema>;

export const goldMonogramInviteSchema = z.object({
  quote: z.object({
    text: zMultiline(),
    scriptPhrase: z.string(),
    size: zSlider({ min: 28, max: 110 }),
    scriptScale: zSlider({ min: 0.8, max: 2, step: 0.05 }),
    x: zSlider({ min: 0, max: 1500 }),
    width: zSlider({ min: 400, max: 1400 }),
    start: frames(120),
    wordStagger: zSlider({ min: 0, max: 12, step: 0.5 }),
    end: frames(400),
  }),
  monogram: z.object({
    first: z.string(),
    second: z.string(),
    names: z.string(),
    eyebrow: z.string(),
    showHeart: z.boolean(),
    initialSize: zSlider({ min: 120, max: 420 }),
    spacing: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    ringRadius: zSlider({ min: 120, max: 360 }),
    namesSize: zSlider({ min: 40, max: 160 }),
    eyebrowSize: zSlider({ min: 14, max: 48 }),
    start: frames(400),
    drawFrames: zSlider({ min: 20, max: 120 }),
    glint: z.boolean(),
    glintFrames: zSlider({ min: 16, max: 90 }),
  }),
  events: z.array(goldEventSchema).min(1).max(4),
  schedule: z.object({
    start: frames(480),
    stagger: zSlider({ min: 0, max: 60 }),
    titleSize: zSlider({ min: 36, max: 120 }),
    detailSize: zSlider({ min: 16, max: 48 }),
    centerX: zSlider({ min: 600, max: 1800 }),
    rowGap: zSlider({ min: 0, max: 120 }),
    shrinkFrames: zSlider({ min: 20, max: 90 }),
    monogramScale: zSlider({ min: 0.4, max: 1, step: 0.01 }),
    monogramX: zSlider({ min: 200, max: 1100 }),
    monogramY: zSlider({ min: 300, max: 780 }),
  }),
  fonts: z.object({
    script: inviteScriptFontSchema,
    serif: inviteSerifFontSchema,
  }),
  mandala: z.object({
    spin: zSlider({ min: -12, max: 12, step: 0.5 }),
    radius: zSlider({ min: 240, max: 900 }),
    x: zSlider({ min: -600, max: 1920 }),
    y: zSlider({ min: 0, max: 1080 }),
    lineWidth: zSlider({ min: 0.5, max: 4, step: 0.1 }),
    drawFrames: zSlider({ min: 30, max: 240 }),
    restOpacity: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  dust: z.object({
    count: zSlider({ min: 0, max: 90 }),
    size: zSlider({ min: 0.5, max: 4, step: 0.1 }),
    rise: zSlider({ min: 0, max: 3, step: 0.05 }),
  }),
  gold: z.object({
    light: zColor(),
    dark: zColor(),
  }),
  text: z.object({
    cream: zColor(),
    muted: zColor(),
  }),
  background: z.object({
    show: z.boolean(),
    color: zColor(),
    edge: zColor(),
    vignette: zSlider({ min: 0, max: 0.5, step: 0.01 }),
  }),
  motion: motionSchema,
});

export type GoldMonogramInviteProps = z.infer<typeof goldMonogramInviteSchema>;

export const goldMonogramInviteDefaults: GoldMonogramInviteProps = {
  quote: {
    text: 'Two hearts, one promise,\nand a story we will write\ntogether, forever.',
    scriptPhrase: 'together, forever.',
    size: 64,
    scriptScale: 1.45,
    x: 860,
    width: 900,
    start: 18,
    wordStagger: 4,
    end: 150,
  },
  monogram: {
    first: 'S',
    second: 'R',
    names: 'Sana & Reyansh',
    eyebrow: 'The wedding of',
    showHeart: true,
    initialSize: 224,
    spacing: 0.13,
    ringRadius: 210,
    namesSize: 92,
    eyebrowSize: 24,
    start: 156,
    drawFrames: 60,
    glint: true,
    glintFrames: 44,
  },
  events: [
    { title: 'Mehendi', date: '20 December 2026', time: '4 pm', venue: 'The Courtyard' },
    { title: 'Sangeet', date: '21 December 2026', time: '7 pm', venue: 'Rose Garden Lawns' },
    { title: 'Wedding', date: '22 December 2026', time: '6 pm', venue: 'The Grand Palace Hall' },
  ],
  schedule: {
    start: 318,
    stagger: 24,
    titleSize: 76,
    detailSize: 26,
    centerX: 1360,
    rowGap: 34,
    shrinkFrames: 54,
    monogramScale: 0.66,
    monogramX: 680,
    monogramY: 520,
  },
  fonts: {
    script: 'great-vibes',
    serif: 'marcellus',
  },
  mandala: {
    spin: 3,
    radius: 560,
    x: -40,
    y: 540,
    lineWidth: 1.4,
    drawFrames: 120,
    restOpacity: 0.5,
  },
  dust: {
    count: 36,
    size: 1.6,
    rise: 0.6,
  },
  gold: {
    light: '#f4e4b8',
    dark: '#a9792f',
  },
  text: {
    cream: '#f3ebdc',
    muted: '#b8ab92',
  },
  background: {
    show: true,
    color: '#140f0b',
    edge: '#050403',
    vignette: 0.32,
  },
  motion: defaultMotion({ exitFrames: 18 }),
};

export const goldMonogramInviteMeta: ClipMeta = {
  ...promoMeta,
  id: 'gold-monogram-invite',
  title: 'Gold Monogram Invite',
  description:
    'A thin gold mandala draws itself ring by ring beside a quote, then a gold monogram is drawn and filled, glints once and shrinks aside for the event schedule.',
  category: 'invitations',
  tags: ['wedding', 'invitation', 'monogram', 'draw', 'reveal', 'text', 'glow'],
  theme: 'dark',
  source: 'src/compositions/scenes/invitations/gold-monogram-invite.tsx',
  durationInFrames: 510,
  posterFrame: 440,
};
