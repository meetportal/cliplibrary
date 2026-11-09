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
];
