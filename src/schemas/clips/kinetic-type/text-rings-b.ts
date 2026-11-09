import type { ClipMeta } from '../../registry';
import { type TextRingsProps, textRingsMeta, textRingsSchema } from '../../text-rings-common';

export const textRingsBSchema = textRingsSchema;

export type TextRingsBProps = TextRingsProps;

export const textRingsBDefaults: TextRingsBProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#b4441f',
    text: '#1b1a17',
    background: '#f2ece1',
    plate: '#ffffff',
  },
  showBackground: true,
  nameRings: { font: 'serif-italic', caps: false, tracking: 0, opacity: 1, usePrimary: true },
  taglineRings: { font: 'sans', caps: true, tracking: 0.14, opacity: 1, usePrimary: false },
  rings: {
    separator: '·',
    separatorGap: 0.5,
    textSize: 0.15,
    spacing: 1.32,
    count: 6,
    gap: 26,
    entrance: 'fade',
    entranceFrames: 16,
  },
  spin: { speed: 2.5, alternate: true, clockwise: true, offset: 17 },
  mark: { size: 360, wideGrow: 0.35, stroke: 3, logoFill: 0.84, plate: true, entrance: 'bloom' },
  timing: { drawFrames: 16, logoAt: 0, firstRing: 26, settleAt: 118, settleFrames: 36 },
};

export const textRingsBMeta: ClipMeta = textRingsMeta('b', {
  id: 'text-rings-b',
  title: 'Text Rings B',
  description:
    'On warm paper a fine circle draws on around your logo, then rings alternating your name in a coloured serif italic and your tagline in spaced capitals grow out, spin and settle into a still-turning vortex.',
  theme: 'light',
  source: 'src/compositions/scenes/kinetic-type/text-rings-b.tsx',
});
