import {
  MAGNIFIER_CAPTION_DECOYS,
  MAGNIFIER_CAPTION_TOKENS,
  type MagnifierCaptionProps,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from '../../magnifier-caption-common';
import type { ClipMeta } from '../../registry';

export const magnifierCaptionBSchema = magnifierCaptionSchema;

export type MagnifierCaptionBProps = MagnifierCaptionProps;

export const magnifierCaptionBDefaults: MagnifierCaptionBProps = {
  ...MAGNIFIER_CAPTION_TOKENS,
  colors: {
    primary: '#e5482d',
    text: '#1d2433',
    secondary: '#8b95ad',
    background: '#f2ece0',
    surface: '#ffffff',
    rim: '#1d2433',
    glow: '#ffc94d',
    glass: '#fbf8f1',
    handle: '#2b3448',
    spotlight: '#fbf8f2',
  },
  showBackground: true,
  caption: { top: 270, keyword: 'highlight', flyWords: false, typing: 2.5 },
  type: {
    caption: 'inter-tight',
    body: 'inter',
    captionSize: 70,
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
    magnify: 1.3,
    x: 540,
    y: 930,
    tilt: -12,
    handle: 300,
    rimWidth: 10,
    glint: 0.8,
    sway: 1,
  },
  timing: { firstWord: 36, lastWord: 315, returnAt: 393, returnFrames: 42, glide: 2.5 },
  brand: { plate: true, logoWidth: 300, logoHeight: 150, y: 1640 },
};

export const magnifierCaptionBMeta: ClipMeta = magnifierCaptionMeta('b', 'light', {
  id: 'magnifier-caption-b',
  title: 'Magnifier Caption B',
  description:
    'An ink-rimmed magnifying glass slides over a soft paper honeycomb of words and enlarges each word it finds as a bold sans caption types in, ending on a marker-highlighted keyword above your logo, name and website.',
  source: 'src/compositions/scenes/text-reveals/magnifier-caption-b.tsx',
});
