import { Composition } from 'remotion';
import {
  type ComingSoonFlipsCProps,
  comingSoonFlipsCDefaults,
  comingSoonFlipsCMeta,
  comingSoonFlipsCSchema,
} from '@/schemas';
import { ComingSoonFlips } from '../../kinetic-type/coming-soon-flips/coming-soon-flips';
import type { SceneModule } from '../../scene-module';

const ComingSoonFlipsC = (props: ComingSoonFlipsCProps) => <ComingSoonFlips {...props} />;

export const comingSoonFlipsCScene: SceneModule = {
  id: 'coming-soon-flips-c',
  component: ComingSoonFlipsC,
  render: (key) => (
    <Composition
      key={key}
      id="coming-soon-flips-c"
      component={ComingSoonFlipsC}
      schema={comingSoonFlipsCSchema}
      defaultProps={comingSoonFlipsCDefaults}
      durationInFrames={comingSoonFlipsCMeta.durationInFrames}
      fps={comingSoonFlipsCMeta.fps}
      width={comingSoonFlipsCMeta.width}
      height={comingSoonFlipsCMeta.height}
    />
  ),
};
