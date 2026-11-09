import {
  MAGNIFIER_CAPTION_DECOYS,
  MAGNIFIER_CAPTION_TOKENS,
  type MagnifierCaptionProps,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from '../../magnifier-caption-common';
import type { ClipMeta } from '../../registry';

export const magnifierCaptionCSchema = magnifierCaptionSchema;

export type MagnifierCaptionCProps = MagnifierCaptionProps;

export const magnifierCaptionCDefaults: MagnifierCaptionCProps = {
  ...MAGNIFIER_CAPTION_TOKENS,
  colors: {
    primary: '#e8884e',
    text: '#f2ece0',
    secondary: '#4f8f7c',
    background: '#061a14',
    surface: '#f2ece0',
    rim: '#eeb487',
    glow: '#d8f2e4',
    glass: '#082119',
    handle: '#0f2e25',
    spotlight: '#0f3b30',
  },
  showBackground: true,
  caption: { top: 270, keyword: 'underline', flyWords: true, typing: 2.5 },
  type: {
    caption: 'fraunces',
    body: 'manrope',
    captionSize: 74,
    cellSize: 52,
    nameSize: 44,
    websiteSize: 28,
  },
  cells: {
    shape: 'circle',
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

export const magnifierCaptionCMeta: ClipMeta = magnifierCaptionMeta('c', 'dark', {
  id: 'magnifier-caption-c',
  title: 'Magnifier Caption C',
  description:
    'A copper-rimmed magnifying glass drifts over a blurred green field of round word cells; every word it finds lifts out of the lens and flies up into a Fraunces caption, ending on an underlined copper keyword above your logo, name and website.',
  source: 'src/compositions/scenes/text-reveals/magnifier-caption-c.tsx',
});
