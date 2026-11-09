import type { ClipModule } from '../../registry';
import {
  comingSoonFlipsADefaults,
  comingSoonFlipsAMeta,
  comingSoonFlipsASchema,
} from './coming-soon-flips-a';
import { comingSoonFlipsAControls } from './coming-soon-flips-a-controls';
import {
  comingSoonFlipsBDefaults,
  comingSoonFlipsBMeta,
  comingSoonFlipsBSchema,
} from './coming-soon-flips-b';
import { comingSoonFlipsBControls } from './coming-soon-flips-b-controls';
import {
  comingSoonFlipsCDefaults,
  comingSoonFlipsCMeta,
  comingSoonFlipsCSchema,
} from './coming-soon-flips-c';
import { comingSoonFlipsCControls } from './coming-soon-flips-c-controls';
import { textRingsADefaults, textRingsAMeta, textRingsASchema } from './text-rings-a';
import { textRingsAControls } from './text-rings-a-controls';
import { textRingsBDefaults, textRingsBMeta, textRingsBSchema } from './text-rings-b';
import { textRingsBControls } from './text-rings-b-controls';
import { textRingsCDefaults, textRingsCMeta, textRingsCSchema } from './text-rings-c';
import { textRingsCControls } from './text-rings-c-controls';

export const kineticTypeClips: ClipModule[] = [
  {
    id: 'coming-soon-flips-a',
    schema: comingSoonFlipsASchema,
    defaults: comingSoonFlipsADefaults,
    meta: comingSoonFlipsAMeta,
    controls: comingSoonFlipsAControls,
  },
  {
    id: 'coming-soon-flips-b',
    schema: comingSoonFlipsBSchema,
    defaults: comingSoonFlipsBDefaults,
    meta: comingSoonFlipsBMeta,
    controls: comingSoonFlipsBControls,
  },
  {
    id: 'coming-soon-flips-c',
    schema: comingSoonFlipsCSchema,
    defaults: comingSoonFlipsCDefaults,
    meta: comingSoonFlipsCMeta,
    controls: comingSoonFlipsCControls,
  },
  {
    id: 'text-rings-a',
    schema: textRingsASchema,
    defaults: textRingsADefaults,
    meta: textRingsAMeta,
    controls: textRingsAControls,
  },
  {
    id: 'text-rings-b',
    schema: textRingsBSchema,
    defaults: textRingsBDefaults,
    meta: textRingsBMeta,
    controls: textRingsBControls,
  },
  {
    id: 'text-rings-c',
    schema: textRingsCSchema,
    defaults: textRingsCDefaults,
    meta: textRingsCMeta,
    controls: textRingsCControls,
  },
];
