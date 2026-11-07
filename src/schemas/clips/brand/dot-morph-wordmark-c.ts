import {
  type DotMorphWordmarkProps,
  dotMorphWordmarkMeta,
  dotMorphWordmarkSchema,
} from '../../dot-morph-wordmark-common';
import type { ClipMeta } from '../../registry';

export const dotMorphWordmarkCSchema = dotMorphWordmarkSchema;

export type DotMorphWordmarkCProps = DotMorphWordmarkProps;

export const dotMorphWordmarkCDefaults: DotMorphWordmarkCProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff5f45',
    primaryEnd: '#ffb23e',
    text: '#1d1a16',
    dots: '#1d1a16',
    background: '#f6f0e6',
    plate: '#fbf8f2',
  },
  showBackground: true,
  name: { font: 'fraunces', size: 230, tracking: -0.015, openTracking: 0.36, fullStop: true },
  mark: { show: true, plate: false, height: 210, width: 560, gap: 64, padding: 24 },
  dots: { count: 4, size: 84, hop: 2.4, squash: 0.28 },
  morph: { style: 'underline', tint: 0 },
  layout: { offsetY: 0 },
  timing: { start: 0, pace: 1, stagger: 3, tighten: 20 },
};

export const dotMorphWordmarkCMeta: ClipMeta = dotMorphWordmarkMeta('c', {
  id: 'dot-morph-wordmark-c',
  title: 'Dot Morph Wordmark C',
  description:
    'On warm paper, ink and coral dots gather, swing out and hop, then each dot lands as an underline from which its letters of your name rise in a soft serif, and the last line pulls into a coral full stop. Your logo then settles in above the name.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-morph-wordmark-c.tsx',
});
