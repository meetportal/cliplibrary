import type { SceneModule } from '../../scene-module';
import { arcBurstWordmarkAScene } from './arc-burst-wordmark-a';
import { arcBurstWordmarkBScene } from './arc-burst-wordmark-b';
import { arcBurstWordmarkCScene } from './arc-burst-wordmark-c';
import { chevronMarkAssembleAScene } from './chevron-mark-assemble-a';
import { chevronMarkAssembleBScene } from './chevron-mark-assemble-b';
import { chevronMarkAssembleCScene } from './chevron-mark-assemble-c';
import { dotRingLogoRevealAScene } from './dot-ring-logo-reveal-a';
import { dotRingLogoRevealBScene } from './dot-ring-logo-reveal-b';
import { dotRingLogoRevealCScene } from './dot-ring-logo-reveal-c';

export const brandScenes: SceneModule[] = [
  chevronMarkAssembleAScene,
  chevronMarkAssembleBScene,
  chevronMarkAssembleCScene,
  arcBurstWordmarkAScene,
  arcBurstWordmarkBScene,
  arcBurstWordmarkCScene,
  dotRingLogoRevealAScene,
  dotRingLogoRevealBScene,
  dotRingLogoRevealCScene,
];
