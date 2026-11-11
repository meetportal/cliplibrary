import { Composition } from 'remotion';
import {
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from '@/schemas';
import { BatteryChargeSuccess } from '../../ad-reveals/battery-charge-success/battery-charge-success';
import type { SceneModule } from '../../scene-module';

export const batteryChargeSuccessScene: SceneModule = {
  id: 'battery-charge-success',
  component: BatteryChargeSuccess,
  render: (key) => (
    <Composition
      key={key}
      id="battery-charge-success"
      component={BatteryChargeSuccess}
      schema={batteryChargeSuccessSchema}
      defaultProps={batteryChargeSuccessDefaults}
      durationInFrames={batteryChargeSuccessMeta.durationInFrames}
      fps={batteryChargeSuccessMeta.fps}
      width={batteryChargeSuccessMeta.width}
      height={batteryChargeSuccessMeta.height}
    />
  ),
};
