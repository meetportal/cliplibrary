import type { DrumVoice, Song } from '@/music';
import type { Voice } from './instruments';

type Tone = typeof import('tone');
type Input = import('tone').InputNode;

interface KitSpec {
  kick: { pitch: number; decay: number; octaves: number };
  snare: { noise: 'white' | 'pink' | 'brown'; decay: number; tone: number };
  hat: { decay: number; frequency: number; level: number };
}

const KITS: Record<Song['drums']['kit'], KitSpec> = {
  '808': {
    kick: { pitch: 31, decay: 0.7, octaves: 6 },
    snare: { noise: 'white', decay: 0.18, tone: 5000 },
    hat: { decay: 0.05, frequency: 320, level: -10 },
  },
  lofi: {
    kick: { pitch: 36, decay: 0.35, octaves: 4 },
    snare: { noise: 'pink', decay: 0.16, tone: 2600 },
    hat: { decay: 0.035, frequency: 260, level: -16 },
  },
  electro: {
    kick: { pitch: 33, decay: 0.45, octaves: 7 },
    snare: { noise: 'white', decay: 0.12, tone: 7000 },
    hat: { decay: 0.03, frequency: 380, level: -10 },
  },
  brush: {
    kick: { pitch: 38, decay: 0.3, octaves: 3 },
    snare: { noise: 'brown', decay: 0.28, tone: 1800 },
    hat: { decay: 0.08, frequency: 220, level: -20 },
  },
};

export const drumVoices = (
  tone: Tone,
  output: Input,
  drums: Song['drums'],
): Record<DrumVoice, Voice> => {
  const kit = KITS[drums.kit];
  const level = new tone.Volume(drums.volume);
  level.connect(output);

  const kick = new tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: kit.kick.octaves,
    envelope: { attack: 0.001, decay: kit.kick.decay, sustain: 0, release: 0.1 },
  });
  kick.connect(level);

  const snareFilter = new tone.Filter(kit.snare.tone, 'lowpass');
  snareFilter.connect(level);
  const snare = new tone.NoiseSynth({
    noise: { type: kit.snare.noise },
    envelope: { attack: 0.001, decay: kit.snare.decay, sustain: 0, release: 0.05 },
  });
  snare.volume.value = -6;
  snare.connect(snareFilter);

  const hat = new tone.MetalSynth({
    envelope: { attack: 0.001, decay: kit.hat.decay, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  });
  hat.frequency.value = kit.hat.frequency;
  hat.volume.value = kit.hat.level - 12;
  hat.connect(level);

  return {
    kick: {
      play: (_midi, duration, time, velocity) =>
        kick.triggerAttackRelease(
          tone.Frequency(kit.kick.pitch, 'midi').toFrequency(),
          duration,
          time,
          velocity,
        ),
      dispose: () => {
        kick.dispose();
        level.dispose();
      },
    },
    snare: {
      play: (_midi, duration, time, velocity) =>
        snare.triggerAttackRelease(duration, time, velocity),
      dispose: () => {
        snare.dispose();
        snareFilter.dispose();
      },
    },
    hat: {
      play: (_midi, duration, time, velocity) => hat.triggerAttackRelease(duration, time, velocity),
      dispose: () => hat.dispose(),
    },
  };
};
