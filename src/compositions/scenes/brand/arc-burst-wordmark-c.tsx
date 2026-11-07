import { Composition } from 'remotion';
import {
  type ArcBurstWordmarkCProps,
  arcBurstWordmarkCDefaults,
  arcBurstWordmarkCMeta,
  arcBurstWordmarkCSchema,
} from '@/schemas';
import { ArcBurstWordmark } from '../../brand/arc-burst-wordmark/arc-burst-wordmark';
import type { SceneModule } from '../../scene-module';

const ArcBurstWordmarkC = (props: ArcBurstWordmarkCProps) => <ArcBurstWordmark {...props} />;

export const arcBurstWordmarkCScene: SceneModule = {
  id: 'arc-burst-wordmark-c',
  component: ArcBurstWordmarkC,
  render: (key) => (
    <Composition
      key={key}
      id="arc-burst-wordmark-c"
      component={ArcBurstWordmarkC}
      schema={arcBurstWordmarkCSchema}
      defaultProps={arcBurstWordmarkCDefaults}
      durationInFrames={arcBurstWordmarkCMeta.durationInFrames}
      fps={arcBurstWordmarkCMeta.fps}
      width={arcBurstWordmarkCMeta.width}
      height={arcBurstWordmarkCMeta.height}
    />
  ),
};
