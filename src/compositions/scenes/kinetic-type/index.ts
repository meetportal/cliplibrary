import type { SceneModule } from '../../scene-module';
import { anniversaryKineticScene } from './anniversary-kinetic';
import { comingSoonFlipsScene } from './coming-soon-flips';
import { dominoWordsScene } from './domino-words';
import { textRingsScene } from './text-rings';

export const kineticTypeScenes: SceneModule[] = [
  anniversaryKineticScene,
  comingSoonFlipsScene,
  dominoWordsScene,
  textRingsScene,
];
