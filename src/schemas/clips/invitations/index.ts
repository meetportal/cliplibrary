import type { ClipModule } from '../../registry';
import {
  botanicalSaveTheDateADefaults,
  botanicalSaveTheDateAMeta,
  botanicalSaveTheDateASchema,
} from './botanical-save-the-date-a';
import { botanicalSaveTheDateAControls } from './botanical-save-the-date-a-controls';
import {
  botanicalSaveTheDateBDefaults,
  botanicalSaveTheDateBMeta,
  botanicalSaveTheDateBSchema,
} from './botanical-save-the-date-b';
import { botanicalSaveTheDateBControls } from './botanical-save-the-date-b-controls';
import {
  botanicalSaveTheDateCDefaults,
  botanicalSaveTheDateCMeta,
  botanicalSaveTheDateCSchema,
} from './botanical-save-the-date-c';
import { botanicalSaveTheDateCControls } from './botanical-save-the-date-c-controls';

export const invitationsClips: ClipModule[] = [
  {
    id: 'botanical-save-the-date-a',
    schema: botanicalSaveTheDateASchema,
    defaults: botanicalSaveTheDateADefaults,
    meta: botanicalSaveTheDateAMeta,
    controls: botanicalSaveTheDateAControls,
  },
  {
    id: 'botanical-save-the-date-b',
    schema: botanicalSaveTheDateBSchema,
    defaults: botanicalSaveTheDateBDefaults,
    meta: botanicalSaveTheDateBMeta,
    controls: botanicalSaveTheDateBControls,
  },
  {
    id: 'botanical-save-the-date-c',
    schema: botanicalSaveTheDateCSchema,
    defaults: botanicalSaveTheDateCDefaults,
    meta: botanicalSaveTheDateCMeta,
    controls: botanicalSaveTheDateCControls,
  },
];
