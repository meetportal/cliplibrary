import { Composition } from 'remotion';
import {
  type DotRingLogoRevealAProps,
  dotRingLogoRevealADefaults,
  dotRingLogoRevealAMeta,
  dotRingLogoRevealASchema,
} from '@/schemas';
import { DotRingLogoReveal } from '../../brand/dot-ring-logo-reveal/dot-ring-logo-reveal';
import type { SceneModule } from '../../scene-module';

const DotRingLogoRevealA = (props: DotRingLogoRevealAProps) => <DotRingLogoReveal {...props} />;

export const dotRingLogoRevealAScene: SceneModule = {
  id: 'dot-ring-logo-reveal-a',
  component: DotRingLogoRevealA,
  render: (key) => (
    <Composition
      key={key}
      id="dot-ring-logo-reveal-a"
      component={DotRingLogoRevealA}
      schema={dotRingLogoRevealASchema}
      defaultProps={dotRingLogoRevealADefaults}
      durationInFrames={dotRingLogoRevealAMeta.durationInFrames}
      fps={dotRingLogoRevealAMeta.fps}
      width={dotRingLogoRevealAMeta.width}
      height={dotRingLogoRevealAMeta.height}
    />
  ),
};
