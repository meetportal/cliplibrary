import { Composition } from 'remotion';
import { circlePopDefaults, circlePopMeta, circlePopSchema } from '@/schemas';
import { CirclePop } from '../../kinetic-type/circle-pop/circle-pop';
import type { SceneModule } from '../../scene-module';

export const circlePopScene: SceneModule = {
  id: 'circle-pop',
  component: CirclePop,
  render: (key) => (
    <Composition
      key={key}
      id="circle-pop"
      component={CirclePop}
      schema={circlePopSchema}
      defaultProps={circlePopDefaults}
      durationInFrames={circlePopMeta.durationInFrames}
      fps={circlePopMeta.fps}
      width={circlePopMeta.width}
      height={circlePopMeta.height}
    />
  ),
};
