import type { SceneModule } from '../../scene-module';
import { batteryChargeSuccessScene } from './battery-charge-success';
import { billboardReaderScene } from './billboard-reader';
import { burningPaperRevealScene } from './burning-paper-reveal';

export const adRevealsScenes: SceneModule[] = [
  batteryChargeSuccessScene,
  billboardReaderScene,
  burningPaperRevealScene,
];
