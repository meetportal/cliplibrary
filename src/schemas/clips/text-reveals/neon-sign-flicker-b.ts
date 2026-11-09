import {
  type NeonSignFlickerProps,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from '../../neon-sign-flicker-common';
import type { ClipMeta } from '../../registry';

export const neonSignFlickerBSchema = neonSignFlickerSchema;

export type NeonSignFlickerBProps = NeonSignFlickerProps;

export const neonSignFlickerBDefaults: NeonSignFlickerBProps = {
  headline: '{{Headline}}',
  tagline: '{{Tagline}}',
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  website: '{{Website}}',
  colors: {
    primary: '#5fd4ff',
    text: '#e8f4ff',
    background: '#050a16',
    lamp: '#ffe2b0',
    plate: '#eef6fb',
    glass: '#121a26',
  },
  showBackground: true,
  neon: {
    font: 'comfortaa',
    uppercase: false,
    size: 236,
    tracking: 0,
    glow: 1,
    wallGlow: 0.42,
    hum: 0.05,
  },
  flicker: {
    letter: 1,
    ending: 'relight',
    start: 20,
    bursts: 7,
    firstBurst: 25,
    shrink: 3.5,
    gap: 13,
    pattern: 11,
  },
  opening: { style: 'lit', length: 48 },
  lamp: { show: true, beam: 1, sway: 2, height: 150, size: 132 },
  type: {
    font: 'dm-mono',
    uppercase: true,
    taglineSize: 40,
    tracking: 0.06,
    nameSize: 52,
    websiteSize: 24,
  },
  lockup: { plate: true, logoWidth: 600, logoHeight: 250, padding: 34 },
  layout: { signY: 860, lockupY: 1500 },
};

export const neonSignFlickerBMeta: ClipMeta = neonSignFlickerMeta('b', {
  id: 'neon-sign-flicker-b',
  title: 'Neon Sign Flicker B',
  description:
    'An ice-blue neon word in rounded lowercase tubes sputters at one letter under a pendant lamp, fights through shrinking bursts and catches with a bright surge, above your tagline, logo plate, name and website.',
  source: 'src/compositions/scenes/text-reveals/neon-sign-flicker-b.tsx',
  posterFrame: 290,
});
