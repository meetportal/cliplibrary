import { Composition } from 'remotion';
import {
  type ComingSoonFlipsAProps,
  comingSoonFlipsADefaults,
  comingSoonFlipsAMeta,
  comingSoonFlipsASchema,
} from '@/schemas';
import { ComingSoonFlips } from '../../kinetic-type/coming-soon-flips/coming-soon-flips';
import type { SceneModule } from '../../scene-module';

const ComingSoonFlipsA = (props: ComingSoonFlipsAProps) => <ComingSoonFlips {...props} />;

export const comingSoonFlipsAScene: SceneModule = {
  id: 'coming-soon-flips-a',
  component: ComingSoonFlipsA,
  render: (key) => (
    <Composition
      key={key}
      id="coming-soon-flips-a"
      component={ComingSoonFlipsA}
      schema={comingSoonFlipsASchema}
      defaultProps={comingSoonFlipsADefaults}
      durationInFrames={comingSoonFlipsAMeta.durationInFrames}
      fps={comingSoonFlipsAMeta.fps}
      width={comingSoonFlipsAMeta.width}
      height={comingSoonFlipsAMeta.height}
    />
  ),
};
