import {
  MAGNIFIER_CAPTION_DECOYS,
  MAGNIFIER_CAPTION_TOKENS,
  type MagnifierCaptionProps,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from '../../magnifier-caption-common';
import type { ClipMeta } from '../../registry';

export const magnifierCaptionASchema = magnifierCaptionSchema;

export type MagnifierCaptionAProps = MagnifierCaptionProps;

export const magnifierCaptionADefaults: MagnifierCaptionAProps = {
  ...MAGNIFIER_CAPTION_TOKENS,
  colors: {
    primary: '#ffad42',
    text: '#f4efe4',
    secondary: '#5a6ca6',
    background: '#070a18',
    surface: '#f4efe4',
    rim: '#f0d5a0',
    glow: '#d4e2ff',
    glass: '#0c1332',
    handle: '#1b2452',
    spotlight: '#18224d',
  },
  showBackground: true,
  caption: { top: 270, keyword: 'underline', flyWords: false, typing: 2.5 },
  type: {
    caption: 'bodoni',
    body: 'inter',
    captionSize: 74,
    cellSize: 52,
    nameSize: 44,
    websiteSize: 28,
  },
  cells: {
    shape: 'hexagon',
    words: MAGNIFIER_CAPTION_DECOYS,
    blur: 7,
    size: 150,
    spread: 2,
    seed: 7,
  },
  lens: {
    radius: 250,
    magnify: 1,
    x: 540,
    y: 930,
    tilt: -12,
    handle: 300,
    rimWidth: 9,
    glint: 0.55,
    sway: 1,
  },
  timing: { firstWord: 36, lastWord: 315, returnAt: 393, returnFrames: 42, glide: 2.5 },
  brand: { plate: true, logoWidth: 300, logoHeight: 150, y: 1640 },
};

export const magnifierCaptionAMeta: ClipMeta = magnifierCaptionMeta('a', 'dark', {
  id: 'magnifier-caption-a',
  title: 'Magnifier Caption A',
  description:
    'A gold-rimmed magnifying glass glides over a blurred navy honeycomb of words; each word under the lens lights up as a Bodoni caption types in, ending on an amber underlined keyword above your logo, name and website.',
  source: 'src/compositions/scenes/text-reveals/magnifier-caption-a.tsx',
});
