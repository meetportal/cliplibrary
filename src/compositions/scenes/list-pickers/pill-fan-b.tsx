import { Composition } from 'remotion';
import { type PillFanBProps, pillFanBDefaults, pillFanBMeta, pillFanBSchema } from '@/schemas';
import { PillFan } from '../../list-pickers/pill-fan/pill-fan';
import type { SceneModule } from '../../scene-module';

const PillFanB = (props: PillFanBProps) => <PillFan {...props} />;

export const pillFanBScene: SceneModule = {
  id: 'pill-fan-b',
  component: PillFanB,
  render: (key) => (
    <Composition
      key={key}
      id="pill-fan-b"
      component={PillFanB}
      schema={pillFanBSchema}
      defaultProps={pillFanBDefaults}
      durationInFrames={pillFanBMeta.durationInFrames}
      fps={pillFanBMeta.fps}
      width={pillFanBMeta.width}
      height={pillFanBMeta.height}
    />
  ),
};
