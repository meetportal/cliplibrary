import type { ClipMeta } from '../../registry';
import { type TextRingsProps, textRingsMeta, textRingsSchema } from '../../text-rings-common';

export const textRingsCSchema = textRingsSchema;

export type TextRingsCProps = TextRingsProps;

export const textRingsCDefaults: TextRingsCProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#9d8cff',
    text: '#eeeaf8',
    background: '#0c0b16',
    plate: '#ffffff',
  },
  showBackground: true,
  nameRings: { font: 'geometric', caps: true, tracking: 0.06, opacity: 1, usePrimary: false },
  taglineRings: { font: 'geometric', caps: false, tracking: 0.02, opacity: 0.5, usePrimary: false },
  rings: {
    separator: '·',
    separatorGap: 0.5,
    textSize: 0.15,
    spacing: 1.32,
    count: 6,
    gap: 26,
    entrance: 'write-on',
    entranceFrames: 22,
  },
  spin: { speed: 2.5, alternate: true, clockwise: true, offset: 17 },
  mark: { size: 360, wideGrow: 0.35, stroke: 14, logoFill: 0.84, plate: true, entrance: 'iris' },
  timing: { drawFrames: 16, logoAt: 0, firstRing: 26, settleAt: 118, settleFrames: 36 },
};

export const textRingsCMeta: ClipMeta = textRingsMeta('c', {
  id: 'text-rings-c',
  title: 'Text Rings C',
  description:
    'A thick violet ring draws on and irises in to your logo, then every new ring writes your name or tagline on letter by letter in a clockwise sweep as the rings grow, spin and settle into a layered vortex.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/text-rings-c.tsx',
});
