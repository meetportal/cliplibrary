import {
  COMING_SOON_WORDS,
  type ComingSoonFlipsProps,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from '../../coming-soon-flips-common';
import type { ClipMeta } from '../../registry';

export const comingSoonFlipsCSchema = comingSoonFlipsSchema;

export type ComingSoonFlipsCProps = ComingSoonFlipsProps;

export const comingSoonFlipsCDefaults: ComingSoonFlipsCProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  words: COMING_SOON_WORDS('primary', 'background'),
  colors: {
    primary: '#ff5a6e',
    background: '#1a1030',
    text: '#fbeff3',
    wall: '#e6deec',
    wallShade: '#ddd3e6',
    speck: '#b3a4c6',
    name: '#1a1030',
    plate: '#fbf8fd',
  },
  showBackground: true,
  type: {
    font: 'big-shoulders',
    size: 220,
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
    font: 'grotesk',
    topSize: 104,
    bottomSize: 200,
    tracking: 0.03,
    gap: 24,
    outlined: 'top',
    outline: 4,
    y: 0.675,
    spread: 1.5,
    settleFrames: 32,
    appearFrames: 9,
    flickerFrames: 8,
    seed: 34,
  },
  lockup: {
    y: 0.415,
    logoSize: 360,
    logoMaxWidth: 840,
    plate: false,
    platePadding: 28,
    nameFont: 'grotesk',
    nameSize: 68,
    nameGap: 44,
  },
  wall: { blotchScale: 0.012, blotchAmount: 0.4, speckAmount: 0.25, seed: 41 },
  light: {
    angle: 180,
    slats: 4,
    slatGap: 120,
    softness: 30,
    strength: 1.15,
    restWidth: 280,
    titleMargin: 70,
    sweepFrames: 64,
    swing: 1,
    settleFrames: 58,
  },
  flashFrames: 2,
  grain: 0.05,
};

export const comingSoonFlipsCMeta: ClipMeta = comingSoonFlipsMeta('c', {
  id: 'coming-soon-flips-c',
  title: 'Coming Soon Flips C',
  description:
    'A coming soon teaser in plum and coral: tall condensed words hard cut one at a time with a growing underline, one stuttering through typefaces, then flat blinds of light roll down a lilac plaster wall and settle open on your logo and name, with an outlined ALMOST over a solid HERE tracking in beneath as one lockup.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/coming-soon-flips-c.tsx',
});
