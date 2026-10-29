import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import { inviteScriptFontSchema, inviteSerifFontSchema } from '../../invite-common';
import { defaultMotion, lightLook, lookSchema, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const frames = (max = 900) => zSlider({ min: 0, max });

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

export const PAN_DIRECTIONS = ['left', 'right'] as const;

export const TIMES_OF_DAY = ['day', 'dusk', 'night'] as const;

export type TimeOfDay = (typeof TIMES_OF_DAY)[number];

export const miniaturePanoramaSchema = z.object({
  invite: z.object({
    show: z.boolean(),
    names: z.string(),
    line: z.string(),
    date: z.string(),
    scriptFont: inviteScriptFontSchema,
    serifFont: inviteSerifFontSchema,
    namesSize: zSlider({ min: 60, max: 260 }),
    lineSize: zSlider({ min: 14, max: 90 }),
    dateSize: zSlider({ min: 14, max: 110 }),
    tracking: unit(0.6),
    gap: zSlider({ min: 0, max: 160 }),
    centerY: zSlider({ min: 200, max: 1700 }),
    start: frames(),
    rise: zSlider({ min: 0, max: 160 }),
    dayColor: zColor(),
    duskColor: zColor(),
    nightColor: zColor(),
    halo: zColor(),
    haloStrength: unit(),
  }),
  pan: z.object({
    speed: unit(10, 0.1),
    direction: z.enum(PAN_DIRECTIONS),
    parallax: unit(1),
  }),
  timelapse: z.object({
    enabled: z.boolean(),
    hold: z.enum(TIMES_OF_DAY),
    start: frames(),
    dusk: frames(),
    night: frames(),
  }),
  sky: z.object({
    dayTop: zColor(),
    dayHorizon: zColor(),
    duskTop: zColor(),
    duskHorizon: zColor(),
    nightTop: zColor(),
    nightHorizon: zColor(),
    clouds: zColor(),
    cloudCount: zSlider({ min: 0, max: 6, step: 1 }),
  }),
  shade: z.object({
    duskTint: zColor(),
    duskStrength: unit(),
    nightTint: zColor(),
    nightStrength: unit(),
  }),
  hills: z.object({
    far: zColor(),
    near: zColor(),
  }),
  pavilions: z.object({
    stone: zColor(),
    shade: zColor(),
    gold: zColor(),
  }),
  trees: z.object({
    dark: zColor(),
    mid: zColor(),
    light: zColor(),
    trunk: zColor(),
  }),
  lake: z.object({
    water: zColor(),
    ripple: zColor(),
    pad: zColor(),
    lotus: zColor(),
    showSwans: z.boolean(),
    swan: zColor(),
    beak: zColor(),
  }),
  railing: z.object({
    marble: zColor(),
    shade: zColor(),
  }),
  peacock: z.object({
    show: z.boolean(),
    body: zColor(),
    tail: zColor(),
    eyes: zColor(),
  }),
  path: z.object({
    sand: zColor(),
    pebbles: zColor(),
  }),
  lights: z.object({
    onAt: unit(2),
    glow: zColor(),
    flame: zColor(),
  }),
  stars: z.object({
    count: zSlider({ min: 0, max: 80, step: 1 }),
    color: zColor(),
  }),
  birds: z.object({
    count: zSlider({ min: 0, max: 8, step: 1 }),
    color: zColor(),
  }),
  marigolds: z.object({
    show: z.boolean(),
    orange: zColor(),
    yellow: zColor(),
    leaf: zColor(),
    sway: unit(6, 0.1),
  }),
  procession: z.object({
    show: z.boolean(),
    start: frames(),
    speed: unit(10, 0.1),
    scale: zSlider({ min: 0.5, max: 1.6, step: 0.01 }),
    walkers: zSlider({ min: 0, max: 8, step: 1 }),
    elephant: zColor(),
    blanket: zColor(),
    canopy: zColor(),
    trim: zColor(),
    kurta: zColor(),
    turban: zColor(),
    skin: zColor(),
  }),
  look: lookSchema,
  motion: motionSchema,
});

export type MiniaturePanoramaProps = z.infer<typeof miniaturePanoramaSchema>;

export const miniaturePanoramaDefaults: MiniaturePanoramaProps = {
  invite: {
    show: true,
    names: 'Tara & Vihaan',
    line: 'are getting married',
    date: '12 . 12 . 2026',
    scriptFont: 'great-vibes',
    serifFont: 'cinzel',
    namesSize: 150,
    lineSize: 34,
    dateSize: 46,
    tracking: 0.28,
    gap: 26,
    centerY: 640,
    start: 60,
    rise: 44,
    dayColor: '#4a2c1d',
    duskColor: '#5b1f1c',
    nightColor: '#fbecd2',
    halo: '#0e1534',
    haloStrength: 0.8,
  },
  pan: { speed: 2.6, direction: 'left', parallax: 1 },
  timelapse: { enabled: true, hold: 'day', start: 70, dusk: 220, night: 370 },
  sky: {
    dayTop: '#86bfe0',
    dayHorizon: '#e7f1ea',
    duskTop: '#c7889c',
    duskHorizon: '#fbc48a',
    nightTop: '#0e1534',
    nightHorizon: '#2e3a70',
    clouds: '#fbfaf5',
    cloudCount: 4,
  },
  shade: {
    duskTint: '#e0866a',
    duskStrength: 0.28,
    nightTint: '#141a3a',
    nightStrength: 0.62,
  },
  hills: { far: '#a9c4cf', near: '#7fa6a8' },
  pavilions: { stone: '#efd7bd', shade: '#c99f86', gold: '#d9a441' },
  trees: { dark: '#2f5d3a', mid: '#4f8a4c', light: '#8dbb62', trunk: '#7a5236' },
  lake: {
    water: '#3f8fae',
    ripple: '#9fd3e0',
    pad: '#4f9a5a',
    lotus: '#f29ab6',
    showSwans: true,
    swan: '#fbf8f2',
    beak: '#e8803a',
  },
  railing: { marble: '#f6f1e8', shade: '#cfc5b6' },
  peacock: { show: true, body: '#1f5fae', tail: '#2f8a6a', eyes: '#d9a441' },
  path: { sand: '#e2c9a0', pebbles: '#c4a57c' },
  lights: { onAt: 0.8, glow: '#ffc65c', flame: '#fff1c4' },
  stars: { count: 36, color: '#fff6dc' },
  birds: { count: 5, color: '#3b3f52' },
  marigolds: { show: true, orange: '#f08a1c', yellow: '#f7bd24', leaf: '#4f8a3c', sway: 1.8 },
  procession: {
    show: true,
    start: 270,
    speed: 3.6,
    scale: 1,
    walkers: 6,
    elephant: '#8e8a99',
    blanket: '#b8262f',
    canopy: '#d9a441',
    trim: '#f7d36b',
    kurta: '#fbf3e4',
    turban: '#e2552b',
    skin: '#a8714f',
  },
  look: lightLook('#d9a441'),
  motion: defaultMotion({ exit: 'fade', exitFrames: 16 }),
};

export const miniaturePanoramaMeta: ClipMeta = {
  ...promoMeta,
  width: 1080,
  height: 1920,
  id: 'miniature-panorama',
  title: 'Miniature Panorama',
  description:
    'A painted Rajasthani lakeside pans sideways in parallax from day through sunset to night, lanterns lighting up as a small baraat procession walks across.',
  category: 'invitations',
  tags: ['wedding', 'invitation', 'panorama', 'backdrop', 'slide'],
  theme: 'light',
  source: 'src/compositions/scenes/invitations/miniature-panorama.tsx',
  durationInFrames: 450,
  posterFrame: 330,
};
