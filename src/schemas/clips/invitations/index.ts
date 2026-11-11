import type { ClipModule } from '../../registry';
import {
  archSaveTheDateDefaults,
  archSaveTheDateMeta,
  archSaveTheDateSchema,
} from './arch-save-the-date';
import { archSaveTheDateControls } from './arch-save-the-date-controls';
import {
  botanicalSaveTheDateDefaults,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from './botanical-save-the-date';
import { botanicalSaveTheDateControls } from './botanical-save-the-date-controls';
import {
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from './gold-monogram-invite';
import { goldMonogramInviteControls } from './gold-monogram-invite-controls';

export const invitationsClips: ClipModule[] = [
  {
    id: 'arch-save-the-date',
    schema: archSaveTheDateSchema,
    defaults: archSaveTheDateDefaults,
    meta: archSaveTheDateMeta,
    controls: archSaveTheDateControls,
  },
  {
    id: 'botanical-save-the-date',
    schema: botanicalSaveTheDateSchema,
    defaults: botanicalSaveTheDateDefaults,
    meta: botanicalSaveTheDateMeta,
    controls: botanicalSaveTheDateControls,
  },
  {
    id: 'gold-monogram-invite',
    schema: goldMonogramInviteSchema,
    defaults: goldMonogramInviteDefaults,
    meta: goldMonogramInviteMeta,
    controls: goldMonogramInviteControls,
  },
];
