import { Composition } from 'remotion';
import { growthCallScreenDefaults, growthCallScreenMeta, growthCallScreenSchema } from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { GrowthCallScreen } from '../../screen-demos/growth-call-screen/growth-call-screen';

export const growthCallScreenScene: SceneModule = {
  id: 'growth-call-screen',
  component: GrowthCallScreen,
  render: (key) => (
    <Composition
      key={key}
      id="growth-call-screen"
      component={GrowthCallScreen}
      schema={growthCallScreenSchema}
      defaultProps={growthCallScreenDefaults}
      durationInFrames={growthCallScreenMeta.durationInFrames}
      fps={growthCallScreenMeta.fps}
      width={growthCallScreenMeta.width}
      height={growthCallScreenMeta.height}
    />
  ),
};
