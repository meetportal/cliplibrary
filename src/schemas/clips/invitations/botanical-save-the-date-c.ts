import {
  type BotanicalSaveTheDateProps,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '../../botanical-save-the-date-common';
import type { ClipMeta } from '../../registry';

export const botanicalSaveTheDateCSchema = botanicalSaveTheDateSchema;

export type BotanicalSaveTheDateCProps = BotanicalSaveTheDateProps;

export const botanicalSaveTheDateCDefaults: BotanicalSaveTheDateCProps = {
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
    script: '#5a3350',
    ink: '#352433',
    background: '#f9e6e5',
    surface: '#fbefee',
    petal: '#f6f1f2',
    heart: '#9c6f86',
    gold: '#c9a265',
    ghost: '#cdbfc4',
    line: '#c9a265',
  },
  showBackground: true,
  backdrop: { frame: 'hexagon', wash: false, washOpacity: 0.85, lineWidth: 4 },
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
    displayFont: 'cormorant',
    capsFont: 'cormorant',
    scriptFont: 'parisienne',
    reveal: 'block-cursor',
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

export const botanicalSaveTheDateCMeta: ClipMeta = botanicalSaveTheDateMeta('c', {
  id: 'botanical-save-the-date-c',
  title: 'Botanical Save the Date C',
  description:
    "A blush save the date inside a gold hexagon that draws on: watercolour leaf sprays with pale blossoms fly in from opposite corners around the couple's names, and a dark block cursor types the verse, SAVE the DATE, the date and the venue before a small crest arrives.",
  source: 'src/compositions/scenes/invitations/botanical-save-the-date-c.tsx',
  posterFrame: 300,
});
