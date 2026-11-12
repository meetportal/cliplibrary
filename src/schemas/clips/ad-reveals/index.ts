import type { ClipModule } from '../../registry';
import {
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from './battery-charge-success';
import { batteryChargeSuccessControls } from './battery-charge-success-controls';
import {
  billboardReaderDefaults,
  billboardReaderMeta,
  billboardReaderSchema,
} from './billboard-reader';
import { billboardReaderControls } from './billboard-reader-controls';
import {
  burningPaperRevealDefaults,
  burningPaperRevealMeta,
  burningPaperRevealSchema,
} from './burning-paper-reveal';
import { burningPaperRevealControls } from './burning-paper-reveal-controls';

export const adRevealsClips: ClipModule[] = [
  {
    id: 'battery-charge-success',
    schema: batteryChargeSuccessSchema,
    defaults: batteryChargeSuccessDefaults,
    meta: batteryChargeSuccessMeta,
    controls: batteryChargeSuccessControls,
  },
  {
    id: 'billboard-reader',
    schema: billboardReaderSchema,
    defaults: billboardReaderDefaults,
    meta: billboardReaderMeta,
    controls: billboardReaderControls,
  },
  {
    id: 'burning-paper-reveal',
    schema: burningPaperRevealSchema,
    defaults: burningPaperRevealDefaults,
    meta: burningPaperRevealMeta,
    controls: burningPaperRevealControls,
  },
];
