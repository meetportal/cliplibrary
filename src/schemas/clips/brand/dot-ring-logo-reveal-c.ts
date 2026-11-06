import {
  type DotRingLogoRevealProps,
  dotRingLogoRevealMeta,
  dotRingLogoRevealSchema,
} from '../../dot-ring-logo-reveal-common';
import type { ClipMeta } from '../../registry';

export const dotRingLogoRevealCSchema = dotRingLogoRevealSchema;

export type DotRingLogoRevealCProps = DotRingLogoRevealProps;

export const dotRingLogoRevealCDefaults: DotRingLogoRevealCProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  colors: {
    primary: '#ff59b6',
    text: '#1d1b19',
    ring: '#1d1b19',
    background: '#faf7f2',
    plate: '#efe9df',
  },
  showBackground: true,
  ring: { handoff: 'frame', size: 380, thickness: 32, frameThickness: 9 },
  logoBox: { width: 760, height: 320, padding: 36, roundness: 100 },
  name: { font: 'outfit', size: 124, tracking: -0.015, gap: 88, stopSize: 0.22 },
  layout: { offsetY: -40 },
  timing: { start: 24, ringFrames: 28, pause: 2, nameFrames: 24 },
};

export const dotRingLogoRevealCMeta: ClipMeta = dotRingLogoRevealMeta('c', {
  id: 'dot-ring-logo-reveal-c',
  title: 'Dot Ring Logo Reveal C',
  description:
    'A pink dot draws a thick ring that slims into a fine badge outline around your logo, then writes your name underneath and rests as its full stop.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-ring-logo-reveal-c.tsx',
});
