import {
  COMING_SOON_WORDS,
  type ComingSoonFlipsProps,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from '../../coming-soon-flips-common';
import type { ClipMeta } from '../../registry';

export const comingSoonFlipsBSchema = comingSoonFlipsSchema;

export type ComingSoonFlipsBProps = ComingSoonFlipsProps;

export const comingSoonFlipsBDefaults: ComingSoonFlipsBProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  words: COMING_SOON_WORDS('background', 'primary'),
  colors: {
    primary: '#f0b429',
    background: '#141210',
    text: '#f6efe2',
    wall: '#eadfcb',
    wallShade: '#e1d5be',
    speck: '#c4ae8a',
    name: '#141210',
    plate: '#fffaf0',
  },
  showBackground: true,
  type: {
    font: 'anton',
    size: 210,
    tracking: 0.01,
    y: 0.49,
    flickerFonts: [
      'serif',
      'marker',
      'didone',
      'hand',
      'main',
      'thin',
      'brush',
      'light',
      'fat-face',
    ],
    flickerHold: 2,
  },
  underline: { show: true, width: 1, startWidth: 0, thickness: 10, gap: 30 },
  title: {
    top: 'ALMOST',
    bottom: 'HERE',
    font: 'serif',
    topSize: 128,
    bottomSize: 250,
    tracking: 0.02,
    gap: 26,
    outlined: 'none',
    outline: 3,
    y: 0.11,
    spread: 1.5,
    settleFrames: 32,
    appearFrames: 9,
    flickerFrames: 8,
    seed: 34,
  },
  lockup: {
    y: 0.53,
    logoSize: 400,
    logoMaxWidth: 840,
    plate: false,
    platePadding: 28,
    nameFont: 'serif',
    nameSize: 78,
    nameGap: 44,
  },
  wall: { blotchScale: 0.012, blotchAmount: 0.4, speckAmount: 0.25, seed: 23 },
  light: {
    angle: 55,
    slats: 3,
    slatGap: 170,
    softness: 48,
    strength: 1.1,
    restWidth: 320,
    titleMargin: 70,
    sweepFrames: 64,
    swing: 1,
    settleFrames: 58,
  },
  flashFrames: 2,
  grain: 0.05,
};

export const comingSoonFlipsBMeta: ClipMeta = comingSoonFlipsMeta('b', {
  id: 'coming-soon-flips-b',
  title: 'Coming Soon Flips B',
  description:
    'A coming soon teaser in warm black and marigold: heavy condensed words hard cut one at a time over a full-width bar, one stuttering through typefaces, then a serif ALMOST HERE tracks in while three slats of warm window light sweep a sand plaster wall and come to rest on your logo and name.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/coming-soon-flips-b.tsx',
});
