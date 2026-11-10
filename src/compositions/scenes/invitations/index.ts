import type { SceneModule } from '../../scene-module';
import { botanicalSaveTheDateAScene } from './botanical-save-the-date-a';
import { botanicalSaveTheDateBScene } from './botanical-save-the-date-b';
import { botanicalSaveTheDateCScene } from './botanical-save-the-date-c';
import { goldMonogramInviteAScene } from './gold-monogram-invite-a';
import { goldMonogramInviteBScene } from './gold-monogram-invite-b';
import { goldMonogramInviteCScene } from './gold-monogram-invite-c';

export const invitationsScenes: SceneModule[] = [
  botanicalSaveTheDateAScene,
  botanicalSaveTheDateBScene,
  botanicalSaveTheDateCScene,
  goldMonogramInviteAScene,
  goldMonogramInviteBScene,
  goldMonogramInviteCScene,
];
