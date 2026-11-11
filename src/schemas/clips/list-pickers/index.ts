import type { ClipModule } from '../../registry';
import { pillFanDefaults, pillFanMeta, pillFanSchema } from './pill-fan';
import { pillFanControls } from './pill-fan-controls';
import { wordPickerDefaults, wordPickerMeta, wordPickerSchema } from './word-picker';
import { wordPickerControls } from './word-picker-controls';

export const listPickersClips: ClipModule[] = [
  {
    id: 'pill-fan',
    schema: pillFanSchema,
    defaults: pillFanDefaults,
    meta: pillFanMeta,
    controls: pillFanControls,
  },
  {
    id: 'word-picker',
    schema: wordPickerSchema,
    defaults: wordPickerDefaults,
    meta: wordPickerMeta,
    controls: wordPickerControls,
  },
];
