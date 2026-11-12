import { Composition } from 'remotion';
import {
  dotWordmarkRevealDefaults,
  dotWordmarkRevealMeta,
  dotWordmarkRevealSchema,
} from '@/schemas';
import { DotWordmarkReveal } from '../../brand/dot-wordmark-reveal/dot-wordmark-reveal';
import type { SceneModule } from '../../scene-module';

export const dotWordmarkRevealScene: SceneModule = {
  id: 'dot-wordmark-reveal',
  component: DotWordmarkReveal,
  render: (key) => (
    <Composition
      key={key}
      id="dot-wordmark-reveal"
      component={DotWordmarkReveal}
      schema={dotWordmarkRevealSchema}
      defaultProps={dotWordmarkRevealDefaults}
      durationInFrames={dotWordmarkRevealMeta.durationInFrames}
      fps={dotWordmarkRevealMeta.fps}
      width={dotWordmarkRevealMeta.width}
      height={dotWordmarkRevealMeta.height}
    />
  ),
};
