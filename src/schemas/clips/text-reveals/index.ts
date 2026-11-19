import type { ClipModule } from '../../registry';
import {
  goingLiveTeaserDefaults,
  goingLiveTeaserMeta,
  goingLiveTeaserSchema,
} from './going-live-teaser';
import { goingLiveTeaserControls } from './going-live-teaser-controls';
import {
  magnifierCaptionDefaults,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from './magnifier-caption';
import { magnifierCaptionControls } from './magnifier-caption-controls';
import {
  neonSignFlickerDefaults,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from './neon-sign-flicker';
import { neonSignFlickerControls } from './neon-sign-flicker-controls';

export const textRevealsClips: ClipModule[] = [
  {
    id: 'neon-sign-flicker',
    schema: neonSignFlickerSchema,
    defaults: neonSignFlickerDefaults,
    meta: neonSignFlickerMeta,
    controls: neonSignFlickerControls,
  },
  {
    id: 'magnifier-caption',
    schema: magnifierCaptionSchema,
    defaults: magnifierCaptionDefaults,
    meta: magnifierCaptionMeta,
    controls: magnifierCaptionControls,
  },
  {
    id: 'going-live-teaser',
    schema: goingLiveTeaserSchema,
    defaults: goingLiveTeaserDefaults,
    meta: goingLiveTeaserMeta,
    controls: goingLiveTeaserControls,
  },
];
