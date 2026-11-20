import type { ClipModule } from '../../registry';
import {
  appScreensPromoDefaults,
  appScreensPromoMeta,
  appScreensPromoSchema,
} from './app-screens-promo';
import { appScreensPromoControls } from './app-screens-promo-controls';
import { chargeCompareDefaults, chargeCompareMeta, chargeCompareSchema } from './charge-compare';
import { chargeCompareControls } from './charge-compare-controls';

export const phoneLayoutsClips: ClipModule[] = [
  {
    id: 'app-screens-promo',
    schema: appScreensPromoSchema,
    defaults: appScreensPromoDefaults,
    meta: appScreensPromoMeta,
    controls: appScreensPromoControls,
  },
  {
    id: 'charge-compare',
    schema: chargeCompareSchema,
    defaults: chargeCompareDefaults,
    meta: chargeCompareMeta,
    controls: chargeCompareControls,
  },
];
