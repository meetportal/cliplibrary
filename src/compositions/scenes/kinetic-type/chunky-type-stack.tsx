import { Composition } from 'remotion';
import { chunkyTypeStackDefaults, chunkyTypeStackMeta, chunkyTypeStackSchema } from '@/schemas';
import { ChunkyTypeStack } from '../../kinetic-type/chunky-type-stack/chunky-type-stack';
import type { SceneModule } from '../../scene-module';

export const chunkyTypeStackScene: SceneModule = {
  id: 'chunky-type-stack',
  component: ChunkyTypeStack,
  render: (key) => (
    <Composition
      key={key}
      id="chunky-type-stack"
      component={ChunkyTypeStack}
      schema={chunkyTypeStackSchema}
      defaultProps={chunkyTypeStackDefaults}
      durationInFrames={chunkyTypeStackMeta.durationInFrames}
      fps={chunkyTypeStackMeta.fps}
      width={chunkyTypeStackMeta.width}
      height={chunkyTypeStackMeta.height}
    />
  ),
};
