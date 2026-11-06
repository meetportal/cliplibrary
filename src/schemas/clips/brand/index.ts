import type { ClipModule } from '../../registry';
import {
  chevronMarkAssembleADefaults,
  chevronMarkAssembleAMeta,
  chevronMarkAssembleASchema,
} from './chevron-mark-assemble-a';
import { chevronMarkAssembleAControls } from './chevron-mark-assemble-a-controls';
import {
  chevronMarkAssembleBDefaults,
  chevronMarkAssembleBMeta,
  chevronMarkAssembleBSchema,
} from './chevron-mark-assemble-b';
import { chevronMarkAssembleBControls } from './chevron-mark-assemble-b-controls';
import {
  chevronMarkAssembleCDefaults,
  chevronMarkAssembleCMeta,
  chevronMarkAssembleCSchema,
} from './chevron-mark-assemble-c';
import { chevronMarkAssembleCControls } from './chevron-mark-assemble-c-controls';
import {
  dotRingLogoRevealADefaults,
  dotRingLogoRevealAMeta,
  dotRingLogoRevealASchema,
} from './dot-ring-logo-reveal-a';
import { dotRingLogoRevealAControls } from './dot-ring-logo-reveal-a-controls';
import {
  dotRingLogoRevealBDefaults,
  dotRingLogoRevealBMeta,
  dotRingLogoRevealBSchema,
} from './dot-ring-logo-reveal-b';
import { dotRingLogoRevealBControls } from './dot-ring-logo-reveal-b-controls';
import {
  dotRingLogoRevealCDefaults,
  dotRingLogoRevealCMeta,
  dotRingLogoRevealCSchema,
} from './dot-ring-logo-reveal-c';
import { dotRingLogoRevealCControls } from './dot-ring-logo-reveal-c-controls';

export const brandClips: ClipModule[] = [
  {
    id: 'chevron-mark-assemble-a',
    schema: chevronMarkAssembleASchema,
    defaults: chevronMarkAssembleADefaults,
    meta: chevronMarkAssembleAMeta,
    controls: chevronMarkAssembleAControls,
  },
  {
    id: 'chevron-mark-assemble-b',
    schema: chevronMarkAssembleBSchema,
    defaults: chevronMarkAssembleBDefaults,
    meta: chevronMarkAssembleBMeta,
    controls: chevronMarkAssembleBControls,
  },
  {
    id: 'chevron-mark-assemble-c',
    schema: chevronMarkAssembleCSchema,
    defaults: chevronMarkAssembleCDefaults,
    meta: chevronMarkAssembleCMeta,
    controls: chevronMarkAssembleCControls,
  },
  {
    id: 'dot-ring-logo-reveal-a',
    schema: dotRingLogoRevealASchema,
    defaults: dotRingLogoRevealADefaults,
    meta: dotRingLogoRevealAMeta,
    controls: dotRingLogoRevealAControls,
  },
  {
    id: 'dot-ring-logo-reveal-b',
    schema: dotRingLogoRevealBSchema,
    defaults: dotRingLogoRevealBDefaults,
    meta: dotRingLogoRevealBMeta,
    controls: dotRingLogoRevealBControls,
  },
  {
    id: 'dot-ring-logo-reveal-c',
    schema: dotRingLogoRevealCSchema,
    defaults: dotRingLogoRevealCDefaults,
    meta: dotRingLogoRevealCMeta,
    controls: dotRingLogoRevealCControls,
  },
];
