import type { ClipMeta } from '../../registry';
import { type TextRingsProps, textRingsMeta, textRingsSchema } from '../../text-rings-common';

export const textRingsASchema = textRingsSchema;

export type TextRingsAProps = TextRingsProps;

export const textRingsADefaults: TextRingsAProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  tagline: '{{Tagline}}',
  colors: {
    primary: '#ff6b3d',
    text: '#f4f3ef',
    background: '#050505',
    plate: '#f4f3ef',
  },
  showBackground: true,
  nameRings: { font: 'sans-bold', caps: false, tracking: 0, opacity: 1, usePrimary: false },
  taglineRings: { font: 'sans', caps: false, tracking: 0.01, opacity: 1, usePrimary: false },
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
  mark: { size: 360, wideGrow: 0.35, stroke: 4, logoFill: 0.84, plate: true, entrance: 'bloom' },
  timing: { drawFrames: 16, logoAt: 0, firstRing: 26, settleAt: 118, settleFrames: 36 },
};

export const textRingsAMeta: ClipMeta = textRingsMeta('a', {
  id: 'text-rings-a',
  title: 'Text Rings A',
  description:
    'A thin circle draws on and your logo blooms inside it, then rings of your name and tagline grow out and spin in alternate directions until the frame fills with a vortex that settles and keeps turning.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/text-rings-a.tsx',
});
