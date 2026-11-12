import type { SceneModule } from '../../scene-module';
import { batteryChargeSuccessScene } from './battery-charge-success';
import { billboardReaderScene } from './billboard-reader';
import { burningPaperRevealScene } from './burning-paper-reveal';
import { crumpledPaperRevealScene } from './crumpled-paper-reveal';

export const adRevealsScenes: SceneModule[] = [
  batteryChargeSuccessScene,
  billboardReaderScene,
  burningPaperRevealScene,
  crumpledPaperRevealScene,
];
