import { Composition } from 'remotion';
import {
  type DotRingLogoRevealBProps,
  dotRingLogoRevealBDefaults,
  dotRingLogoRevealBMeta,
  dotRingLogoRevealBSchema,
} from '@/schemas';
import { DotRingLogoReveal } from '../../brand/dot-ring-logo-reveal/dot-ring-logo-reveal';
import type { SceneModule } from '../../scene-module';

const DotRingLogoRevealB = (props: DotRingLogoRevealBProps) => <DotRingLogoReveal {...props} />;

export const dotRingLogoRevealBScene: SceneModule = {
  id: 'dot-ring-logo-reveal-b',
  component: DotRingLogoRevealB,
  render: (key) => (
    <Composition
      key={key}
      id="dot-ring-logo-reveal-b"
      component={DotRingLogoRevealB}
      schema={dotRingLogoRevealBSchema}
      defaultProps={dotRingLogoRevealBDefaults}
      durationInFrames={dotRingLogoRevealBMeta.durationInFrames}
      fps={dotRingLogoRevealBMeta.fps}
      width={dotRingLogoRevealBMeta.width}
      height={dotRingLogoRevealBMeta.height}
    />
  ),
};
