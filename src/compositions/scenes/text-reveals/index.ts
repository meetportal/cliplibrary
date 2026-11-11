import type { SceneModule } from '../../scene-module';
import { magnifierCaptionScene } from './magnifier-caption';
import { neonSignFlickerScene } from './neon-sign-flicker';

export const textRevealsScenes: SceneModule[] = [neonSignFlickerScene, magnifierCaptionScene];
