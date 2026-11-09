import {
  type NeonSignFlickerProps,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from '../../neon-sign-flicker-common';
import type { ClipMeta } from '../../registry';

export const neonSignFlickerASchema = neonSignFlickerSchema;

export type NeonSignFlickerAProps = NeonSignFlickerProps;

export const neonSignFlickerADefaults: NeonSignFlickerAProps = {
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  colors: {
    primary: '#ff4fae',
    text: '#f7ecf6',
    background: '#0a0610',
    lamp: '#ffd9a0',
    plate: '#f7eef3',
    glass: '#1a1119',
  },
  showBackground: true,
  neon: {
    font: 'tilt-neon',
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
    start: 20,
    bursts: 7,
    firstBurst: 25,
    shrink: 3.5,
    gap: 13,
    pattern: 7,
  },
  opening: { style: 'lit', length: 48 },
  lamp: { show: true, beam: 1, sway: 2, height: 150, size: 132 },
  type: {
    font: 'outfit',
    uppercase: true,
    taglineSize: 46,
    tracking: 0.08,
    nameSize: 56,
    websiteSize: 26,
  },
  lockup: { plate: true, logoWidth: 600, logoHeight: 250, padding: 34 },
  layout: { signY: 860, lockupY: 1500 },
};

export const neonSignFlickerAMeta: ClipMeta = neonSignFlickerMeta('a', {
  id: 'neon-sign-flicker-a',
  title: 'Neon Sign Flicker A',
  description:
    'A pink neon word glows under a pendant lamp until one letter and the lamp sputter in shrinking bursts and burn out, above your tagline, logo plate, name and website.',
  source: 'src/compositions/scenes/text-reveals/neon-sign-flicker-a.tsx',
  posterFrame: 15,
});
