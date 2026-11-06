import { Composition } from 'remotion';
import {
  type DotRingLogoRevealCProps,
  dotRingLogoRevealCDefaults,
  dotRingLogoRevealCMeta,
  dotRingLogoRevealCSchema,
} from '@/schemas';
import { DotRingLogoReveal } from '../../brand/dot-ring-logo-reveal/dot-ring-logo-reveal';
import type { SceneModule } from '../../scene-module';

const DotRingLogoRevealC = (props: DotRingLogoRevealCProps) => <DotRingLogoReveal {...props} />;

export const dotRingLogoRevealCScene: SceneModule = {
  id: 'dot-ring-logo-reveal-c',
  component: DotRingLogoRevealC,
  render: (key) => (
    <Composition
      key={key}
      id="dot-ring-logo-reveal-c"
      component={DotRingLogoRevealC}
      schema={dotRingLogoRevealCSchema}
      defaultProps={dotRingLogoRevealCDefaults}
      durationInFrames={dotRingLogoRevealCMeta.durationInFrames}
      fps={dotRingLogoRevealCMeta.fps}
      width={dotRingLogoRevealCMeta.width}
      height={dotRingLogoRevealCMeta.height}
    />
  ),
};
