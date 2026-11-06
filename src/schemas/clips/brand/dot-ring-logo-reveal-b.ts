import {
  type DotRingLogoRevealProps,
  dotRingLogoRevealMeta,
  dotRingLogoRevealSchema,
} from '../../dot-ring-logo-reveal-common';
import type { ClipMeta } from '../../registry';

export const dotRingLogoRevealBSchema = dotRingLogoRevealSchema;

export type DotRingLogoRevealBProps = DotRingLogoRevealProps;

export const dotRingLogoRevealBDefaults: DotRingLogoRevealBProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  colors: {
    primary: '#ff59b6',
    text: '#f4f1ea',
    ring: '#f4f1ea',
    background: '#141416',
    plate: '#f4f1ea',
  },
  showBackground: true,
  ring: { handoff: 'plate', size: 340, thickness: 32, frameThickness: 8 },
  logoBox: { width: 760, height: 340, padding: 56, roundness: 44 },
  name: { font: 'instrument-serif', size: 150, tracking: 0, gap: 92, stopSize: 0.2 },
  layout: { offsetY: -40 },
  timing: { start: 24, ringFrames: 28, pause: 2, nameFrames: 24 },
};

export const dotRingLogoRevealBMeta: ClipMeta = dotRingLogoRevealMeta('b', {
  id: 'dot-ring-logo-reveal-b',
  title: 'Dot Ring Logo Reveal B',
  description:
    'On charcoal, a pink dot draws a light ring that fills into a plate holding your logo, then writes your name in a serif and rests as its full stop.',
  theme: 'dark',
  source: 'src/compositions/scenes/brand/dot-ring-logo-reveal-b.tsx',
});
