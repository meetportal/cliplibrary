import { Composition } from 'remotion';
import {
  type DotMorphWordmarkBProps,
  dotMorphWordmarkBDefaults,
  dotMorphWordmarkBMeta,
  dotMorphWordmarkBSchema,
} from '@/schemas';
import { DotMorphWordmark } from '../../brand/dot-morph-wordmark/dot-morph-wordmark';
import type { SceneModule } from '../../scene-module';

const DotMorphWordmarkB = (props: DotMorphWordmarkBProps) => <DotMorphWordmark {...props} />;

export const dotMorphWordmarkBScene: SceneModule = {
  id: 'dot-morph-wordmark-b',
  component: DotMorphWordmarkB,
  render: (key) => (
    <Composition
      key={key}
      id="dot-morph-wordmark-b"
      component={DotMorphWordmarkB}
      schema={dotMorphWordmarkBSchema}
      defaultProps={dotMorphWordmarkBDefaults}
      durationInFrames={dotMorphWordmarkBMeta.durationInFrames}
      fps={dotMorphWordmarkBMeta.fps}
      width={dotMorphWordmarkBMeta.width}
      height={dotMorphWordmarkBMeta.height}
    />
  ),
};
