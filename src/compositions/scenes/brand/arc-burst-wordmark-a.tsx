import { Composition } from 'remotion';
import {
  type ArcBurstWordmarkAProps,
  arcBurstWordmarkADefaults,
  arcBurstWordmarkAMeta,
  arcBurstWordmarkASchema,
} from '@/schemas';
import { ArcBurstWordmark } from '../../brand/arc-burst-wordmark/arc-burst-wordmark';
import type { SceneModule } from '../../scene-module';

const ArcBurstWordmarkA = (props: ArcBurstWordmarkAProps) => <ArcBurstWordmark {...props} />;

export const arcBurstWordmarkAScene: SceneModule = {
  id: 'arc-burst-wordmark-a',
  component: ArcBurstWordmarkA,
  render: (key) => (
    <Composition
      key={key}
      id="arc-burst-wordmark-a"
      component={ArcBurstWordmarkA}
      schema={arcBurstWordmarkASchema}
      defaultProps={arcBurstWordmarkADefaults}
      durationInFrames={arcBurstWordmarkAMeta.durationInFrames}
      fps={arcBurstWordmarkAMeta.fps}
      width={arcBurstWordmarkAMeta.width}
      height={arcBurstWordmarkAMeta.height}
    />
  ),
};
