import type { ClipModule } from '../../registry';
import { filmDustDefaults, filmDustMeta, filmDustSchema } from './film-dust';
import { filmDustControls } from './film-dust-controls';
import { floatingCardsDefaults, floatingCardsMeta, floatingCardsSchema } from './floating-cards';
import { floatingCardsControls } from './floating-cards-controls';

export const overlaysClips: ClipModule[] = [
  {
    id: 'film-dust',
    schema: filmDustSchema,
    defaults: filmDustDefaults,
    meta: filmDustMeta,
    controls: filmDustControls,
  },
  {
    id: 'floating-cards',
    schema: floatingCardsSchema,
    defaults: floatingCardsDefaults,
    meta: floatingCardsMeta,
    controls: floatingCardsControls,
  },
];
