import {
  COMING_SOON_WORDS,
  type ComingSoonFlipsProps,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from '../../coming-soon-flips-common';
import type { ClipMeta } from '../../registry';

export const comingSoonFlipsASchema = comingSoonFlipsSchema;

export type ComingSoonFlipsAProps = ComingSoonFlipsProps;

export const comingSoonFlipsADefaults: ComingSoonFlipsAProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  words: COMING_SOON_WORDS('primary', 'background'),
  colors: {
    primary: '#ff6b35',
    background: '#111933',
    text: '#fff3e6',
    wall: '#dde6f2',
    wallShade: '#cfdbeb',
    speck: '#a9bbd4',
    name: '#111933',
    plate: '#f6f3ee',
  },
  showBackground: true,
  type: {
    font: 'antonio',
    size: 200,
    tracking: 0,
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
  underline: { show: true, width: 0.5, startWidth: 0.35, thickness: 8, gap: 34 },
  title: {
    top: 'ALMOST',
    bottom: 'HERE',
    font: 'extended',
    topSize: 120,
    bottomSize: 232,
    tracking: 0.035,
    gap: 26,
    outlined: 'top',
    outline: 4,
    y: 0.11,
    spread: 1.5,
    settleFrames: 32,
    appearFrames: 9,
    flickerFrames: 8,
    seed: 34,
  },
  lockup: {
    y: 0.53,
    logoSize: 340,
    logoMaxWidth: 840,
    plate: false,
    platePadding: 28,
    nameFont: 'rounded',
    nameSize: 72,
    nameGap: 44,
  },
  wall: { blotchScale: 0.012, blotchAmount: 0.4, speckAmount: 0.25, seed: 11 },
  light: {
    angle: 65,
    slats: 2,
    slatGap: 250,
    softness: 72,
    strength: 1.1,
    restWidth: 300,
    titleMargin: 70,
    sweepFrames: 64,
    swing: 1,
    settleFrames: 58,
  },
  flashFrames: 2,
  grain: 0.05,
};

export const comingSoonFlipsAMeta: ClipMeta = comingSoonFlipsMeta('a', {
  id: 'coming-soon-flips-a',
  title: 'Coming Soon Flips A',
  description:
    'A coming soon teaser: condensed words hard cut one at a time between tangerine and navy plates with a growing underline, one stuttering through typefaces, then an outlined ALMOST over a solid HERE tracks in while two slats of window light sweep a plaster wall and come to rest on your logo and name.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/coming-soon-flips-a.tsx',
});
