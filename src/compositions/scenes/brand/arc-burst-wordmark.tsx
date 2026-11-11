import { Composition } from 'remotion';
import { arcBurstWordmarkDefaults, arcBurstWordmarkMeta, arcBurstWordmarkSchema } from '@/schemas';
import { ArcBurstWordmark } from '../../brand/arc-burst-wordmark/arc-burst-wordmark';
import type { SceneModule } from '../../scene-module';

export const arcBurstWordmarkScene: SceneModule = {
  id: 'arc-burst-wordmark',
  component: ArcBurstWordmark,
  render: (key) => (
    <Composition
      key={key}
      id="arc-burst-wordmark"
      component={ArcBurstWordmark}
      schema={arcBurstWordmarkSchema}
      defaultProps={arcBurstWordmarkDefaults}
      durationInFrames={arcBurstWordmarkMeta.durationInFrames}
      fps={arcBurstWordmarkMeta.fps}
      width={arcBurstWordmarkMeta.width}
      height={arcBurstWordmarkMeta.height}
    />
  ),
};
