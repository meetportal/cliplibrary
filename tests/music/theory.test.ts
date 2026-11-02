import { describe, expect, it } from 'bun:test';
import { chordMidi, chordName, scaleMidi } from '@/music';

describe('music theory', () => {
  it('maps scale steps to midi notes across octaves', () => {
    expect(scaleMidi('C', 'major', 4, 0)).toBe(60);
    expect(scaleMidi('C', 'major', 4, 2)).toBe(64);
    expect(scaleMidi('C', 'major', 4, 7)).toBe(72);
    expect(scaleMidi('C', 'major', 4, -1)).toBe(59);
    expect(scaleMidi('A', 'minor', 3, 0)).toBe(57);
    expect(scaleMidi('E', 'minor-pentatonic', 4, 5)).toBe(76);
  });

  it('stacks thirds inside the scale', () => {
    expect(chordMidi({ key: 'C', scale: 'major' }, 1, 4, 'triad')).toEqual([60, 64, 67]);
    expect(chordMidi({ key: 'C', scale: 'major' }, 5, 4, 'seventh')).toEqual([67, 71, 74, 77]);
  });

  it('names diatonic chords', () => {
    const song = { key: 'A', scale: 'minor' } as const;
    expect([1, 6, 3, 7, 2].map((degree) => chordName(song, degree))).toEqual([
      'Am',
      'F',
      'C',
      'G',
      'Bdim',
    ]);
    expect(chordName({ key: 'C', scale: 'major-pentatonic' }, 6)).toBe('Am');
    expect([1, 6, 7].map((degree) => chordName({ key: 'D', scale: 'minor' }, degree))).toEqual([
      'Dm',
      'Bb',
      'C',
    ]);
    expect(chordName({ key: 'E', scale: 'major' }, 3)).toBe('G#m');
  });
});
