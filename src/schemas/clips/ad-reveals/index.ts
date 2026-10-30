import type { ClipModule } from '../../registry';
import {
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from './battery-charge-success';
import { batteryChargeSuccessControls } from './battery-charge-success-controls';
import {
  billboardReaderDefaults,
  billboardReaderMeta,
  billboardReaderSchema,
} from './billboard-reader';
import { billboardReaderControls } from './billboard-reader-controls';
import {
  burningPaperRevealDefaults,
  burningPaperRevealMeta,
  burningPaperRevealSchema,
} from './burning-paper-reveal';
import { burningPaperRevealControls } from './burning-paper-reveal-controls';
import {
  crumpledPaperRevealDefaults,
  crumpledPaperRevealMeta,
  crumpledPaperRevealSchema,
} from './crumpled-paper-reveal';
import { crumpledPaperRevealControls } from './crumpled-paper-reveal-controls';
import {
  helicopterUnveilDefaults,
  helicopterUnveilMeta,
  helicopterUnveilSchema,
} from './helicopter-unveil';
import { helicopterUnveilControls } from './helicopter-unveil-controls';
import {
  mailinfraThreadFeaturesDefaults,
  mailinfraThreadFeaturesMeta,
  mailinfraThreadFeaturesSchema,
} from './mailinfra-thread-features';
import { mailinfraThreadFeaturesControls } from './mailinfra-thread-features-controls';
import {
  problemStrikeoutDefaults,
  problemStrikeoutMeta,
  problemStrikeoutSchema,
} from './problem-strikeout';
import { problemStrikeoutControls } from './problem-strikeout-controls';
import { spillRevealDefaults, spillRevealMeta, spillRevealSchema } from './spill-reveal';
import { spillRevealControls } from './spill-reveal-controls';

export const adRevealsClips: ClipModule[] = [
  {
    id: 'helicopter-unveil',
    schema: helicopterUnveilSchema,
    defaults: helicopterUnveilDefaults,
    meta: helicopterUnveilMeta,
    controls: helicopterUnveilControls,
  },
  {
    id: 'problem-strikeout',
    schema: problemStrikeoutSchema,
    defaults: problemStrikeoutDefaults,
    meta: problemStrikeoutMeta,
    controls: problemStrikeoutControls,
  },
  {
    id: 'spill-reveal',
    schema: spillRevealSchema,
    defaults: spillRevealDefaults,
    meta: spillRevealMeta,
    controls: spillRevealControls,
  },
  {
    id: 'crumpled-paper-reveal',
    schema: crumpledPaperRevealSchema,
    defaults: crumpledPaperRevealDefaults,
    meta: crumpledPaperRevealMeta,
    controls: crumpledPaperRevealControls,
  },
  {
    id: 'battery-charge-success',
    schema: batteryChargeSuccessSchema,
    defaults: batteryChargeSuccessDefaults,
    meta: batteryChargeSuccessMeta,
    controls: batteryChargeSuccessControls,
  },
  {
    id: 'billboard-reader',
    schema: billboardReaderSchema,
    defaults: billboardReaderDefaults,
    meta: billboardReaderMeta,
    controls: billboardReaderControls,
  },
  {
    id: 'burning-paper-reveal',
    schema: burningPaperRevealSchema,
    defaults: burningPaperRevealDefaults,
    meta: burningPaperRevealMeta,
    controls: burningPaperRevealControls,
  },
  {
    id: 'mailinfra-thread-features',
    schema: mailinfraThreadFeaturesSchema,
    defaults: mailinfraThreadFeaturesDefaults,
    meta: mailinfraThreadFeaturesMeta,
    controls: mailinfraThreadFeaturesControls,
  },
];
