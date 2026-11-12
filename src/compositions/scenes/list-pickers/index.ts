import type { SceneModule } from '../../scene-module';
import { colorPillsScene } from './color-pills';
import { pillFanScene } from './pill-fan';
import { wordPickerScene } from './word-picker';

export const listPickersScenes: SceneModule[] = [colorPillsScene, pillFanScene, wordPickerScene];
