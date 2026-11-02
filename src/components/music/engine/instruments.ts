import type { Song } from '@/music';

type Tone = typeof import('tone');

type Input = import('tone').InputNode;

export interface Voice {
  play: (midi: readonly number[], duration: number, time: number, velocity: number) => void;
  dispose: () => void;
}

type SynthOptions = NonNullable<ConstructorParameters<typeof import('tone').Synth>[0]>;
type FmOptions = NonNullable<ConstructorParameters<typeof import('tone').FMSynth>[0]>;
type MonoOptions = NonNullable<ConstructorParameters<typeof import('tone').MonoSynth>[0]>;

const hz = (tone: Tone, midi: number): number => tone.Frequency(midi, 'midi').toFrequency();

const poly = (
  tone: Tone,
  output: Input,
  volume: number,
  options: { fm: FmOptions } | { synth: SynthOptions },
): Voice => {
  const synth =
    'fm' in options
      ? new tone.PolySynth(tone.FMSynth, options.fm)
      : new tone.PolySynth(tone.Synth, options.synth);
  synth.maxPolyphony = 24;
  synth.volume.value = volume;
  synth.connect(output);
  return {
    play: (midi, duration, time, velocity) =>
      synth.triggerAttackRelease(
        midi.map((note) => hz(tone, note)),
        duration,
        time,
        velocity,
      ),
    dispose: () => synth.dispose(),
  };
};

const filtered = (tone: Tone, output: Input, frequency: number): import('tone').Filter => {
  const filter = new tone.Filter(frequency, 'lowpass');
  filter.connect(output);
  return filter;
};

const withNodes = (voice: Voice, nodes: readonly { dispose: () => unknown }[]): Voice => ({
  play: voice.play,
  dispose: () => {
    voice.dispose();
    for (const node of nodes) {
      node.dispose();
    }
  },
});

const env = (attack: number, decay: number, sustain: number, release: number) => ({
  attack,
  decay,
  sustain,
  release,
});

export const chordVoice = (tone: Tone, output: Input, part: Song['chords']): Voice => {
  const volume = part.volume - 6;
  switch (part.sound) {
    case 'warm-pad': {
      const filter = filtered(tone, output, 1400);
      return withNodes(
        poly(tone, filter, volume - 4, {
          synth: {
            oscillator: { type: 'fatsawtooth', count: 3, spread: 28 },
            envelope: env(0.5, 0.4, 0.8, 1.6),
          },
        }),
        [filter],
      );
    }
    case 'strings': {
      const filter = filtered(tone, output, 1000);
      return withNodes(
        poly(tone, filter, volume - 4, {
          synth: {
            oscillator: { type: 'fatsawtooth', count: 4, spread: 18 },
            envelope: env(0.8, 0.5, 0.85, 2.2),
          },
        }),
        [filter],
      );
    }
    case 'electric-piano':
      return poly(tone, output, volume, {
        fm: {
          harmonicity: 3,
          modulationIndex: 1.6,
          envelope: env(0.004, 1.4, 0.25, 1.2),
          modulationEnvelope: env(0.004, 0.6, 0.1, 0.8),
        },
      });
    case 'organ':
      return poly(tone, output, volume - 2, {
        synth: { oscillator: { type: 'sine4' }, envelope: env(0.02, 0.1, 0.9, 0.3) },
      });
    default:
      return poly(tone, output, volume, {
        synth: { oscillator: { type: 'triangle' }, envelope: env(0.004, 0.5, 0.15, 0.8) },
      });
  }
};

export const leadVoice = (tone: Tone, output: Input, part: Song['melody']): Voice => {
  const volume = part.volume - 4;
  switch (part.sound) {
    case 'bell':
      return poly(tone, output, volume, {
        fm: {
          harmonicity: 7.5,
          modulationIndex: 2.2,
          envelope: env(0.001, 1.6, 0, 1.6),
          modulationEnvelope: env(0.001, 0.9, 0, 0.9),
        },
      });
    case 'saw-lead': {
      const filter = filtered(tone, output, 3200);
      return withNodes(
        poly(tone, filter, volume - 4, {
          synth: {
            oscillator: { type: 'fatsawtooth', count: 2, spread: 16 },
            envelope: env(0.02, 0.2, 0.7, 0.4),
          },
        }),
        [filter],
      );
    }
    case 'chip':
      return poly(tone, output, volume - 6, {
        synth: { oscillator: { type: 'square' }, envelope: env(0.001, 0.1, 0.5, 0.05) },
      });
    case 'pluck':
      return poly(tone, output, volume, {
        synth: { oscillator: { type: 'triangle8' }, envelope: env(0.002, 0.25, 0, 0.3) },
      });
    case 'flute':
      return poly(tone, output, volume, {
        synth: { oscillator: { type: 'sine2' }, envelope: env(0.09, 0.2, 0.8, 0.5) },
      });
    default:
      return poly(tone, output, volume, {
        synth: { oscillator: { type: 'triangle' }, envelope: env(0.01, 0.4, 0.35, 0.9) },
      });
  }
};

const BASS_OPTIONS: Record<Song['bass']['sound'], MonoOptions> = {
  sub: {
    oscillator: { type: 'sine' },
    envelope: env(0.01, 0.3, 0.9, 0.2),
    filterEnvelope: { baseFrequency: 300, octaves: 1 },
  },
  round: {
    oscillator: { type: 'triangle' },
    envelope: env(0.005, 0.3, 0.6, 0.2),
    filterEnvelope: { baseFrequency: 220, octaves: 2.5, decay: 0.2, sustain: 0.3 },
  },
  acid: {
    oscillator: { type: 'sawtooth' },
    filter: { Q: 7 },
    envelope: env(0.003, 0.2, 0.5, 0.1),
    filterEnvelope: { baseFrequency: 160, octaves: 3.5, decay: 0.18, sustain: 0.15 },
  },
  fm: {
    oscillator: { type: 'fmsquare', modulationIndex: 2 },
    envelope: env(0.003, 0.2, 0.6, 0.1),
    filterEnvelope: { baseFrequency: 260, octaves: 2.5, decay: 0.15, sustain: 0.4 },
  },
};

export const bassVoice = (tone: Tone, output: Input, part: Song['bass']): Voice => {
  const synth = new tone.MonoSynth(BASS_OPTIONS[part.sound]);
  synth.volume.value = part.volume - 2;
  synth.connect(output);
  return {
    play: (midi, duration, time, velocity) =>
      synth.triggerAttackRelease(hz(tone, midi[0] ?? 36), duration, time, velocity),
    dispose: () => synth.dispose(),
  };
};
