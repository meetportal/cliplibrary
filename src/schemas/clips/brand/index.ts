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
];
