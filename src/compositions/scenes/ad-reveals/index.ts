import type { SceneModule } from '../../scene-module';
import { batteryChargeSuccessScene } from './battery-charge-success';
import { billboardReaderScene } from './billboard-reader';

export const adRevealsScenes: SceneModule[] = [batteryChargeSuccessScene, billboardReaderScene];
