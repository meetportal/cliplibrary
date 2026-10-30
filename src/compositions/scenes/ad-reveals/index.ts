import type { SceneModule } from '../../scene-module';
import { batteryChargeSuccessScene } from './battery-charge-success';
import { billboardReaderScene } from './billboard-reader';
import { burningPaperRevealScene } from './burning-paper-reveal';
import { crumpledPaperRevealScene } from './crumpled-paper-reveal';
import { helicopterUnveilScene } from './helicopter-unveil';
import { mailinfraThreadFeaturesScene } from './mailinfra-thread-features';
import { problemStrikeoutScene } from './problem-strikeout';
import { spillRevealScene } from './spill-reveal';

export const adRevealsScenes: SceneModule[] = [
  helicopterUnveilScene,
  problemStrikeoutScene,
  spillRevealScene,
  crumpledPaperRevealScene,
  batteryChargeSuccessScene,
  billboardReaderScene,
  burningPaperRevealScene,
  mailinfraThreadFeaturesScene,
];
