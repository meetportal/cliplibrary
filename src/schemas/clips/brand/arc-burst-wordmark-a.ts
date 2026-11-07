import {
  type ArcBurstWordmarkProps,
  arcBurstWordmarkMeta,
  arcBurstWordmarkSchema,
} from '../../arc-burst-wordmark-common';
import type { ClipMeta } from '../../registry';

export const arcBurstWordmarkASchema = arcBurstWordmarkSchema;

export type ArcBurstWordmarkAProps = ArcBurstWordmarkProps;

export const arcBurstWordmarkADefaults: ArcBurstWordmarkAProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff8c05',
    text: '#0b0b0c',
    background: '#ffffff',
    field: '#050505',
    comet: '#ffffff',
    plate: '#f4f1ea',
  },
  showBackground: true,
  name: {
    font: 'lexend',
    letterCase: 'lowercase',
    size: 210,
    tracking: -0.035,
    maxWidth: 78,
    wrap: true,
    offsetY: 0,
  },
  mark: { show: true, width: 720, height: 280, gap: 56, plate: false, padding: 24, roundness: 22 },
  swirl: { arcs: 10, comets: 4, spin: 1 },
  burst: { style: 'iris', at: 28, length: 16 },
  build: { style: 'slices', delay: 4, spread: 14, flight: 18, swing: 70, orbits: 6 },
  accent: { show: false, thickness: 12, gap: 44 },
};

export const arcBurstWordmarkAMeta: ClipMeta = arcBurstWordmarkMeta('a', {
  id: 'arc-burst-wordmark-a',
  title: 'Arc Burst Wordmark A',
  description:
    'Orange arcs and white comets swirl on black, an orange iris bursts the frame open to white, and your name pivots together from spinning slices as the orange settles away.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/arc-burst-wordmark-a.tsx',
});
