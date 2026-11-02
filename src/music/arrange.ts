import { DRUM_VOICES, type DrumVoice, type Song, STEPS_PER_BAR } from './song';
import { chordMidi, chordRootMidi, melodyMidi } from './theory';

export type MusicPart = 'chords' | 'melody' | 'bass' | DrumVoice;

export interface MusicEvent {
  part: MusicPart;
  time: number;
  duration: number;
  midi: number[];
  velocity: number;
}

interface StepEvent {
  part: MusicPart;
  step: number;
  length: number;
  midi: number[];
  velocity: number;
}

export const stepSeconds = (song: Pick<Song, 'tempo'>): number => 60 / song.tempo / 4;

export const loopSteps = (song: Pick<Song, 'bars'>): number => song.bars * STEPS_PER_BAR;

export const loopSeconds = (song: Pick<Song, 'tempo' | 'bars'>): number =>
  loopSteps(song) * stepSeconds(song);

export const songSeconds = (song: Pick<Song, 'tempo' | 'bars' | 'repeats'>): number =>
  loopSeconds(song) * song.repeats;

export const chordDegreeAtBar = (song: Song, bar: number): number => {
  const progression = song.chords.progression;
  const total = progression.reduce((sum, chord) => sum + chord.bars, 0);
  let position = bar % total;
  for (const chord of progression) {
    if (position < chord.bars) {
      return chord.degree;
    }
    position -= chord.bars;
  }
  return progression[0]?.degree ?? 1;
};

const barSteps = (bars: number, every: number, offset = 0): number[] =>
  Array.from({ length: (bars * STEPS_PER_BAR) / every }, (_, index) => index * every + offset);

type ChordHit = (step: number, length: number, midi: number[], velocity: number) => StepEvent;

const CHORD_RHYTHMS: Record<
  Song['chords']['rhythm'],
  (notes: number[], hit: ChordHit) => StepEvent[]
> = {
  sustain: (notes, hit) => [hit(0, STEPS_PER_BAR, notes, 0.5)],
  quarters: (notes, hit) => barSteps(1, 4).map((step) => hit(step, 3, notes, 0.6)),
  offbeats: (notes, hit) => barSteps(1, 4, 2).map((step) => hit(step, 2, notes, 0.6)),
  arpeggio: (notes, hit) =>
    barSteps(1, 2).map((step, index) =>
      hit(step, 2, [notes[index % notes.length] ?? notes[0] ?? 60], 0.55),
    ),
};

const chordEvents = (song: Song): StepEvent[] => {
  const { chords } = song;
  return Array.from({ length: song.bars }, (_, bar) => {
    const notes = chordMidi(song, chordDegreeAtBar(song, bar), chords.octave, chords.voicing);
    const start = bar * STEPS_PER_BAR;
    return CHORD_RHYTHMS[chords.rhythm](notes, (step, length, midi, velocity) => ({
      part: 'chords',
      step: start + step,
      length,
      midi,
      velocity,
    }));
  }).flat();
};

const isHit = (pattern: string, step: number): boolean => pattern[step % STEPS_PER_BAR] === 'x';

interface BassBar {
  song: Song;
  degree: number;
  root: number;
  note: (step: number, length: number, midi: number) => StepEvent;
}

const BASS_PATTERNS: Record<Song['bass']['pattern'], (bar: BassBar) => StepEvent[]> = {
  roots: ({ root, note }) => [note(0, STEPS_PER_BAR, root)],
  eighths: ({ root, note }) => barSteps(1, 2).map((step) => note(step, 2, root)),
  octaves: ({ root, note }) =>
    barSteps(1, 2).map((step, index) => note(step, 2, root + (index % 2) * 12)),
  walking: ({ song, degree, note }) =>
    [0, 2, 4, 5].map((offset, index) =>
      note(index * 4, 4, chordRootMidi(song, degree + offset, song.bass.octave)),
    ),
  'kick-locked': ({ song, root, note }) =>
    barSteps(1, 1)
      .filter((step) => isHit(song.drums.kick, step))
      .map((step) => note(step, 2, root)),
};

const bassEvents = (song: Song): StepEvent[] =>
  Array.from({ length: song.bars }, (_, bar) => {
    const degree = chordDegreeAtBar(song, bar);
    const start = bar * STEPS_PER_BAR;
    return BASS_PATTERNS[song.bass.pattern]({
      song,
      degree,
      root: chordRootMidi(song, degree, song.bass.octave),
      note: (step, length, midi) => ({
        part: 'bass',
        step: start + step,
        length,
        midi: [midi],
        velocity: 0.8,
      }),
    });
  }).flat();

const DRUM_VELOCITY: Record<DrumVoice, (step: number) => number> = {
  kick: () => 1,
  snare: () => 0.85,
  hat: (step) => (step % 4 === 0 ? 0.55 : 0.35),
};

const drumEvents = (song: Song): StepEvent[] =>
  DRUM_VOICES.flatMap((voice) =>
    barSteps(song.bars, 1)
      .filter((step) => isHit(song.drums[voice], step))
      .map((step) => ({
        part: voice,
        step,
        length: 1,
        midi: [36],
        velocity: DRUM_VELOCITY[voice](step),
      })),
  );

const melodyEvents = (song: Song): StepEvent[] => {
  const total = loopSteps(song);
  return song.melody.notes
    .filter((note) => note.step < total)
    .map((note) => ({
      part: 'melody',
      step: note.step,
      length: Math.min(note.length, total - note.step),
      midi: [melodyMidi(song, note.pitch)],
      velocity: 0.75,
    }));
};

const loopEvents = (song: Song): StepEvent[] => [
  ...(song.chords.enabled ? chordEvents(song) : []),
  ...(song.bass.enabled ? bassEvents(song) : []),
  ...(song.drums.enabled ? drumEvents(song) : []),
  ...(song.melody.enabled ? melodyEvents(song) : []),
];

export const stepTime = (song: Song, step: number): number =>
  (step + (step % 2 === 1 ? song.swing * 0.5 : 0)) * stepSeconds(song);

export const arrangeSong = (song: Song, loops = 1): MusicEvent[] => {
  const events = loopEvents(song);
  const size = loopSteps(song);
  const seconds = stepSeconds(song);
  return Array.from({ length: loops }, (_, loop) =>
    events.map((event) => ({
      part: event.part,
      time: loop * loopSeconds(song) + stepTime(song, event.step),
      duration: event.length * seconds * 0.95,
      midi: event.midi,
      velocity: event.velocity,
    })),
  )
    .flat()
    .filter((event) => event.time < loops * size * seconds)
    .sort((left, right) => left.time - right.time);
};
