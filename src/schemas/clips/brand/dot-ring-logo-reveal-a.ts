import {
  type DotRingLogoRevealProps,
  dotRingLogoRevealMeta,
  dotRingLogoRevealSchema,
} from '../../dot-ring-logo-reveal-common';
import type { ClipMeta } from '../../registry';

export const dotRingLogoRevealASchema = dotRingLogoRevealSchema;

export type DotRingLogoRevealAProps = DotRingLogoRevealProps;

export const dotRingLogoRevealADefaults: DotRingLogoRevealAProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  colors: {
    primary: '#ff59b6',
    text: '#0b0b0c',
    ring: '#0b0b0c',
    background: '#ffffff',
    plate: '#f2f2f0',
  },
  showBackground: true,
  ring: { handoff: 'bloom', size: 340, thickness: 32, frameThickness: 8 },
  logoBox: { width: 820, height: 360, padding: 48, roundness: 100 },
  name: { font: 'poppins', size: 112, tracking: -0.02, gap: 96, stopSize: 0.22 },
  layout: { offsetY: -40 },
  timing: { start: 24, ringFrames: 28, pause: 2, nameFrames: 24 },
};

export const dotRingLogoRevealAMeta: ClipMeta = dotRingLogoRevealMeta('a', {
  id: 'dot-ring-logo-reveal-a',
  title: 'Dot Ring Logo Reveal A',
  description:
    'A pink dot sweeps a thick black ring that blooms into your logo, then writes your name out underneath and rests as its full stop.',
  theme: 'light',
  source: 'src/compositions/scenes/brand/dot-ring-logo-reveal-a.tsx',
});
