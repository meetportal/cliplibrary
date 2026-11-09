import { Composition } from 'remotion';
import {
  type ComingSoonFlipsBProps,
  comingSoonFlipsBDefaults,
  comingSoonFlipsBMeta,
  comingSoonFlipsBSchema,
} from '@/schemas';
import { ComingSoonFlips } from '../../kinetic-type/coming-soon-flips/coming-soon-flips';
import type { SceneModule } from '../../scene-module';

const ComingSoonFlipsB = (props: ComingSoonFlipsBProps) => <ComingSoonFlips {...props} />;

export const comingSoonFlipsBScene: SceneModule = {
  id: 'coming-soon-flips-b',
  component: ComingSoonFlipsB,
  render: (key) => (
    <Composition
      key={key}
      id="coming-soon-flips-b"
      component={ComingSoonFlipsB}
      schema={comingSoonFlipsBSchema}
      defaultProps={comingSoonFlipsBDefaults}
      durationInFrames={comingSoonFlipsBMeta.durationInFrames}
      fps={comingSoonFlipsBMeta.fps}
      width={comingSoonFlipsBMeta.width}
      height={comingSoonFlipsBMeta.height}
    />
  ),
};
