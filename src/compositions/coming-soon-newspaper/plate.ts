import track from '@/footage/coming-soon-newspaper.track.json';
import type { FootagePlate } from '../footage/footage-stage';
import { parseTrack } from '../footage/footage-track';
import { steadyTrack } from './steady-track';

export const COMING_SOON_PLATE: FootagePlate = {
  src: 'footage/coming-soon-newspaper/plate.mp4',
  track: steadyTrack(parseTrack(track)),
};

const trackedFrames = COMING_SOON_PLATE.track.frames
  .map((frame, index) => (Object.keys(frame.quads).length > 0 ? index : -1))
  .filter((index) => index >= 0);

export const LAST_PRINT_FRAME = Math.max(0, ...trackedFrames);

export const LAST_PLATE_FRAME = COMING_SOON_PLATE.track.frames.length - 1;
