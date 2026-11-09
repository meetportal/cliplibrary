import type { SceneModule } from '../../scene-module';
import { comingSoonFlipsAScene } from './coming-soon-flips-a';
import { comingSoonFlipsBScene } from './coming-soon-flips-b';
import { comingSoonFlipsCScene } from './coming-soon-flips-c';
import { dominoWordsAScene } from './domino-words-a';
import { dominoWordsBScene } from './domino-words-b';
import { dominoWordsCScene } from './domino-words-c';
import { textRingsAScene } from './text-rings-a';
import { textRingsBScene } from './text-rings-b';
import { textRingsCScene } from './text-rings-c';

export const kineticTypeScenes: SceneModule[] = [
  comingSoonFlipsAScene,
  comingSoonFlipsBScene,
  comingSoonFlipsCScene,
  dominoWordsAScene,
  dominoWordsBScene,
  dominoWordsCScene,
  textRingsAScene,
  textRingsBScene,
  textRingsCScene,
];
