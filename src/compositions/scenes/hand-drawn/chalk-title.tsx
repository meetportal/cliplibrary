import { Composition } from 'remotion';
import { chalkTitleDefaults, chalkTitleMeta, chalkTitleSchema } from '@/schemas';
import { ChalkTitle } from '../../hand-drawn/chalk-title/chalk-title';
import type { SceneModule } from '../../scene-module';

export const chalkTitleScene: SceneModule = {
  id: 'chalk-title',
  component: ChalkTitle,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-title"
      component={ChalkTitle}
      schema={chalkTitleSchema}
      defaultProps={chalkTitleDefaults}
      durationInFrames={chalkTitleMeta.durationInFrames}
      fps={chalkTitleMeta.fps}
      width={chalkTitleMeta.width}
      height={chalkTitleMeta.height}
    />
  ),
};
