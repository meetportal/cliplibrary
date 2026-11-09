import {
  type BotanicalSaveTheDateProps,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '../../botanical-save-the-date-common';
import type { ClipMeta } from '../../registry';

export const botanicalSaveTheDateASchema = botanicalSaveTheDateSchema;

export type BotanicalSaveTheDateAProps = BotanicalSaveTheDateProps;

export const botanicalSaveTheDateADefaults: BotanicalSaveTheDateAProps = {
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

export const botanicalSaveTheDateAMeta: ClipMeta = botanicalSaveTheDateMeta('a', {
  id: 'botanical-save-the-date-a',
  title: 'Botanical Save the Date A',
  description:
    "A blush save the date: watercolour leaf sprays with pale blossoms fly in from opposite corners around the couple's names over a peach wash, a verse types in and erases, then a bold SAVE the DATE, the date, the venue and a small crest arrive.",
  source: 'src/compositions/scenes/invitations/botanical-save-the-date-a.tsx',
  posterFrame: 300,
});
