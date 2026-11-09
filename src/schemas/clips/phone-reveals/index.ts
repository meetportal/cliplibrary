import type { ClipModule } from '../../registry';
import { phoneSpinInADefaults, phoneSpinInAMeta, phoneSpinInASchema } from './phone-spin-in-a';
import { phoneSpinInAControls } from './phone-spin-in-a-controls';
import { phoneSpinInBDefaults, phoneSpinInBMeta, phoneSpinInBSchema } from './phone-spin-in-b';
import { phoneSpinInBControls } from './phone-spin-in-b-controls';
import { phoneSpinInCDefaults, phoneSpinInCMeta, phoneSpinInCSchema } from './phone-spin-in-c';
import { phoneSpinInCControls } from './phone-spin-in-c-controls';

export const phoneRevealsClips: ClipModule[] = [
  {
    id: 'phone-spin-in-a',
    schema: phoneSpinInASchema,
    defaults: phoneSpinInADefaults,
    meta: phoneSpinInAMeta,
    controls: phoneSpinInAControls,
  },
  {
    id: 'phone-spin-in-b',
    schema: phoneSpinInBSchema,
    defaults: phoneSpinInBDefaults,
    meta: phoneSpinInBMeta,
    controls: phoneSpinInBControls,
  },
  {
    id: 'phone-spin-in-c',
    schema: phoneSpinInCSchema,
    defaults: phoneSpinInCDefaults,
    meta: phoneSpinInCMeta,
    controls: phoneSpinInCControls,
  },
];
