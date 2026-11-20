import { Composition } from 'remotion';
import {
  pendulumBrandSwingDefaults,
  pendulumBrandSwingMeta,
  pendulumBrandSwingSchema,
} from '@/schemas';
import { PendulumBrandSwing } from '../../brand/pendulum-brand-swing/pendulum-brand-swing';
import type { SceneModule } from '../../scene-module';

export const pendulumBrandSwingScene: SceneModule = {
  id: 'pendulum-brand-swing',
  component: PendulumBrandSwing,
  render: (key) => (
    <Composition
      key={key}
      id="pendulum-brand-swing"
      component={PendulumBrandSwing}
      schema={pendulumBrandSwingSchema}
      defaultProps={pendulumBrandSwingDefaults}
      durationInFrames={pendulumBrandSwingMeta.durationInFrames}
      fps={pendulumBrandSwingMeta.fps}
      width={pendulumBrandSwingMeta.width}
      height={pendulumBrandSwingMeta.height}
    />
  ),
};
