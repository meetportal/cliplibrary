import type { ClipModule } from '../../registry';
import {
  anniversaryKineticDefaults,
  anniversaryKineticMeta,
  anniversaryKineticSchema,
} from './anniversary-kinetic';
import { anniversaryKineticControls } from './anniversary-kinetic-controls';
import {
  brandingIsTickerDefaults,
  brandingIsTickerMeta,
  brandingIsTickerSchema,
} from './branding-is-ticker';
import { brandingIsTickerControls } from './branding-is-ticker-controls';
import {
  chunkyTypeStackDefaults,
  chunkyTypeStackMeta,
  chunkyTypeStackSchema,
} from './chunky-type-stack';
import { chunkyTypeStackControls } from './chunky-type-stack-controls';
import { circlePopDefaults, circlePopMeta, circlePopSchema } from './circle-pop';
import { circlePopControls } from './circle-pop-controls';
import {
  comingSoonFlipsDefaults,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from './coming-soon-flips';
import { comingSoonFlipsControls } from './coming-soon-flips-controls';
import { dominoWordsDefaults, dominoWordsMeta, dominoWordsSchema } from './domino-words';
import { dominoWordsControls } from './domino-words-controls';
import { textRingsDefaults, textRingsMeta, textRingsSchema } from './text-rings';
import { textRingsControls } from './text-rings-controls';

export const kineticTypeClips: ClipModule[] = [
  {
    id: 'anniversary-kinetic',
    schema: anniversaryKineticSchema,
    defaults: anniversaryKineticDefaults,
    meta: anniversaryKineticMeta,
    controls: anniversaryKineticControls,
  },
  {
    id: 'branding-is-ticker',
    schema: brandingIsTickerSchema,
    defaults: brandingIsTickerDefaults,
    meta: brandingIsTickerMeta,
    controls: brandingIsTickerControls,
  },
  {
    id: 'chunky-type-stack',
    schema: chunkyTypeStackSchema,
    defaults: chunkyTypeStackDefaults,
    meta: chunkyTypeStackMeta,
    controls: chunkyTypeStackControls,
  },
  {
    id: 'circle-pop',
    schema: circlePopSchema,
    defaults: circlePopDefaults,
    meta: circlePopMeta,
    controls: circlePopControls,
  },
  {
    id: 'coming-soon-flips',
    schema: comingSoonFlipsSchema,
    defaults: comingSoonFlipsDefaults,
    meta: comingSoonFlipsMeta,
    controls: comingSoonFlipsControls,
  },
  {
    id: 'domino-words',
    schema: dominoWordsSchema,
    defaults: dominoWordsDefaults,
    meta: dominoWordsMeta,
    controls: dominoWordsControls,
  },
  {
    id: 'text-rings',
    schema: textRingsSchema,
    defaults: textRingsDefaults,
    meta: textRingsMeta,
    controls: textRingsControls,
  },
];
