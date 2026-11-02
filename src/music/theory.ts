import { NOTE_NAMES, type Song } from './song';

type Scale = Song['scale'];
type Voicing = Song['chords']['voicing'];

const SCALE_STEPS: Record<Scale, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10],
};

const CHORD_SCALE: Record<Scale, Scale> = {
  ...(Object.fromEntries(Object.keys(SCALE_STEPS).map((scale) => [scale, scale])) as Record<
    Scale,
    Scale
  >),
  'major-pentatonic': 'major',
  'minor-pentatonic': 'minor',
};

const VOICING_STEPS: Record<Voicing, readonly number[]> = {
  triad: [0, 2, 4],
  seventh: [0, 2, 4, 6],
  sus2: [0, 1, 4],
};

const modulo = (value: number, size: number): number => ((value % size) + size) % size;

const keyIndex = (key: Song['key']): number => NOTE_NAMES.indexOf(key);

export const scaleMidi = (key: Song['key'], scale: Scale, octave: number, step: number): number => {
  const steps = SCALE_STEPS[scale];
  const offset = steps[modulo(step, steps.length)] ?? 0;
  return 12 * (octave + 1) + keyIndex(key) + 12 * Math.floor(step / steps.length) + offset;
};

export const chordMidi = (
  song: Pick<Song, 'key' | 'scale'>,
  degree: number,
  octave: number,
  voicing: Voicing,
): number[] =>
  VOICING_STEPS[voicing].map((step) =>
    scaleMidi(song.key, CHORD_SCALE[song.scale], octave, degree - 1 + step),
  );

export const chordRootMidi = (
  song: Pick<Song, 'key' | 'scale'>,
  degree: number,
  octave: number,
): number => scaleMidi(song.key, CHORD_SCALE[song.scale], octave, degree - 1);

const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

const RELATIVE_MAJOR: Record<Scale, number> = {
  major: 0,
  minor: 3,
  dorian: 10,
  mixolydian: 5,
  lydian: 7,
  phrygian: 8,
  'harmonic-minor': 3,
  'major-pentatonic': 0,
  'minor-pentatonic': 3,
};

const FLAT_MAJORS = new Set([1, 3, 5, 6, 8, 10]);

export const spellsWithFlats = (song: Pick<Song, 'key' | 'scale'>): boolean =>
  FLAT_MAJORS.has(modulo(keyIndex(song.key) + RELATIVE_MAJOR[song.scale], 12));

export const noteName = (midi: number, flats = false): string =>
  (flats ? FLAT_NAMES : NOTE_NAMES)[modulo(midi, 12)] ?? 'C';

const QUALITY: Record<string, string> = {
  '4,7': '',
  '3,7': 'm',
  '3,6': 'dim',
  '4,8': 'aug',
};

export const chordName = (song: Pick<Song, 'key' | 'scale'>, degree: number): string => {
  const [root = 0, third = 0, fifth = 0] = chordMidi(song, degree, 4, 'triad');
  return `${noteName(root, spellsWithFlats(song))}${QUALITY[`${third - root},${fifth - root}`] ?? ''}`;
};

export const melodyMidi = (song: Song, pitch: number): number =>
  scaleMidi(song.key, song.scale, song.melody.octave, pitch);

export const scaleLength = (scale: Scale): number => SCALE_STEPS[scale].length;
