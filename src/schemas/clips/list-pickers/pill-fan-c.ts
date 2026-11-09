import {
  PILL_FAN_WORDS,
  type PillFanProps,
  pillFanMeta,
  pillFanSchema,
} from '../../pill-fan-common';
import type { ClipMeta } from '../../registry';

export const pillFanCSchema = pillFanSchema;

export type PillFanCProps = PillFanProps;

export const pillFanCDefaults: PillFanCProps = {
  headline: '{{Headline}}',
  words: PILL_FAN_WORDS,
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#c6f135',
    pillText: '#111114',
    text: '#f3f3ee',
    background: '#111114',
    glow: '#34420f',
    plate: '#f3f3ee',
  },
  showBackground: true,
  phrase: { font: 'inter-tight', size: 96, tilt: -4, gap: 12 },
  pills: {
    font: 'inter-tight',
    textSize: 62,
    height: 108,
    padding: 40,
    shadow: 0.5,
    trail: 'tint',
  },
  fan: {
    angle: -10,
    direction: 'up',
    spread: 38,
    swingIn: 28,
    hinge: 44,
    slide: 40,
    shrink: 0.05,
    trail: 3,
    fade: 0.22,
    clearAtEnd: true,
  },
  brand: {
    placement: 'below-line',
    logoWidth: 330,
    logoHeight: 100,
    nameSize: 54,
    plate: true,
    gap: 150,
  },
  glow: { strength: 0.55, drift: 1 },
  layout: { x: 0, y: 80, margin: 96 },
  timing: { intro: 18, firstSwap: 32, interval: 23, swing: 18, drift: 0.15 },
};

export const pillFanCMeta: ClipMeta = pillFanMeta('c', {
  id: 'pill-fan-c',
  title: 'Pill Fan C',
  description:
    'On black, lime word pills swing in to complete a phrase and fan upward over the logo and name, then sweep away as the line and brand glide to the center.',
  theme: 'dark',
  source: 'src/compositions/scenes/list-pickers/pill-fan-c.tsx',
  posterFrame: 176,
});
