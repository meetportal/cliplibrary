import { Composition } from 'remotion';
import { doodleArrowsDefaults, doodleArrowsMeta, doodleArrowsSchema } from '@/schemas';
import { DoodleArrows } from '../../hand-drawn/doodle-arrows/doodle-arrows';
import type { SceneModule } from '../../scene-module';

export const doodleArrowsScene: SceneModule = {
  id: 'doodle-arrows',
  component: DoodleArrows,
  render: (key) => (
    <Composition
      key={key}
      id="doodle-arrows"
      component={DoodleArrows}
      schema={doodleArrowsSchema}
      defaultProps={doodleArrowsDefaults}
      durationInFrames={doodleArrowsMeta.durationInFrames}
      fps={doodleArrowsMeta.fps}
      width={doodleArrowsMeta.width}
      height={doodleArrowsMeta.height}
    />
  ),
};
