import type { ClipModule } from '../../registry';
import { phoneSpinInDefaults, phoneSpinInMeta, phoneSpinInSchema } from './phone-spin-in';
import { phoneSpinInControls } from './phone-spin-in-controls';

export const phoneRevealsClips: ClipModule[] = [
  {
    id: 'phone-spin-in',
    schema: phoneSpinInSchema,
    defaults: phoneSpinInDefaults,
    meta: phoneSpinInMeta,
    controls: phoneSpinInControls,
  },
];
