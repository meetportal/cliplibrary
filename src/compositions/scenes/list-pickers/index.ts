import type { SceneModule } from '../../scene-module';
import { pillFanAScene } from './pill-fan-a';
import { pillFanBScene } from './pill-fan-b';
import { pillFanCScene } from './pill-fan-c';

export const listPickersScenes: SceneModule[] = [pillFanAScene, pillFanBScene, pillFanCScene];
