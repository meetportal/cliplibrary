import { Composition } from 'remotion';
import { chargeCompareDefaults, chargeCompareMeta, chargeCompareSchema } from '@/schemas';
import { ChargeCompare } from '../../phone-layouts/charge-compare/charge-compare';
import type { SceneModule } from '../../scene-module';

export const chargeCompareScene: SceneModule = {
  id: 'charge-compare',
  component: ChargeCompare,
  render: (key) => (
    <Composition
      key={key}
      id="charge-compare"
      component={ChargeCompare}
      schema={chargeCompareSchema}
      defaultProps={chargeCompareDefaults}
      durationInFrames={chargeCompareMeta.durationInFrames}
      fps={chargeCompareMeta.fps}
      width={chargeCompareMeta.width}
      height={chargeCompareMeta.height}
    />
  ),
};
