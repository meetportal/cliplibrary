import { Composition } from 'remotion';
import {
  anniversaryKineticDefaults,
  anniversaryKineticMeta,
  anniversaryKineticSchema,
} from '@/schemas';
import { AnniversaryKinetic } from '../../kinetic-type/anniversary-kinetic/anniversary-kinetic';
import type { SceneModule } from '../../scene-module';

export const anniversaryKineticScene: SceneModule = {
  id: 'anniversary-kinetic',
  component: AnniversaryKinetic,
  render: (key) => (
    <Composition
      key={key}
      id="anniversary-kinetic"
      component={AnniversaryKinetic}
      schema={anniversaryKineticSchema}
      defaultProps={anniversaryKineticDefaults}
      durationInFrames={anniversaryKineticMeta.durationInFrames}
      fps={anniversaryKineticMeta.fps}
      width={anniversaryKineticMeta.width}
      height={anniversaryKineticMeta.height}
    />
  ),
};
