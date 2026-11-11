import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const INVITE_SCRIPT_FONTS = [
  'great-vibes',
  'pinyon-script',
  'parisienne',
  'allura',
] as const;

export type InviteScriptFont = (typeof INVITE_SCRIPT_FONTS)[number];

export const INVITE_SERIF_FONTS = [
  'cinzel',
  'cormorant-garamond',
  'marcellus',
  'playfair-display',
] as const;

export type InviteSerifFont = (typeof INVITE_SERIF_FONTS)[number];

export const MANDALA_PATTERNS = ['jewel', 'lotus', 'sunburst'] as const;

export type MandalaPattern = (typeof MANDALA_PATTERNS)[number];

export const INVITE_LAYOUTS = ['split', 'center-then-aside', 'twin-mandalas'] as const;

export type InviteLayout = (typeof INVITE_LAYOUTS)[number];

export const goldMonogramInviteSchema = z.object({
  partnerOne: z.string(),
  partnerTwo: z.string(),
  joiner: z.string(),
  monogramLetters: z.string(),
  eyebrow: z.string(),
  invitationLine: zMultiline(),
  eventDate: z.string(),
  venue: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    surface: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.enum(INVITE_LAYOUTS),
  mandala: z.object({
    pattern: z.enum(MANDALA_PATTERNS),
    size: zSlider({ min: 280, max: 560, step: 2 }),
    lineWidth: zSlider({ min: 0.4, max: 2.5, step: 0.05 }),
    spin: zSlider({ min: -12, max: 12, step: 0.25 }),
    ringGap: zSlider({ min: 4, max: 30 }),
    ringDraw: zSlider({ min: 12, max: 90 }),
  }),
  monogram: z.object({
    size: zSlider({ min: 90, max: 220, step: 2 }),
    heart: z.boolean(),
    fillAt: zSlider({ min: 0, max: 120 }),
    glintAt: zSlider({ min: 0, max: 400 }),
  }),
  type: z.object({
    script: z.enum(INVITE_SCRIPT_FONTS),
    serif: z.enum(INVITE_SERIF_FONTS),
    namesSize: zSlider({ min: 60, max: 180, step: 2 }),
    lineSize: zSlider({ min: 24, max: 56 }),
    dateSize: zSlider({ min: 24, max: 60 }),
  }),
  reveal: z.object({
    start: zSlider({ min: 0, max: 200 }),
    stagger: zSlider({ min: 6, max: 40 }),
    glideAt: zSlider({ min: 30, max: 240 }),
    glideFrames: zSlider({ min: 30, max: 120 }),
  }),
  dust: z.object({
    count: zSlider({ min: 0, max: 120 }),
    size: zSlider({ min: 0.5, max: 4, step: 0.1 }),
    rise: zSlider({ min: 0, max: 4, step: 0.1 }),
  }),
  logoPlate: z.object({
    plate: z.boolean(),
    width: zSlider({ min: 120, max: 520, step: 4 }),
    height: zSlider({ min: 48, max: 200, step: 2 }),
  }),
});

export type GoldMonogramInviteProps = z.infer<typeof goldMonogramInviteSchema>;

export const goldMonogramInviteDefaults: GoldMonogramInviteProps = {
  partnerOne: '{{Partner One Name}}',
  partnerTwo: '{{Partner Two Name}}',
  joiner: '&',
  monogramLetters: '',
  eyebrow: 'The wedding of',
  invitationLine: '{{Invitation Line}}',
  eventDate: '{{Event Date}}',
  venue: '{{Venue}}, {{City}}',
  logo: '{{Logo}}',
  colors: { primary: '#c9a25a', text: '#f3ebdc', background: '#120d0a', surface: '#f6efe2' },
  showBackground: true,
  layout: 'split',
  mandala: { pattern: 'jewel', size: 430, lineWidth: 1, spin: 4, ringGap: 11, ringDraw: 56 },
  monogram: { size: 150, heart: true, fillAt: 44, glintAt: 290 },
  type: { script: 'great-vibes', serif: 'cinzel', namesSize: 124, lineSize: 36, dateSize: 38 },
  reveal: { start: 28, stagger: 30, glideAt: 150, glideFrames: 64 },
  dust: { count: 46, size: 1.6, rise: 1.2 },
  logoPlate: { plate: true, width: 260, height: 116 },
};

export const goldMonogramInviteMeta: ClipMeta = {
  id: 'gold-monogram-invite',
  title: 'Gold Monogram Invite',
  description:
    "A thin gold jewel mandala draws itself ring by ring and keeps turning on the left around a gold monogram of the couple's initials, while the names in gold script, an invitation line, the date, the venue and a logo arrive row by row on the right.",
  source: 'src/compositions/scenes/invitations/gold-monogram-invite.tsx',
  posterFrame: 390,
  category: 'invitations',
  tags: ['wedding', 'invitation', 'monogram', 'reveal', 'spin', 'glow'],
  theme: 'dark',
  durationInFrames: 420,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
};
