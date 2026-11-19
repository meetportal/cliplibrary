import type { ClipModule } from '../../registry';
import { filmDustDefaults, filmDustMeta, filmDustSchema } from './film-dust';
import { filmDustControls } from './film-dust-controls';

export const overlaysClips: ClipModule[] = [
  {
    id: 'film-dust',
    schema: filmDustSchema,
    defaults: filmDustDefaults,
    meta: filmDustMeta,
    controls: filmDustControls,
  },
];
