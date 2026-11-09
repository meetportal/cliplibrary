import {
  type NeonSignFlickerProps,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from '../../neon-sign-flicker-common';
import type { ClipMeta } from '../../registry';

export const neonSignFlickerCSchema = neonSignFlickerSchema;

export type NeonSignFlickerCProps = NeonSignFlickerProps;

export const neonSignFlickerCDefaults: NeonSignFlickerCProps = {
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  colors: {
    primary: '#ff5a36',
    text: '#fff1e6',
    background: '#0c0706',
    lamp: '#ffd08a',
    plate: '#fbf1e8',
    glass: '#1e1210',
  },
  showBackground: true,
  neon: {
    font: 'monoton',
    uppercase: true,
    size: 236,
    tracking: 0.02,
    glow: 1,
    wallGlow: 0.4,
    hum: 0.05,
  },
  flicker: {
    letter: 1,
    ending: 'burn-out',
    start: 66,
    bursts: 6,
    firstBurst: 20,
    shrink: 3.5,
    gap: 11,
    pattern: 23,
  },
  opening: { style: 'switch-on', length: 36 },
  lamp: { show: true, beam: 1, sway: 2, height: 150, size: 132 },
  type: {
    font: 'josefin-sans',
    uppercase: true,
    taglineSize: 46,
    tracking: 0.1,
    nameSize: 56,
    websiteSize: 26,
  },
  lockup: { plate: true, logoWidth: 600, logoHeight: 250, padding: 34 },
  layout: { signY: 860, lockupY: 1500 },
};

export const neonSignFlickerCMeta: ClipMeta = neonSignFlickerMeta('c', {
  id: 'neon-sign-flicker-c',
  title: 'Neon Sign Flicker C',
  description:
    'An unlit red-orange marquee neon sign switches on letter by letter under a pendant lamp above your tagline, logo plate, name and website, then one letter sputters in shrinking bursts and burns out.',
  source: 'src/compositions/scenes/text-reveals/neon-sign-flicker-c.tsx',
  posterFrame: 50,
});
