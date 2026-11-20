import type { ClipModule } from '../../registry';
import {
  growthCallScreenDefaults,
  growthCallScreenMeta,
  growthCallScreenSchema,
} from './growth-call-screen';
import { growthCallScreenControls } from './growth-call-screen-controls';

export const screenDemosClips: ClipModule[] = [
  {
    id: 'growth-call-screen',
    schema: growthCallScreenSchema,
    defaults: growthCallScreenDefaults,
    meta: growthCallScreenMeta,
    controls: growthCallScreenControls,
  },
];
