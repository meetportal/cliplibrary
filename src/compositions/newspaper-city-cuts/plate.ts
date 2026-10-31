import track from '@/footage/newspaper-city-cuts.track.json';
import type { FootagePlate } from '../footage/footage-stage';
import { parseTrack } from '../footage/footage-track';

export const CITY_CUTS_PLATE: FootagePlate = {
  src: 'footage/newspaper-city-cuts/plate.mp4',
  track: parseTrack(track),
};
