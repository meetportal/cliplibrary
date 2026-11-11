import type { ClipModule } from '../../registry';
import {
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from './battery-charge-success';
import { batteryChargeSuccessControls } from './battery-charge-success-controls';

export const adRevealsClips: ClipModule[] = [
  {
    id: 'battery-charge-success',
    schema: batteryChargeSuccessSchema,
    defaults: batteryChargeSuccessDefaults,
    meta: batteryChargeSuccessMeta,
    controls: batteryChargeSuccessControls,
  },
];
