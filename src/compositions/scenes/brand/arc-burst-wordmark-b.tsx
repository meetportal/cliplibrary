import { Composition } from 'remotion';
import {
  type ArcBurstWordmarkBProps,
  arcBurstWordmarkBDefaults,
  arcBurstWordmarkBMeta,
  arcBurstWordmarkBSchema,
} from '@/schemas';
import { ArcBurstWordmark } from '../../brand/arc-burst-wordmark/arc-burst-wordmark';
import type { SceneModule } from '../../scene-module';

const ArcBurstWordmarkB = (props: ArcBurstWordmarkBProps) => <ArcBurstWordmark {...props} />;

export const arcBurstWordmarkBScene: SceneModule = {
  id: 'arc-burst-wordmark-b',
  component: ArcBurstWordmarkB,
  render: (key) => (
    <Composition
      key={key}
      id="arc-burst-wordmark-b"
      component={ArcBurstWordmarkB}
      schema={arcBurstWordmarkBSchema}
      defaultProps={arcBurstWordmarkBDefaults}
      durationInFrames={arcBurstWordmarkBMeta.durationInFrames}
      fps={arcBurstWordmarkBMeta.fps}
      width={arcBurstWordmarkBMeta.width}
      height={arcBurstWordmarkBMeta.height}
    />
  ),
};
