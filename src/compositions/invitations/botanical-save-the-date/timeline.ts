import type { BotanicalSaveTheDateProps } from '@/schemas';
import { smooth, tween } from './motion';
import type { Cue } from './typed-line';

const NEVER = 100000;
const FADE_FRAMES = 18;
const JOINER_DELAY = 9;
const LOGO_FADE = 22;

export type Timeline = {
  verse: (index: number) => Cue;
  saveFade: (frame: number) => number;
  joinerFade: (frame: number) => number;
  date: Cue;
  venue: (index: number) => Cue;
  logoFade: (frame: number) => number;
};

export const buildTimeline = (props: BotanicalSaveTheDateProps): Timeline => {
  const { timing } = props;
  const eraseAt = Math.max(timing.eraseAt, timing.verseAt + timing.typeFrames);
  const saveAt = Math.max(timing.saveAt, timing.verseAt);
  const typed = (start: number): Cue => ({
    start,
    frames: timing.typeFrames,
    eraseAt: NEVER,
    eraseFrames: timing.eraseFrames,
  });
  const fade = (start: number, frames: number) => (frame: number) =>
    tween(frame, [start, start + frames], [0, 1], smooth);
  return {
    verse: (index) => ({
      start: timing.verseAt + index * timing.lineStagger,
      frames: timing.typeFrames,
      eraseAt: eraseAt + index * Math.round(timing.lineStagger / 2),
      eraseFrames: timing.eraseFrames,
    }),
    saveFade: fade(saveAt, FADE_FRAMES),
    joinerFade: fade(saveAt + JOINER_DELAY, FADE_FRAMES),
    date: typed(timing.dateAt),
    venue: (index) => typed(timing.venueAt + index * timing.lineStagger),
    logoFade: fade(timing.logoAt, LOGO_FADE),
  };
};
