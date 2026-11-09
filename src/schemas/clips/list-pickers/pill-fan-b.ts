import {
  PILL_FAN_WORDS,
  type PillFanProps,
  pillFanMeta,
  pillFanSchema,
} from '../../pill-fan-common';
import type { ClipMeta } from '../../registry';

export const pillFanBSchema = pillFanSchema;

export type PillFanBProps = PillFanProps;

export const pillFanBDefaults: PillFanBProps = {
  headline: '{{Headline}}',
  words: PILL_FAN_WORDS,
  companyName: '{{Company Name}}',
  logo: '{{Logo}}',
  colors: {
    primary: '#d2552c',
    pillText: '#fff8f0',
    text: '#2b1e16',
    background: '#f6f0e6',
    glow: '#efc4a2',
    plate: '#ffffff',
  },
  showBackground: true,
  phrase: { font: 'fraunces', size: 100, tilt: -3, gap: 12 },
  pills: { font: 'outfit', textSize: 62, height: 108, padding: 40, shadow: 0.35, trail: 'outline' },
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
    logoHeight: 100,
    nameSize: 44,
    plate: false,
    gap: 170,
  },
  glow: { strength: 0.7, drift: 1 },
  layout: { x: -60, y: -100, margin: 96 },
  timing: { intro: 18, firstSwap: 32, interval: 23, swing: 18, drift: 0.15 },
};

export const pillFanBMeta: ClipMeta = pillFanMeta('b', {
  id: 'pill-fan-b',
  title: 'Pill Fan B',
  description:
    'A serif phrase is completed by terracotta word pills that swing in on top, while older words drain into outlined pills and fan away, with the logo and name in the corner.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/pill-fan-b.tsx',
  posterFrame: 150,
});
