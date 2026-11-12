import type { ClipModule } from '../../registry';
import { chalkBadgeDefaults, chalkBadgeMeta, chalkBadgeSchema } from './chalk-badge';
import { chalkBadgeControls } from './chalk-badge-controls';

export const handDrawnClips: ClipModule[] = [
  {
    id: 'chalk-badge',
    schema: chalkBadgeSchema,
    defaults: chalkBadgeDefaults,
    meta: chalkBadgeMeta,
    controls: chalkBadgeControls,
  },
];
