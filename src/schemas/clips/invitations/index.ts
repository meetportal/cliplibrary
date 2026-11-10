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
import {
  goldMonogramInviteADefaults,
  goldMonogramInviteAMeta,
  goldMonogramInviteASchema,
} from './gold-monogram-invite-a';
import { goldMonogramInviteAControls } from './gold-monogram-invite-a-controls';
import {
  goldMonogramInviteBDefaults,
  goldMonogramInviteBMeta,
  goldMonogramInviteBSchema,
} from './gold-monogram-invite-b';
import { goldMonogramInviteBControls } from './gold-monogram-invite-b-controls';
import {
  goldMonogramInviteCDefaults,
  goldMonogramInviteCMeta,
  goldMonogramInviteCSchema,
} from './gold-monogram-invite-c';
import { goldMonogramInviteCControls } from './gold-monogram-invite-c-controls';

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
  {
    id: 'gold-monogram-invite-a',
    schema: goldMonogramInviteASchema,
    defaults: goldMonogramInviteADefaults,
    meta: goldMonogramInviteAMeta,
    controls: goldMonogramInviteAControls,
  },
  {
    id: 'gold-monogram-invite-b',
    schema: goldMonogramInviteBSchema,
    defaults: goldMonogramInviteBDefaults,
    meta: goldMonogramInviteBMeta,
    controls: goldMonogramInviteBControls,
  },
  {
    id: 'gold-monogram-invite-c',
    schema: goldMonogramInviteCSchema,
    defaults: goldMonogramInviteCDefaults,
    meta: goldMonogramInviteCMeta,
    controls: goldMonogramInviteCControls,
  },
];
