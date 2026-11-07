import type { ArcBurstWordmarkAProps } from './clips/brand/arc-burst-wordmark-a';
import type { ArcBurstWordmarkBProps } from './clips/brand/arc-burst-wordmark-b';
import type { ArcBurstWordmarkCProps } from './clips/brand/arc-burst-wordmark-c';
import type { ChevronMarkAssembleAProps } from './clips/brand/chevron-mark-assemble-a';
import type { ChevronMarkAssembleBProps } from './clips/brand/chevron-mark-assemble-b';
import type { ChevronMarkAssembleCProps } from './clips/brand/chevron-mark-assemble-c';
import type { DotMorphWordmarkAProps } from './clips/brand/dot-morph-wordmark-a';
import type { DotMorphWordmarkBProps } from './clips/brand/dot-morph-wordmark-b';
import type { DotMorphWordmarkCProps } from './clips/brand/dot-morph-wordmark-c';
import type { DotRingLogoRevealAProps } from './clips/brand/dot-ring-logo-reveal-a';
import type { DotRingLogoRevealBProps } from './clips/brand/dot-ring-logo-reveal-b';
import type { DotRingLogoRevealCProps } from './clips/brand/dot-ring-logo-reveal-c';

export interface ClipPropsMap {
  'arc-burst-wordmark-a': ArcBurstWordmarkAProps;
  'arc-burst-wordmark-b': ArcBurstWordmarkBProps;
  'arc-burst-wordmark-c': ArcBurstWordmarkCProps;
  'chevron-mark-assemble-a': ChevronMarkAssembleAProps;
  'chevron-mark-assemble-b': ChevronMarkAssembleBProps;
  'chevron-mark-assemble-c': ChevronMarkAssembleCProps;
  'dot-morph-wordmark-a': DotMorphWordmarkAProps;
  'dot-morph-wordmark-b': DotMorphWordmarkBProps;
  'dot-morph-wordmark-c': DotMorphWordmarkCProps;
  'dot-ring-logo-reveal-a': DotRingLogoRevealAProps;
  'dot-ring-logo-reveal-b': DotRingLogoRevealBProps;
  'dot-ring-logo-reveal-c': DotRingLogoRevealCProps;
}

export type ClipId = keyof ClipPropsMap;

export type ClipProps<Id extends ClipId = ClipId> = ClipPropsMap[Id];
