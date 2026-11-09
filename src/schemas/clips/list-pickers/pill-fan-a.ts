import {
  PILL_FAN_WORDS,
  type PillFanProps,
  pillFanMeta,
  pillFanSchema,
} from '../../pill-fan-common';
import type { ClipMeta } from '../../registry';

export const pillFanASchema = pillFanSchema;

export type PillFanAProps = PillFanProps;

export const pillFanADefaults: PillFanAProps = {
  headline: '{{Headline}}',
  words: PILL_FAN_WORDS,
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#5b4bdb',
    pillText: '#ffffff',
    text: '#14121f',
    background: '#f8f7fc',
    glow: '#a99df0',
    plate: '#ffffff',
  },
  showBackground: true,
  phrase: { font: 'sora', size: 96, tilt: -4, gap: 12 },
  pills: { font: 'quicksand', textSize: 66, height: 108, padding: 40, shadow: 0.45, trail: 'tint' },
  fan: {
    angle: -10,
    direction: 'down',
    spread: 38,
    swingIn: 28,
    hinge: 44,
    slide: 40,
    shrink: 0.05,
    trail: 3,
    fade: 0.2,
    clearAtEnd: false,
  },
  brand: {
    placement: 'corner',
    logoWidth: 330,
    logoHeight: 110,
    nameSize: 44,
    plate: false,
    gap: 170,
  },
  glow: { strength: 0.62, drift: 0.6 },
  layout: { x: -60, y: -100, margin: 96 },
  timing: { intro: 18, firstSwap: 32, interval: 23, swing: 18, drift: 0.15 },
};

export const pillFanAMeta: ClipMeta = pillFanMeta('a', {
  id: 'pill-fan-a',
  title: 'Pill Fan A',
  description:
    'A phrase is completed by violet word pills that swing in on top and fan away around a hinge into a readable trail, with the logo and name in the corner.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/pill-fan-a.tsx',
  posterFrame: 150,
});
