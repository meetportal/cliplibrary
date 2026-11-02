import type { Song } from './song';
import { chordName } from './theory';

export const RENDER_LENGTHS = ['clip', 'song'] as const;

export type RenderLength = (typeof RENDER_LENGTHS)[number];

const SOUND_WORDS: Record<string, string> = {
  'soft-keys': 'soft keys',
  pluck: 'plucked synth',
  bell: 'bells',
  'saw-lead': 'saw synth lead',
  chip: '8-bit square lead',
  flute: 'flute',
  'warm-pad': 'warm synth pad',
  'electric-piano': 'electric piano',
  organ: 'organ',
  strings: 'string section',
  glass: 'glassy keys',
  sub: 'sub bass',
  round: 'round bass',
  acid: 'acid bass',
  fm: 'FM bass',
  '808': '808 drums',
  lofi: 'dusty lofi drums',
  electro: 'electro drums',
  brush: 'brushed drums',
};

const words = (sound: string): string => SOUND_WORDS[sound] ?? sound;

const scaleWords = (scale: Song['scale']): string => scale.replace('-', ' ');

export const songRenderPrompt = (song: Song, length: RenderLength): string => {
  const lyrics = song.lyrics.trim();
  const instruments = [
    song.chords.enabled ? `${words(song.chords.sound)} chords` : null,
    song.melody.enabled ? `${words(song.melody.sound)} melody` : null,
    song.bass.enabled ? words(song.bass.sound) : null,
    song.drums.enabled ? words(song.drums.kit) : null,
  ].filter((part) => part !== null);
  const progression = song.chords.progression
    .map((chord) => chordName(song, chord.degree))
    .join(' - ');
  return [
    lyrics === '' ? 'Instrumental track, no vocals.' : 'Song with sung vocals.',
    song.style.trim(),
    `${song.tempo} BPM, key of ${song.key} ${scaleWords(song.scale)}.`,
    `Chord progression: ${progression}.`,
    instruments.length === 0 ? null : `Instruments: ${instruments.join(', ')}.`,
    length === 'clip'
      ? 'A seamless 30 second loop.'
      : 'A complete song with intro, build and ending.',
    lyrics === '' ? null : `Lyrics:\n${lyrics}`,
  ]
    .filter((line) => line !== null && line !== '')
    .join('\n');
};
