import { Composition } from 'remotion';
import { dotMorphWordmarkDefaults, dotMorphWordmarkMeta, dotMorphWordmarkSchema } from '@/schemas';
import { DotMorphWordmark } from '../../brand/dot-morph-wordmark/dot-morph-wordmark';
import type { SceneModule } from '../../scene-module';

export const dotMorphWordmarkScene: SceneModule = {
  id: 'dot-morph-wordmark',
  component: DotMorphWordmark,
  render: (key) => (
    <Composition
      key={key}
      id="dot-morph-wordmark"
      component={DotMorphWordmark}
      schema={dotMorphWordmarkSchema}
      defaultProps={dotMorphWordmarkDefaults}
      durationInFrames={dotMorphWordmarkMeta.durationInFrames}
      fps={dotMorphWordmarkMeta.fps}
      width={dotMorphWordmarkMeta.width}
      height={dotMorphWordmarkMeta.height}
    />
  ),
};
