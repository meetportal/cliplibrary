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
import type { ComingSoonFlipsAProps } from './clips/kinetic-type/coming-soon-flips-a';
import type { ComingSoonFlipsBProps } from './clips/kinetic-type/coming-soon-flips-b';
import type { ComingSoonFlipsCProps } from './clips/kinetic-type/coming-soon-flips-c';
import type { TextRingsAProps } from './clips/kinetic-type/text-rings-a';
import type { TextRingsBProps } from './clips/kinetic-type/text-rings-b';
import type { TextRingsCProps } from './clips/kinetic-type/text-rings-c';
import type { NeonSignFlickerAProps } from './clips/text-reveals/neon-sign-flicker-a';
import type { NeonSignFlickerBProps } from './clips/text-reveals/neon-sign-flicker-b';
import type { NeonSignFlickerCProps } from './clips/text-reveals/neon-sign-flicker-c';

export interface ClipPropsMap {
  'arc-burst-wordmark-a': ArcBurstWordmarkAProps;
  'arc-burst-wordmark-b': ArcBurstWordmarkBProps;
  'arc-burst-wordmark-c': ArcBurstWordmarkCProps;
  'chevron-mark-assemble-a': ChevronMarkAssembleAProps;
  'chevron-mark-assemble-b': ChevronMarkAssembleBProps;
  'chevron-mark-assemble-c': ChevronMarkAssembleCProps;
  'coming-soon-flips-a': ComingSoonFlipsAProps;
  'coming-soon-flips-b': ComingSoonFlipsBProps;
  'coming-soon-flips-c': ComingSoonFlipsCProps;
  'dot-morph-wordmark-a': DotMorphWordmarkAProps;
  'dot-morph-wordmark-b': DotMorphWordmarkBProps;
  'dot-morph-wordmark-c': DotMorphWordmarkCProps;
  'dot-ring-logo-reveal-a': DotRingLogoRevealAProps;
  'dot-ring-logo-reveal-b': DotRingLogoRevealBProps;
  'dot-ring-logo-reveal-c': DotRingLogoRevealCProps;
  'neon-sign-flicker-a': NeonSignFlickerAProps;
  'neon-sign-flicker-b': NeonSignFlickerBProps;
  'neon-sign-flicker-c': NeonSignFlickerCProps;
  'text-rings-a': TextRingsAProps;
  'text-rings-b': TextRingsBProps;
  'text-rings-c': TextRingsCProps;
}

export type ClipId = keyof ClipPropsMap;

export type ClipProps<Id extends ClipId = ClipId> = ClipPropsMap[Id];
