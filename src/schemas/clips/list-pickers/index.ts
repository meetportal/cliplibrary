import type { ClipModule } from '../../registry';
import { pillFanADefaults, pillFanAMeta, pillFanASchema } from './pill-fan-a';
import { pillFanAControls } from './pill-fan-a-controls';
import { pillFanBDefaults, pillFanBMeta, pillFanBSchema } from './pill-fan-b';
import { pillFanBControls } from './pill-fan-b-controls';
import { pillFanCDefaults, pillFanCMeta, pillFanCSchema } from './pill-fan-c';
import { pillFanCControls } from './pill-fan-c-controls';

export const listPickersClips: ClipModule[] = [
  {
    id: 'pill-fan-a',
    schema: pillFanASchema,
    defaults: pillFanADefaults,
    meta: pillFanAMeta,
    controls: pillFanAControls,
  },
  {
    id: 'pill-fan-b',
    schema: pillFanBSchema,
    defaults: pillFanBDefaults,
    meta: pillFanBMeta,
    controls: pillFanBControls,
  },
  {
    id: 'pill-fan-c',
    schema: pillFanCSchema,
    defaults: pillFanCDefaults,
    meta: pillFanCMeta,
    controls: pillFanCControls,
  },
];
