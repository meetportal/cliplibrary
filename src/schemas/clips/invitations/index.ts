import type { ClipModule } from '../../registry';
import {
  weddingItineraryPagesDefaults,
  weddingItineraryPagesMeta,
  weddingItineraryPagesSchema,
} from './wedding-itinerary-pages';
import { weddingItineraryPagesControls } from './wedding-itinerary-pages-controls';

export const invitationsClips: ClipModule[] = [
  {
    id: 'wedding-itinerary-pages',
    schema: weddingItineraryPagesSchema,
    defaults: weddingItineraryPagesDefaults,
    meta: weddingItineraryPagesMeta,
    controls: weddingItineraryPagesControls,
  },
];
