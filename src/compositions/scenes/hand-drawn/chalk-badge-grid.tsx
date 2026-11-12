import { Composition } from 'remotion';
import { chalkBadgeGridDefaults, chalkBadgeGridMeta, chalkBadgeGridSchema } from '@/schemas';
import { ChalkBadgeGrid } from '../../hand-drawn/chalk-badge-grid/chalk-badge-grid';
import type { SceneModule } from '../../scene-module';

export const chalkBadgeGridScene: SceneModule = {
  id: 'chalk-badge-grid',
  component: ChalkBadgeGrid,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-badge-grid"
      component={ChalkBadgeGrid}
      schema={chalkBadgeGridSchema}
      defaultProps={chalkBadgeGridDefaults}
      durationInFrames={chalkBadgeGridMeta.durationInFrames}
      fps={chalkBadgeGridMeta.fps}
      width={chalkBadgeGridMeta.width}
      height={chalkBadgeGridMeta.height}
    />
  ),
};
