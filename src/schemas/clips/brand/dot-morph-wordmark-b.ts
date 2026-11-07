import {
  type DotMorphWordmarkProps,
  dotMorphWordmarkMeta,
  dotMorphWordmarkSchema,
} from '../../dot-morph-wordmark-common';
import type { ClipMeta } from '../../registry';

export const dotMorphWordmarkBSchema = dotMorphWordmarkSchema;

export type DotMorphWordmarkBProps = DotMorphWordmarkProps;

export const dotMorphWordmarkBDefaults: DotMorphWordmarkBProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#8b5cff',
    primaryEnd: '#22d3ee',
    text: '#ffffff',
    dots: '#ffffff',
    background: '#0d0d10',
    plate: '#f4f4f6',
  },
  showBackground: true,
  name: { font: 'sora', size: 220, tracking: -0.02, openTracking: 0.38, fullStop: true },
  mark: { show: true, plate: true, height: 210, width: 560, gap: 64, padding: 24 },
  dots: { count: 4, size: 84, hop: 2.4, squash: 0.28 },
  morph: { style: 'bloom', tint: 14 },
  layout: { offsetY: 0 },
  timing: { start: 0, pace: 1, stagger: 3, tighten: 20 },
};

export const dotMorphWordmarkBMeta: ClipMeta = dotMorphWordmarkMeta('b', {
  id: 'dot-morph-wordmark-b',
  title: 'Dot Morph Wordmark B',
  description:
    'On near black, white and violet to cyan dots gather, swing out, hop in a wave and turn into your name; each new letter glows in the color of its dot before it turns white, and the last dot leaves a full stop. Your logo then settles in above the name.',
  theme: 'dark',
  source: 'src/compositions/scenes/brand/dot-morph-wordmark-b.tsx',
});
