import type { SceneModule } from '../../scene-module';
import { neonSignFlickerAScene } from './neon-sign-flicker-a';
import { neonSignFlickerBScene } from './neon-sign-flicker-b';
import { neonSignFlickerCScene } from './neon-sign-flicker-c';

export const textRevealsScenes: SceneModule[] = [
  neonSignFlickerAScene,
  neonSignFlickerBScene,
  neonSignFlickerCScene,
];
