import type { SceneModule } from '../../scene-module';
import { chevronMarkAssembleAScene } from './chevron-mark-assemble-a';
import { chevronMarkAssembleBScene } from './chevron-mark-assemble-b';
import { chevronMarkAssembleCScene } from './chevron-mark-assemble-c';

export const brandScenes: SceneModule[] = [
  chevronMarkAssembleAScene,
  chevronMarkAssembleBScene,
  chevronMarkAssembleCScene,
];
