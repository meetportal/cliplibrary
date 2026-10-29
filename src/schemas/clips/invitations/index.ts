import type { ClipModule } from '../../registry';
import {
  botanicalSaveTheDateDefaults,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from './botanical-save-the-date';
import { botanicalSaveTheDateControls } from './botanical-save-the-date-controls';
import {
  miniaturePanoramaDefaults,
  miniaturePanoramaMeta,
  miniaturePanoramaSchema,
} from './miniature-panorama';
import { miniaturePanoramaControls } from './miniature-panorama-controls';
import {
  weddingItineraryPagesDefaults,
  weddingItineraryPagesMeta,
  weddingItineraryPagesSchema,
} from './wedding-itinerary-pages';
import { weddingItineraryPagesControls } from './wedding-itinerary-pages-controls';

export const invitationsClips: ClipModule[] = [
  {
    id: 'botanical-save-the-date',
    schema: botanicalSaveTheDateSchema,
    defaults: botanicalSaveTheDateDefaults,
    meta: botanicalSaveTheDateMeta,
    controls: botanicalSaveTheDateControls,
  },
  {
    id: 'miniature-panorama',
    schema: miniaturePanoramaSchema,
    defaults: miniaturePanoramaDefaults,
    meta: miniaturePanoramaMeta,
    controls: miniaturePanoramaControls,
  },
  {
    id: 'wedding-itinerary-pages',
    schema: weddingItineraryPagesSchema,
    defaults: weddingItineraryPagesDefaults,
    meta: weddingItineraryPagesMeta,
    controls: weddingItineraryPagesControls,
  },
];
