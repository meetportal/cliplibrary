import type { ClipModule } from '../../registry';
import {
  anniversaryKineticDefaults,
  anniversaryKineticMeta,
  anniversaryKineticSchema,
} from './anniversary-kinetic';
import { anniversaryKineticControls } from './anniversary-kinetic-controls';
import {
  comingSoonFlipsDefaults,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from './coming-soon-flips';
import { comingSoonFlipsControls } from './coming-soon-flips-controls';
import { dominoWordsDefaults, dominoWordsMeta, dominoWordsSchema } from './domino-words';
import { dominoWordsControls } from './domino-words-controls';
import { textRingsDefaults, textRingsMeta, textRingsSchema } from './text-rings';
import { textRingsControls } from './text-rings-controls';

export const kineticTypeClips: ClipModule[] = [
  {
    id: 'anniversary-kinetic',
    schema: anniversaryKineticSchema,
    defaults: anniversaryKineticDefaults,
    meta: anniversaryKineticMeta,
    controls: anniversaryKineticControls,
  },
  {
    id: 'coming-soon-flips',
    schema: comingSoonFlipsSchema,
    defaults: comingSoonFlipsDefaults,
    meta: comingSoonFlipsMeta,
    controls: comingSoonFlipsControls,
  },
  {
    id: 'domino-words',
    schema: dominoWordsSchema,
    defaults: dominoWordsDefaults,
    meta: dominoWordsMeta,
    controls: dominoWordsControls,
  },
  {
    id: 'text-rings',
    schema: textRingsSchema,
    defaults: textRingsDefaults,
    meta: textRingsMeta,
    controls: textRingsControls,
  },
];
