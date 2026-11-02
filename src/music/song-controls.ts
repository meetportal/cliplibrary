import { defineControls } from '@/schemas/control-layout';
import type { Song } from './song';

export const songControls = defineControls<Song>({
  sections: [
    {
      title: 'Song',
      fields: [
        'title',
        { path: 'tempo', label: 'Tempo (BPM)' },
        { path: 'key', label: 'Key' },
        {
          path: 'scale',
          label: 'Scale',
          hint: 'Minor and dorian feel moody, major and lydian feel bright',
        },
      ],
      more: [
        {
          path: 'swing',
          label: 'Swing',
          hint: 'Delays every other sixteenth for a laid-back groove',
        },
        { path: 'bars', label: 'Loop length (bars)' },
        { path: 'repeats', label: 'Loops on export' },
      ],
    },
    {
      title: 'Chords',
      fields: [
        {
          path: 'chords.progression',
          label: 'Progression',
          hint: 'Scale degrees, 1 is the home chord',
        },
        { path: 'chords.sound', label: 'Sound' },
        { path: 'chords.rhythm', label: 'Rhythm' },
        { path: 'chords.volume', label: 'Volume' },
      ],
      more: [
        { path: 'chords.enabled', label: 'Play chords' },
        { path: 'chords.voicing', label: 'Voicing' },
        { path: 'chords.octave', label: 'Octave' },
      ],
    },
    {
      title: 'Melody',
      fields: [
        { path: 'melody.sound', label: 'Sound' },
        { path: 'melody.octave', label: 'Octave' },
        { path: 'melody.volume', label: 'Volume' },
      ],
      more: [{ path: 'melody.enabled', label: 'Play melody' }],
    },
    {
      title: 'Bass',
      fields: [
        { path: 'bass.pattern', label: 'Pattern' },
        { path: 'bass.sound', label: 'Sound' },
        { path: 'bass.volume', label: 'Volume' },
      ],
      more: [
        { path: 'bass.enabled', label: 'Play bass' },
        { path: 'bass.octave', label: 'Octave' },
      ],
    },
    {
      title: 'Drums',
      fields: [
        { path: 'drums.kit', label: 'Kit' },
        { path: 'drums.volume', label: 'Volume' },
      ],
      more: [
        { path: 'drums.enabled', label: 'Play drums' },
        { path: 'drums.kick', label: 'Kick steps', hint: 'x is a hit, . is a rest' },
        { path: 'drums.snare', label: 'Snare steps' },
        { path: 'drums.hat', label: 'Hi-hat steps' },
      ],
    },
    {
      title: 'Mix',
      fields: [
        { path: 'mix.reverb', label: 'Reverb' },
        { path: 'mix.echo', label: 'Melody echo' },
        { path: 'mix.warmth', label: 'Warmth', hint: 'Rolls off the highs' },
        { path: 'mix.master', label: 'Master volume' },
      ],
    },
    {
      title: 'AI audio render',
      fields: [
        {
          path: 'style',
          label: 'Style prompt',
          hint: 'Genre, mood and instruments for the AI render',
        },
        { path: 'lyrics', label: 'Lyrics', hint: 'Leave empty for an instrumental' },
      ],
    },
  ],
  hidden: ['melody.notes'],
});
