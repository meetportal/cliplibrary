import type { ClipModule } from '../../registry';
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
];
