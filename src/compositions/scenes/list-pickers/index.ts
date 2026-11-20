import type { SceneModule } from '../../scene-module';
import { colorPillsScene } from './color-pills';
import { pillFanScene } from './pill-fan';
import { techStackBranchesScene } from './tech-stack-branches';
import { wordPickerScene } from './word-picker';

export const listPickersScenes: SceneModule[] = [
  colorPillsScene,
  pillFanScene,
  techStackBranchesScene,
  wordPickerScene,
];
