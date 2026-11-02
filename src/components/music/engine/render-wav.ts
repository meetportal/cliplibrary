import toWav from 'audiobuffer-to-wav';
import { arrangeSong, type Song, songSeconds } from '@/music';
import { buildRig } from './rig';

const TAIL_SECONDS = 2.5;

export const renderSongWav = async (song: Song): Promise<Blob> => {
  const tone = await import('tone');
  const buffer = await tone.Offline(
    async (context) => {
      const rig = await buildRig(tone, song);
      for (const event of arrangeSong(song, song.repeats)) {
        context.transport.schedule((time) => rig.play(event, time), event.time);
      }
      context.transport.start(0);
    },
    songSeconds(song) + TAIL_SECONDS,
    2,
    44100,
  );
  const audio = buffer.get();
  if (audio === undefined) {
    throw new Error('The offline render produced no audio.');
  }
  return new Blob([toWav(audio)], { type: 'audio/wav' });
};
