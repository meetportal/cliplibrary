import type { ClipModule } from '../../registry';
import { chargeCompareDefaults, chargeCompareMeta, chargeCompareSchema } from './charge-compare';
import { chargeCompareControls } from './charge-compare-controls';

export const phoneLayoutsClips: ClipModule[] = [
  {
    id: 'charge-compare',
    schema: chargeCompareSchema,
    defaults: chargeCompareDefaults,
    meta: chargeCompareMeta,
    controls: chargeCompareControls,
  },
];
