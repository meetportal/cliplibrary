import type { ClipModule } from '../../registry';
import { colorPillsDefaults, colorPillsMeta, colorPillsSchema } from './color-pills';
import { colorPillsControls } from './color-pills-controls';
import { pillFanDefaults, pillFanMeta, pillFanSchema } from './pill-fan';
import { pillFanControls } from './pill-fan-controls';
import {
  techStackBranchesDefaults,
  techStackBranchesMeta,
  techStackBranchesSchema,
} from './tech-stack-branches';
import { techStackBranchesControls } from './tech-stack-branches-controls';
import { wordPickerDefaults, wordPickerMeta, wordPickerSchema } from './word-picker';
import { wordPickerControls } from './word-picker-controls';

export const listPickersClips: ClipModule[] = [
  {
    id: 'color-pills',
    schema: colorPillsSchema,
    defaults: colorPillsDefaults,
    meta: colorPillsMeta,
    controls: colorPillsControls,
  },
  {
    id: 'pill-fan',
    schema: pillFanSchema,
    defaults: pillFanDefaults,
    meta: pillFanMeta,
    controls: pillFanControls,
  },
  {
    id: 'tech-stack-branches',
    schema: techStackBranchesSchema,
    defaults: techStackBranchesDefaults,
    meta: techStackBranchesMeta,
    controls: techStackBranchesControls,
  },
  {
    id: 'word-picker',
    schema: wordPickerSchema,
    defaults: wordPickerDefaults,
    meta: wordPickerMeta,
    controls: wordPickerControls,
  },
];
