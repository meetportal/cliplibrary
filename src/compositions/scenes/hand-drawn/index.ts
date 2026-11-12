import type { SceneModule } from '../../scene-module';
import { chalkBadgeScene } from './chalk-badge';
import { chalkBadgeGridScene } from './chalk-badge-grid';
import { chalkBadgesReelScene } from './chalk-badges-reel';
import { chalkTitleScene } from './chalk-title';

export const handDrawnScenes: SceneModule[] = [
  chalkBadgeScene,
  chalkBadgeGridScene,
  chalkBadgesReelScene,
  chalkTitleScene,
];
