import { Composition } from 'remotion';
import { chalkBadgeDefaults, chalkBadgeMeta, chalkBadgeSchema } from '@/schemas';
import { ChalkBadge } from '../../hand-drawn/chalk-badge/chalk-badge';
import type { SceneModule } from '../../scene-module';

export const chalkBadgeScene: SceneModule = {
  id: 'chalk-badge',
  component: ChalkBadge,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-badge"
      component={ChalkBadge}
      schema={chalkBadgeSchema}
      defaultProps={chalkBadgeDefaults}
      durationInFrames={chalkBadgeMeta.durationInFrames}
      fps={chalkBadgeMeta.fps}
      width={chalkBadgeMeta.width}
      height={chalkBadgeMeta.height}
    />
  ),
};
