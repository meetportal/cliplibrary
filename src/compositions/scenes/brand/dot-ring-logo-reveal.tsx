import { Composition } from 'remotion';
import {
  dotRingLogoRevealDefaults,
  dotRingLogoRevealMeta,
  dotRingLogoRevealSchema,
} from '@/schemas';
import { DotRingLogoReveal } from '../../brand/dot-ring-logo-reveal/dot-ring-logo-reveal';
import type { SceneModule } from '../../scene-module';

export const dotRingLogoRevealScene: SceneModule = {
  id: 'dot-ring-logo-reveal',
  component: DotRingLogoReveal,
  render: (key) => (
    <Composition
      key={key}
      id="dot-ring-logo-reveal"
      component={DotRingLogoReveal}
      schema={dotRingLogoRevealSchema}
      defaultProps={dotRingLogoRevealDefaults}
      durationInFrames={dotRingLogoRevealMeta.durationInFrames}
      fps={dotRingLogoRevealMeta.fps}
      width={dotRingLogoRevealMeta.width}
      height={dotRingLogoRevealMeta.height}
    />
  ),
};
