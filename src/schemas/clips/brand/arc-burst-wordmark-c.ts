import {
  type ArcBurstWordmarkProps,
  arcBurstWordmarkMeta,
  arcBurstWordmarkSchema,
} from '../../arc-burst-wordmark-common';
import type { ClipMeta } from '../../registry';

export const arcBurstWordmarkCSchema = arcBurstWordmarkSchema;

export type ArcBurstWordmarkCProps = ArcBurstWordmarkProps;

export const arcBurstWordmarkCDefaults: ArcBurstWordmarkCProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#f26b1d',
    text: '#141414',
    background: '#ffffff',
    field: '#050505',
    comet: '#ffffff',
    plate: '#f4f1ea',
  },
  showBackground: true,
  name: {
    font: 'fredoka',
    letterCase: 'as-typed',
    size: 210,
    tracking: -0.01,
    maxWidth: 76,
    wrap: true,
    offsetY: -24,
  },
  mark: { show: true, width: 720, height: 280, gap: 56, plate: false, padding: 24, roundness: 22 },
  swirl: { arcs: 10, comets: 4, spin: 1 },
  burst: { style: 'split', at: 28, length: 16 },
  build: { style: 'swing', delay: 3, spread: 14, flight: 20, swing: 64, orbits: 4 },
  accent: { show: true, thickness: 12, gap: 44 },
};

export const arcBurstWordmarkCMeta: ClipMeta = arcBurstWordmarkMeta('c', {
  id: 'arc-burst-wordmark-c',
  title: 'Arc Burst Wordmark C',
  description:
    'Orange arcs and comets swirl on black, two big orange discs meet and part to open a white stage, and your name swings up letter by letter over an orange accent arc that stays.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/arc-burst-wordmark-c.tsx',
});
