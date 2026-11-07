import { Composition } from 'remotion';
import {
  type DotMorphWordmarkAProps,
  dotMorphWordmarkADefaults,
  dotMorphWordmarkAMeta,
  dotMorphWordmarkASchema,
} from '@/schemas';
import { DotMorphWordmark } from '../../brand/dot-morph-wordmark/dot-morph-wordmark';
import type { SceneModule } from '../../scene-module';

const DotMorphWordmarkA = (props: DotMorphWordmarkAProps) => <DotMorphWordmark {...props} />;

export const dotMorphWordmarkAScene: SceneModule = {
  id: 'dot-morph-wordmark-a',
  component: DotMorphWordmarkA,
  render: (key) => (
    <Composition
      key={key}
      id="dot-morph-wordmark-a"
      component={DotMorphWordmarkA}
      schema={dotMorphWordmarkASchema}
      defaultProps={dotMorphWordmarkADefaults}
      durationInFrames={dotMorphWordmarkAMeta.durationInFrames}
      fps={dotMorphWordmarkAMeta.fps}
      width={dotMorphWordmarkAMeta.width}
      height={dotMorphWordmarkAMeta.height}
    />
  ),
};
