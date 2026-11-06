import type { ChevronMarkAssembleAProps } from './clips/brand/chevron-mark-assemble-a';
import type { ChevronMarkAssembleBProps } from './clips/brand/chevron-mark-assemble-b';
import type { ChevronMarkAssembleCProps } from './clips/brand/chevron-mark-assemble-c';
import type { DotRingLogoRevealAProps } from './clips/brand/dot-ring-logo-reveal-a';
import type { DotRingLogoRevealBProps } from './clips/brand/dot-ring-logo-reveal-b';
import type { DotRingLogoRevealCProps } from './clips/brand/dot-ring-logo-reveal-c';

export interface ClipPropsMap {
  'chevron-mark-assemble-a': ChevronMarkAssembleAProps;
  'chevron-mark-assemble-b': ChevronMarkAssembleBProps;
  'chevron-mark-assemble-c': ChevronMarkAssembleCProps;
  'dot-ring-logo-reveal-a': DotRingLogoRevealAProps;
  'dot-ring-logo-reveal-b': DotRingLogoRevealBProps;
  'dot-ring-logo-reveal-c': DotRingLogoRevealCProps;
}

export type ClipId = keyof ClipPropsMap;

export type ClipProps<Id extends ClipId = ClipId> = ClipPropsMap[Id];
