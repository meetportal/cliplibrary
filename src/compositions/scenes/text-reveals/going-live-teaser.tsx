import { Composition } from 'remotion';
import { goingLiveTeaserDefaults, goingLiveTeaserMeta, goingLiveTeaserSchema } from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { GoingLiveTeaser } from '../../text-reveals/going-live-teaser/going-live-teaser';

export const goingLiveTeaserScene: SceneModule = {
  id: 'going-live-teaser',
  component: GoingLiveTeaser,
  render: (key) => (
    <Composition
      key={key}
      id="going-live-teaser"
      component={GoingLiveTeaser}
      schema={goingLiveTeaserSchema}
      defaultProps={goingLiveTeaserDefaults}
      durationInFrames={goingLiveTeaserMeta.durationInFrames}
      fps={goingLiveTeaserMeta.fps}
      width={goingLiveTeaserMeta.width}
      height={goingLiveTeaserMeta.height}
    />
  ),
};
