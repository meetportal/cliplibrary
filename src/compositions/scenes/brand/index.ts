import type { SceneModule } from '../../scene-module';
import { appIconRevealScene } from './app-icon-reveal';
import { arcBurstWordmarkScene } from './arc-burst-wordmark';
import { brandRevealScene } from './brand-reveal';
import { chevronMarkAssembleScene } from './chevron-mark-assemble';
import { ctaEndCardScene } from './cta-end-card';
import { dotMorphWordmarkScene } from './dot-morph-wordmark';
import { dotRingLogoRevealScene } from './dot-ring-logo-reveal';
import { dotWordmarkRevealScene } from './dot-wordmark-reveal';

export const brandScenes: SceneModule[] = [
  appIconRevealScene,
  arcBurstWordmarkScene,
  brandRevealScene,
  chevronMarkAssembleScene,
  ctaEndCardScene,
  dotMorphWordmarkScene,
  dotRingLogoRevealScene,
  dotWordmarkRevealScene,
];
