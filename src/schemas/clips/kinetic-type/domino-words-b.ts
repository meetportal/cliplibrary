import {
  type DominoWordsProps,
  dominoWordsMeta,
  dominoWordsSchema,
} from '../../domino-words-common';
import type { ClipMeta } from '../../registry';

export const dominoWordsBSchema = dominoWordsSchema;

export type DominoWordsBProps = DominoWordsProps;

export const dominoWordsBDefaults: DominoWordsBProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#e4572e',
    secondary: '#1c1b19',
    text: '#1c1b19',
    background: '#f2ece1',
    surface: '#ffffff',
    idle: '#d3c7b4',
    backgroundEdge: '#e4dac9',
  },
  showBackground: true,
  words: {
    font: 'condensed',
    look: 'tile',
    caps: true,
    size: 140,
    growth: 0.15,
    letters: 11,
    spacing: 0.32,
    padding: 0.16,
    outline: 0,
    firstLit: true,
    lightFrames: 6,
    glow: 0.4,
  },
  pusher: { show: true, style: 'solid', radius: 56, rebound: 0.35 },
  floor: {
    y: 1240,
    thickness: 3,
    glow: 0,
    trail: false,
    reflection: 0,
    reflectionDepth: 360,
    shadow: 0.6,
  },
  camera: { frontAt: 0.4, pullDelay: -6, pullFrames: 54, margin: 72 },
  timing: { hitAt: 63, chainFrames: 96, lastFrames: 44, settle: 3 },
  brand: { top: 120, logoHeight: 150, nameSize: 46, plate: true, footerSize: 30 },
};

export const dominoWordsBMeta: ClipMeta = dominoWordsMeta('b', {
  id: 'domino-words-b',
  title: 'Domino Words B',
  description:
    'On a warm paper stage a solid ball knocks over a row of condensed word tiles that darken as they topple like real dominoes, the camera following the chain until the last tile lands flat in your Primary color and the camera pulls back over the whole fallen sentence, with your logo and name at the top.',
  theme: 'light',
  source: 'src/compositions/scenes/kinetic-type/domino-words-b.tsx',
});
