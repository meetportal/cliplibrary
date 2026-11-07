import {
  type ArcBurstWordmarkProps,
  arcBurstWordmarkMeta,
  arcBurstWordmarkSchema,
} from '../../arc-burst-wordmark-common';
import type { ClipMeta } from '../../registry';

export const arcBurstWordmarkBSchema = arcBurstWordmarkSchema;

export type ArcBurstWordmarkBProps = ArcBurstWordmarkProps;

export const arcBurstWordmarkBDefaults: ArcBurstWordmarkBProps = {
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#ff4f3a',
    text: '#f8f5ee',
    background: '#12141f',
    field: '#030304',
    comet: '#ffffff',
    plate: '#f8f5ee',
  },
  showBackground: true,
  name: {
    font: 'archivo-black',
    letterCase: 'as-typed',
    size: 190,
    tracking: -0.02,
    maxWidth: 78,
    wrap: true,
    offsetY: 0,
  },
  mark: { show: true, width: 720, height: 280, gap: 56, plate: true, padding: 18, roundness: 22 },
  swirl: { arcs: 10, comets: 4, spin: 1 },
  burst: { style: 'iris', at: 28, length: 16 },
  build: { style: 'slices', delay: 4, spread: 14, flight: 18, swing: 70, orbits: 6 },
  accent: { show: false, thickness: 12, gap: 44 },
};

export const arcBurstWordmarkBMeta: ClipMeta = arcBurstWordmarkMeta('b', {
  id: 'arc-burst-wordmark-b',
  title: 'Arc Burst Wordmark B',
  description:
    'Coral arcs and comets swirl on black, a coral iris opens onto deep ink, and your name pivots together in heavy white type as the coral settles away.',
  theme: 'dark',
  source: 'src/compositions/scenes/brand/arc-burst-wordmark-b.tsx',
});
