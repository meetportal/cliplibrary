import { Composition } from 'remotion';
import { pillFanDefaults, pillFanMeta, pillFanSchema } from '@/schemas';
import { PillFan } from '../../list-pickers/pill-fan/pill-fan';
import type { SceneModule } from '../../scene-module';

export const pillFanScene: SceneModule = {
  id: 'pill-fan',
  component: PillFan,
  render: (key) => (
    <Composition
      key={key}
      id="pill-fan"
      component={PillFan}
      schema={pillFanSchema}
      defaultProps={pillFanDefaults}
      durationInFrames={pillFanMeta.durationInFrames}
      fps={pillFanMeta.fps}
      width={pillFanMeta.width}
      height={pillFanMeta.height}
    />
  ),
};
