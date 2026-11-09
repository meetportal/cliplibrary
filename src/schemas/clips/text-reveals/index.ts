import type { ClipModule } from '../../registry';
import {
  magnifierCaptionADefaults,
  magnifierCaptionAMeta,
  magnifierCaptionASchema,
} from './magnifier-caption-a';
import { magnifierCaptionAControls } from './magnifier-caption-a-controls';
import {
  magnifierCaptionBDefaults,
  magnifierCaptionBMeta,
  magnifierCaptionBSchema,
} from './magnifier-caption-b';
import { magnifierCaptionBControls } from './magnifier-caption-b-controls';
import {
  magnifierCaptionCDefaults,
  magnifierCaptionCMeta,
  magnifierCaptionCSchema,
} from './magnifier-caption-c';
import { magnifierCaptionCControls } from './magnifier-caption-c-controls';
import {
  neonSignFlickerADefaults,
  neonSignFlickerAMeta,
  neonSignFlickerASchema,
} from './neon-sign-flicker-a';
import { neonSignFlickerAControls } from './neon-sign-flicker-a-controls';
import {
  neonSignFlickerBDefaults,
  neonSignFlickerBMeta,
  neonSignFlickerBSchema,
} from './neon-sign-flicker-b';
import { neonSignFlickerBControls } from './neon-sign-flicker-b-controls';
import {
  neonSignFlickerCDefaults,
  neonSignFlickerCMeta,
  neonSignFlickerCSchema,
} from './neon-sign-flicker-c';
import { neonSignFlickerCControls } from './neon-sign-flicker-c-controls';

export const textRevealsClips: ClipModule[] = [
  {
    id: 'neon-sign-flicker-a',
    schema: neonSignFlickerASchema,
    defaults: neonSignFlickerADefaults,
    meta: neonSignFlickerAMeta,
    controls: neonSignFlickerAControls,
  },
  {
    id: 'neon-sign-flicker-b',
    schema: neonSignFlickerBSchema,
    defaults: neonSignFlickerBDefaults,
    meta: neonSignFlickerBMeta,
    controls: neonSignFlickerBControls,
  },
  {
    id: 'neon-sign-flicker-c',
    schema: neonSignFlickerCSchema,
    defaults: neonSignFlickerCDefaults,
    meta: neonSignFlickerCMeta,
    controls: neonSignFlickerCControls,
  },
  {
    id: 'magnifier-caption-a',
    schema: magnifierCaptionASchema,
    defaults: magnifierCaptionADefaults,
    meta: magnifierCaptionAMeta,
    controls: magnifierCaptionAControls,
  },
  {
    id: 'magnifier-caption-b',
    schema: magnifierCaptionBSchema,
    defaults: magnifierCaptionBDefaults,
    meta: magnifierCaptionBMeta,
    controls: magnifierCaptionBControls,
  },
  {
    id: 'magnifier-caption-c',
    schema: magnifierCaptionCSchema,
    defaults: magnifierCaptionCDefaults,
    meta: magnifierCaptionCMeta,
    controls: magnifierCaptionCControls,
  },
];
