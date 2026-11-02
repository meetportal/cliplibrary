import type { MusicEvent, MusicPart, Song } from '@/music';
import { drumVoices } from './drums';
import { bassVoice, chordVoice, leadVoice, type Voice } from './instruments';

type Tone = typeof import('tone');

export interface Rig {
  play: (event: MusicEvent, time: number) => void;
  meter: import('tone').Analyser;
  dispose: () => void;
}

const warmthCutoff = (warmth: number): number => 18000 * (1 - warmth) ** 2 + 900;

export const rigKey = (song: Song): string =>
  JSON.stringify([
    song.mix,
    song.tempo,
    [song.chords.sound, song.chords.volume],
    [song.melody.sound, song.melody.volume],
    [song.bass.sound, song.bass.volume],
    [song.drums.kit, song.drums.volume],
  ]);

export const buildRig = async (tone: Tone, song: Song): Promise<Rig> => {
  const master = new tone.Volume(song.mix.master).toDestination();
  const meter = new tone.Analyser('fft', 1024);
  master.connect(meter);
  const tone_ = new tone.Filter(warmthCutoff(song.mix.warmth), 'lowpass');
  tone_.connect(master);
  const reverb = new tone.Reverb({ decay: 1.5 + song.mix.reverb * 4, wet: song.mix.reverb * 0.6 });
  reverb.connect(tone_);
  await reverb.ready;
  const echo = new tone.FeedbackDelay({
    delayTime: (60 / song.tempo) * 0.75,
    feedback: 0.25 + song.mix.echo * 0.3,
    wet: song.mix.echo * 0.5,
  });
  echo.connect(reverb);

  const drums = drumVoices(tone, tone_, song.drums);
  const voices: Record<MusicPart, Voice> = {
    chords: chordVoice(tone, reverb, song.chords),
    melody: leadVoice(tone, echo, song.melody),
    bass: bassVoice(tone, tone_, song.bass),
    ...drums,
  };

  return {
    play: (event, time) =>
      voices[event.part].play(event.midi, event.duration, time, event.velocity),
    meter,
    dispose: () => {
      for (const voice of Object.values(voices)) {
        voice.dispose();
      }
      for (const node of [echo, reverb, tone_, meter, master]) {
        node.dispose();
      }
    },
  };
};
