import { Composition } from 'remotion';
import {
  type DotMorphWordmarkCProps,
  dotMorphWordmarkCDefaults,
  dotMorphWordmarkCMeta,
  dotMorphWordmarkCSchema,
} from '@/schemas';
import { DotMorphWordmark } from '../../brand/dot-morph-wordmark/dot-morph-wordmark';
import type { SceneModule } from '../../scene-module';

const DotMorphWordmarkC = (props: DotMorphWordmarkCProps) => <DotMorphWordmark {...props} />;

export const dotMorphWordmarkCScene: SceneModule = {
  id: 'dot-morph-wordmark-c',
  component: DotMorphWordmarkC,
  render: (key) => (
    <Composition
      key={key}
      id="dot-morph-wordmark-c"
      component={DotMorphWordmarkC}
      schema={dotMorphWordmarkCSchema}
      defaultProps={dotMorphWordmarkCDefaults}
      durationInFrames={dotMorphWordmarkCMeta.durationInFrames}
      fps={dotMorphWordmarkCMeta.fps}
      width={dotMorphWordmarkCMeta.width}
      height={dotMorphWordmarkCMeta.height}
    />
  ),
};
