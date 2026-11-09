import {
  type DominoWordsProps,
  dominoWordsMeta,
  dominoWordsSchema,
} from '../../domino-words-common';
import type { ClipMeta } from '../../registry';

export const dominoWordsASchema = dominoWordsSchema;

export type DominoWordsAProps = DominoWordsProps;

export const dominoWordsADefaults: DominoWordsAProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#3cf2c0',
    secondary: '#ffa53a',
    text: '#fbf3e4',
    background: '#161a3a',
    surface: '#fbf3e4',
    idle: '#868cc4',
    backgroundEdge: '#04050d',
  },
  showBackground: true,
  words: {
    font: 'geometric',
    look: 'outline',
    caps: true,
    size: 132,
    growth: 0.15,
    letters: 11,
    spacing: 0.32,
    padding: 0.13,
    outline: 2.75,
    firstLit: true,
    lightFrames: 6,
    glow: 0.85,
  },
  pusher: { show: true, style: 'striped', radius: 56, rebound: 0.35 },
  floor: {
    y: 1240,
    thickness: 4,
    glow: 0.9,
    trail: false,
    reflection: 0.22,
    reflectionDepth: 360,
    shadow: 0,
  },
  camera: { frontAt: 0.4, pullDelay: -6, pullFrames: 54, margin: 72 },
  timing: { hitAt: 63, chainFrames: 96, lastFrames: 44, settle: 3 },
  brand: { top: 120, logoHeight: 150, nameSize: 46, plate: true, footerSize: 30 },
};

export const dominoWordsAMeta: ClipMeta = dominoWordsMeta('a', {
  id: 'domino-words-a',
  title: 'Domino Words A',
  description:
    'A striped ball rolls along a glowing amber floor and knocks over a row of hollow upright words that fill in as they topple like dominoes, the camera following the chain until the last word lands flat in your Primary color and the camera pulls back over the whole fallen sentence, with your logo and name at the top.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/domino-words-a.tsx',
});
