import {
  type DominoWordsProps,
  dominoWordsMeta,
  dominoWordsSchema,
} from '../../domino-words-common';
import type { ClipMeta } from '../../registry';

export const dominoWordsCSchema = dominoWordsSchema;

export type DominoWordsCProps = DominoWordsProps;

export const dominoWordsCDefaults: DominoWordsCProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#ff4fa3',
    secondary: '#5b3a8c',
    text: '#fff1f8',
    background: '#160d24',
    surface: '#fff1f8',
    idle: '#6e5a8f',
    backgroundEdge: '#07040d',
  },
  showBackground: true,
  words: {
    font: 'rounded',
    look: 'neon',
    caps: true,
    size: 128,
    growth: 0.15,
    letters: 11,
    spacing: 0.32,
    padding: 0.13,
    outline: 2.5,
    firstLit: true,
    lightFrames: 8,
    glow: 0.9,
  },
  pusher: { show: true, style: 'glow', radius: 46, rebound: 0.35 },
  floor: {
    y: 1240,
    thickness: 4,
    glow: 0.6,
    trail: true,
    reflection: 0.2,
    reflectionDepth: 360,
    shadow: 0,
  },
  camera: { frontAt: 0.4, pullDelay: -6, pullFrames: 54, margin: 72 },
  timing: { hitAt: 63, chainFrames: 96, lastFrames: 44, settle: 3 },
  brand: { top: 120, logoHeight: 150, nameSize: 46, plate: true, footerSize: 30 },
};

export const dominoWordsCMeta: ClipMeta = dominoWordsMeta('c', {
  id: 'domino-words-c',
  title: 'Domino Words C',
  description:
    'A glowing ball knocks over a row of unlit neon words that light up one by one as they topple like dominoes while the floor lights up beneath the chain, until the last word lands flat glowing in your Primary color and the camera pulls back over the whole lit sentence, with your logo and name at the top.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/domino-words-c.tsx',
});
