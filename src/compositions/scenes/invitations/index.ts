import type { SceneModule } from '../../scene-module';
import { botanicalSaveTheDateScene } from './botanical-save-the-date';
import { miniaturePanoramaScene } from './miniature-panorama';
import { weddingItineraryPagesScene } from './wedding-itinerary-pages';

export const invitationsScenes: SceneModule[] = [
  botanicalSaveTheDateScene,
  miniaturePanoramaScene,
  weddingItineraryPagesScene,
];
