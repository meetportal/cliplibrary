import type { SceneModule } from '../../scene-module';
import { pillFanAScene } from './pill-fan-a';
import { pillFanBScene } from './pill-fan-b';
import { pillFanCScene } from './pill-fan-c';
import { wordPickerAScene } from './word-picker-a';
import { wordPickerBScene } from './word-picker-b';
import { wordPickerCScene } from './word-picker-c';

export const listPickersScenes: SceneModule[] = [
  pillFanAScene,
  pillFanBScene,
  pillFanCScene,
  wordPickerAScene,
  wordPickerBScene,
  wordPickerCScene,
];
