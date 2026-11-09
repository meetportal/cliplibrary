import type { ClipModule } from '../../registry';
import { pillFanADefaults, pillFanAMeta, pillFanASchema } from './pill-fan-a';
import { pillFanAControls } from './pill-fan-a-controls';
import { pillFanBDefaults, pillFanBMeta, pillFanBSchema } from './pill-fan-b';
import { pillFanBControls } from './pill-fan-b-controls';
import { pillFanCDefaults, pillFanCMeta, pillFanCSchema } from './pill-fan-c';
import { pillFanCControls } from './pill-fan-c-controls';
import { wordPickerADefaults, wordPickerAMeta, wordPickerASchema } from './word-picker-a';
import { wordPickerAControls } from './word-picker-a-controls';
import { wordPickerBDefaults, wordPickerBMeta, wordPickerBSchema } from './word-picker-b';
import { wordPickerBControls } from './word-picker-b-controls';
import { wordPickerCDefaults, wordPickerCMeta, wordPickerCSchema } from './word-picker-c';
import { wordPickerCControls } from './word-picker-c-controls';

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
  {
    id: 'word-picker-a',
    schema: wordPickerASchema,
    defaults: wordPickerADefaults,
    meta: wordPickerAMeta,
    controls: wordPickerAControls,
  },
  {
    id: 'word-picker-b',
    schema: wordPickerBSchema,
    defaults: wordPickerBDefaults,
    meta: wordPickerBMeta,
    controls: wordPickerBControls,
  },
  {
    id: 'word-picker-c',
    schema: wordPickerCSchema,
    defaults: wordPickerCDefaults,
    meta: wordPickerCMeta,
    controls: wordPickerCControls,
  },
];
