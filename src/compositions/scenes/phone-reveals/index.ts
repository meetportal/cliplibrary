import type { SceneModule } from '../../scene-module';
import { phoneSpinInAScene } from './phone-spin-in-a';
import { phoneSpinInBScene } from './phone-spin-in-b';
import { phoneSpinInCScene } from './phone-spin-in-c';

export const phoneRevealsScenes: SceneModule[] = [
  phoneSpinInAScene,
  phoneSpinInBScene,
  phoneSpinInCScene,
];
