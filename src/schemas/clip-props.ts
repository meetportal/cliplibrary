import type { ChevronMarkAssembleAProps } from './clips/brand/chevron-mark-assemble-a';
import type { ChevronMarkAssembleBProps } from './clips/brand/chevron-mark-assemble-b';
import type { ChevronMarkAssembleCProps } from './clips/brand/chevron-mark-assemble-c';

export interface ClipPropsMap {
  'chevron-mark-assemble-a': ChevronMarkAssembleAProps;
  'chevron-mark-assemble-b': ChevronMarkAssembleBProps;
  'chevron-mark-assemble-c': ChevronMarkAssembleCProps;
}

export type ClipId = keyof ClipPropsMap;

export type ClipProps<Id extends ClipId = ClipId> = ClipPropsMap[Id];
