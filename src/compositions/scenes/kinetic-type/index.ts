import type { SceneModule } from '../../scene-module';
import { comingSoonFlipsAScene } from './coming-soon-flips-a';
import { comingSoonFlipsBScene } from './coming-soon-flips-b';
import { comingSoonFlipsCScene } from './coming-soon-flips-c';

export const kineticTypeScenes: SceneModule[] = [
  comingSoonFlipsAScene,
  comingSoonFlipsBScene,
  comingSoonFlipsCScene,
];
