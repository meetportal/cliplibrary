import type { MelodyNote, Song } from '../song';

export interface MusicPreset {
  id: string;
  title: string;
  description: string;
  song: Song;
}

export const phrase = (notes: readonly (readonly [number, number, number])[]): MelodyNote[] =>
  notes.map(([step, pitch, length]) => ({ step, pitch, length }));

export const progression = (chords: readonly (readonly [number, number])[]) =>
  chords.map(([degree, bars]) => ({ degree, bars }));

export const SILENT = '................';
