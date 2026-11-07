import {
  type DotMorphWordmarkProps,
  dotMorphWordmarkMeta,
  dotMorphWordmarkSchema,
} from '../../dot-morph-wordmark-common';
import type { ClipMeta } from '../../registry';

export const dotMorphWordmarkASchema = dotMorphWordmarkSchema;

export type DotMorphWordmarkAProps = DotMorphWordmarkProps;

export const dotMorphWordmarkADefaults: DotMorphWordmarkAProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff8a3c',
    primaryEnd: '#c2409a',
    text: '#161618',
    dots: '#161618',
    background: '#ffffff',
    plate: '#f2f2f4',
  },
  showBackground: true,
  name: { font: 'urbanist', size: 240, tracking: -0.01, openTracking: 0.42, fullStop: true },
  mark: { show: true, plate: false, height: 210, width: 560, gap: 64, padding: 24 },
  dots: { count: 4, size: 84, hop: 2.4, squash: 0.28 },
  morph: { style: 'bloom', tint: 0 },
  layout: { offsetY: 0 },
  timing: { start: 0, pace: 1, stagger: 3, tighten: 20 },
};

export const dotMorphWordmarkAMeta: ClipMeta = dotMorphWordmarkMeta('a', {
  id: 'dot-morph-wordmark-a',
  title: 'Dot Morph Wordmark A',
  description:
    'Four dots, two ink and two in a warm gradient, pop into a cluster, swing out into a row, hop in a wave and turn into the letters of your name, which close up as the last dot leaves a pink full stop. Your logo then settles in above the name.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-morph-wordmark-a.tsx',
});
