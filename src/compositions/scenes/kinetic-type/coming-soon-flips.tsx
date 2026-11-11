import { Composition } from 'remotion';
import { comingSoonFlipsDefaults, comingSoonFlipsMeta, comingSoonFlipsSchema } from '@/schemas';
import { ComingSoonFlips } from '../../kinetic-type/coming-soon-flips/coming-soon-flips';
import type { SceneModule } from '../../scene-module';

export const comingSoonFlipsScene: SceneModule = {
  id: 'coming-soon-flips',
  component: ComingSoonFlips,
  render: (key) => (
    <Composition
      key={key}
      id="coming-soon-flips"
      component={ComingSoonFlips}
      schema={comingSoonFlipsSchema}
      defaultProps={comingSoonFlipsDefaults}
      durationInFrames={comingSoonFlipsMeta.durationInFrames}
      fps={comingSoonFlipsMeta.fps}
      width={comingSoonFlipsMeta.width}
      height={comingSoonFlipsMeta.height}
    />
  ),
};
