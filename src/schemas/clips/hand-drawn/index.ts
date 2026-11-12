import type { ClipModule } from '../../registry';
import { chalkBadgeDefaults, chalkBadgeMeta, chalkBadgeSchema } from './chalk-badge';
import { chalkBadgeControls } from './chalk-badge-controls';
import {
  chalkBadgeGridDefaults,
  chalkBadgeGridMeta,
  chalkBadgeGridSchema,
} from './chalk-badge-grid';
import { chalkBadgeGridControls } from './chalk-badge-grid-controls';
import {
  chalkBadgesReelDefaults,
  chalkBadgesReelMeta,
  chalkBadgesReelSchema,
} from './chalk-badges-reel';
import { chalkBadgesReelControls } from './chalk-badges-reel-controls';
import { chalkTitleDefaults, chalkTitleMeta, chalkTitleSchema } from './chalk-title';
import { chalkTitleControls } from './chalk-title-controls';

export const handDrawnClips: ClipModule[] = [
  {
    id: 'chalk-badge',
    schema: chalkBadgeSchema,
    defaults: chalkBadgeDefaults,
    meta: chalkBadgeMeta,
    controls: chalkBadgeControls,
  },
  {
    id: 'chalk-badge-grid',
    schema: chalkBadgeGridSchema,
    defaults: chalkBadgeGridDefaults,
    meta: chalkBadgeGridMeta,
    controls: chalkBadgeGridControls,
  },
  {
    id: 'chalk-badges-reel',
    schema: chalkBadgesReelSchema,
    defaults: chalkBadgesReelDefaults,
    meta: chalkBadgesReelMeta,
    controls: chalkBadgesReelControls,
  },
  {
    id: 'chalk-title',
    schema: chalkTitleSchema,
    defaults: chalkTitleDefaults,
    meta: chalkTitleMeta,
    controls: chalkTitleControls,
  },
];
