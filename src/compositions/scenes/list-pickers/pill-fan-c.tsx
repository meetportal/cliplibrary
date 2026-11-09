import { Composition } from 'remotion';
import { type PillFanCProps, pillFanCDefaults, pillFanCMeta, pillFanCSchema } from '@/schemas';
import { PillFan } from '../../list-pickers/pill-fan/pill-fan';
import type { SceneModule } from '../../scene-module';

const PillFanC = (props: PillFanCProps) => <PillFan {...props} />;

export const pillFanCScene: SceneModule = {
  id: 'pill-fan-c',
  component: PillFanC,
  render: (key) => (
    <Composition
      key={key}
      id="pill-fan-c"
      component={PillFanC}
      schema={pillFanCSchema}
      defaultProps={pillFanCDefaults}
      durationInFrames={pillFanCMeta.durationInFrames}
      fps={pillFanCMeta.fps}
      width={pillFanCMeta.width}
      height={pillFanCMeta.height}
    />
  ),
};
