import type { SceneModule } from '../../scene-module';
import { archSaveTheDateScene } from './arch-save-the-date';
import { botanicalSaveTheDateScene } from './botanical-save-the-date';
import { goldMonogramInviteScene } from './gold-monogram-invite';

export const invitationsScenes: SceneModule[] = [
  archSaveTheDateScene,
  botanicalSaveTheDateScene,
  goldMonogramInviteScene,
];
