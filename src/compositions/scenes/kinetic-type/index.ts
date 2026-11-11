import type { SceneModule } from '../../scene-module';
import { anniversaryKineticScene } from './anniversary-kinetic';
import { brandingIsTickerScene } from './branding-is-ticker';
import { comingSoonFlipsScene } from './coming-soon-flips';
import { dominoWordsScene } from './domino-words';
import { textRingsScene } from './text-rings';

export const kineticTypeScenes: SceneModule[] = [
  anniversaryKineticScene,
  brandingIsTickerScene,
  comingSoonFlipsScene,
  dominoWordsScene,
  textRingsScene,
];
