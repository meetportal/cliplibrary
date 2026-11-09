import type { SceneModule } from '../../scene-module';
import { magnifierCaptionAScene } from './magnifier-caption-a';
import { magnifierCaptionBScene } from './magnifier-caption-b';
import { magnifierCaptionCScene } from './magnifier-caption-c';
import { neonSignFlickerAScene } from './neon-sign-flicker-a';
import { neonSignFlickerBScene } from './neon-sign-flicker-b';
import { neonSignFlickerCScene } from './neon-sign-flicker-c';

export const textRevealsScenes: SceneModule[] = [
  neonSignFlickerAScene,
  neonSignFlickerBScene,
  neonSignFlickerCScene,
  magnifierCaptionAScene,
  magnifierCaptionBScene,
  magnifierCaptionCScene,
];
