import { Composition } from 'remotion';
import { chalkBadgesReelDefaults, chalkBadgesReelMeta, chalkBadgesReelSchema } from '@/schemas';
import { ChalkBadgesReel } from '../../hand-drawn/chalk-badges-reel/chalk-badges-reel';
import type { SceneModule } from '../../scene-module';

export const chalkBadgesReelScene: SceneModule = {
  id: 'chalk-badges-reel',
  component: ChalkBadgesReel,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-badges-reel"
      component={ChalkBadgesReel}
      schema={chalkBadgesReelSchema}
      defaultProps={chalkBadgesReelDefaults}
      durationInFrames={chalkBadgesReelMeta.durationInFrames}
      fps={chalkBadgesReelMeta.fps}
      width={chalkBadgesReelMeta.width}
      height={chalkBadgesReelMeta.height}
    />
  ),
};
