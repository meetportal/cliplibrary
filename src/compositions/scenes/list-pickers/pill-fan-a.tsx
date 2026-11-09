import { Composition } from 'remotion';
import { type PillFanAProps, pillFanADefaults, pillFanAMeta, pillFanASchema } from '@/schemas';
import { PillFan } from '../../list-pickers/pill-fan/pill-fan';
import type { SceneModule } from '../../scene-module';

const PillFanA = (props: PillFanAProps) => <PillFan {...props} />;

export const pillFanAScene: SceneModule = {
  id: 'pill-fan-a',
  component: PillFanA,
  render: (key) => (
    <Composition
      key={key}
      id="pill-fan-a"
      component={PillFanA}
      schema={pillFanASchema}
      defaultProps={pillFanADefaults}
      durationInFrames={pillFanAMeta.durationInFrames}
      fps={pillFanAMeta.fps}
      width={pillFanAMeta.width}
      height={pillFanAMeta.height}
    />
  ),
};
