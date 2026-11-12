import type { ClipModule } from '../../registry';
import { appIconRevealDefaults, appIconRevealMeta, appIconRevealSchema } from './app-icon-reveal';
import { appIconRevealControls } from './app-icon-reveal-controls';
import {
  arcBurstWordmarkDefaults,
  arcBurstWordmarkMeta,
  arcBurstWordmarkSchema,
} from './arc-burst-wordmark';
import { arcBurstWordmarkControls } from './arc-burst-wordmark-controls';
import { brandRevealDefaults, brandRevealMeta, brandRevealSchema } from './brand-reveal';
import { brandRevealControls } from './brand-reveal-controls';
import {
  chevronMarkAssembleDefaults,
  chevronMarkAssembleMeta,
  chevronMarkAssembleSchema,
} from './chevron-mark-assemble';
import { chevronMarkAssembleControls } from './chevron-mark-assemble-controls';
import { ctaEndCardDefaults, ctaEndCardMeta, ctaEndCardSchema } from './cta-end-card';
import { ctaEndCardControls } from './cta-end-card-controls';
import {
  dotMorphWordmarkDefaults,
  dotMorphWordmarkMeta,
  dotMorphWordmarkSchema,
} from './dot-morph-wordmark';
import { dotMorphWordmarkControls } from './dot-morph-wordmark-controls';
import {
  dotRingLogoRevealDefaults,
  dotRingLogoRevealMeta,
  dotRingLogoRevealSchema,
} from './dot-ring-logo-reveal';
import { dotRingLogoRevealControls } from './dot-ring-logo-reveal-controls';
import {
  dotWordmarkRevealDefaults,
  dotWordmarkRevealMeta,
  dotWordmarkRevealSchema,
} from './dot-wordmark-reveal';
import { dotWordmarkRevealControls } from './dot-wordmark-reveal-controls';

export const brandClips: ClipModule[] = [
  {
    id: 'app-icon-reveal',
    schema: appIconRevealSchema,
    defaults: appIconRevealDefaults,
    meta: appIconRevealMeta,
    controls: appIconRevealControls,
  },
  {
    id: 'arc-burst-wordmark',
    schema: arcBurstWordmarkSchema,
    defaults: arcBurstWordmarkDefaults,
    meta: arcBurstWordmarkMeta,
    controls: arcBurstWordmarkControls,
  },
  {
    id: 'brand-reveal',
    schema: brandRevealSchema,
    defaults: brandRevealDefaults,
    meta: brandRevealMeta,
    controls: brandRevealControls,
  },
  {
    id: 'chevron-mark-assemble',
    schema: chevronMarkAssembleSchema,
    defaults: chevronMarkAssembleDefaults,
    meta: chevronMarkAssembleMeta,
    controls: chevronMarkAssembleControls,
  },
  {
    id: 'cta-end-card',
    schema: ctaEndCardSchema,
    defaults: ctaEndCardDefaults,
    meta: ctaEndCardMeta,
    controls: ctaEndCardControls,
  },
  {
    id: 'dot-morph-wordmark',
    schema: dotMorphWordmarkSchema,
    defaults: dotMorphWordmarkDefaults,
    meta: dotMorphWordmarkMeta,
    controls: dotMorphWordmarkControls,
  },
  {
    id: 'dot-ring-logo-reveal',
    schema: dotRingLogoRevealSchema,
    defaults: dotRingLogoRevealDefaults,
    meta: dotRingLogoRevealMeta,
    controls: dotRingLogoRevealControls,
  },
  {
    id: 'dot-wordmark-reveal',
    schema: dotWordmarkRevealSchema,
    defaults: dotWordmarkRevealDefaults,
    meta: dotWordmarkRevealMeta,
    controls: dotWordmarkRevealControls,
  },
];
