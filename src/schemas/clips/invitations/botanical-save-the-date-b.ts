import {
  type BotanicalSaveTheDateProps,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '../../botanical-save-the-date-common';
import type { ClipMeta } from '../../registry';

export const botanicalSaveTheDateBSchema = botanicalSaveTheDateSchema;

export type BotanicalSaveTheDateBProps = BotanicalSaveTheDateProps;

export const botanicalSaveTheDateBDefaults: BotanicalSaveTheDateBProps = {
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
    script: '#8a4a5e',
    ink: '#3a2a33',
    background: '#f8e4e3',
    surface: '#f6eee6',
    petal: '#f6f1f2',
    heart: '#9c6f86',
    gold: '#c9a265',
    ghost: '#d6c4c6',
    line: '#ecd2c4',
  },
  showBackground: true,
  backdrop: { frame: 'arch', wash: false, washOpacity: 0.85, lineWidth: 8 },
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
    displayFont: 'playfair-display',
    capsFont: 'marcellus',
    scriptFont: 'pinyon-script',
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

export const botanicalSaveTheDateBMeta: ClipMeta = botanicalSaveTheDateMeta('b', {
  id: 'botanical-save-the-date-b',
  title: 'Botanical Save the Date B',
  description:
    "A blush save the date on a cream arch card: watercolour leaf sprays with pale blossoms fly in over the arch from opposite corners around the couple's names, a verse types in and erases, then SAVE the DATE, the date, the venue and a small crest arrive.",
  source: 'src/compositions/scenes/invitations/botanical-save-the-date-b.tsx',
  posterFrame: 300,
});
