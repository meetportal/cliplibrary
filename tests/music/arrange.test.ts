import { describe, expect, it } from 'bun:test';
import {
  arrangeSong,
  chordDegreeAtBar,
  loopSeconds,
  MUSIC_PRESETS,
  type Song,
  songSeconds,
} from '@/music';

const lofi = MUSIC_PRESETS[0]?.song as Song;

describe('arrangeSong', () => {
  it('times a loop from tempo and bars', () => {
    expect(loopSeconds({ tempo: 120, bars: 4 })).toBe(8);
    expect(songSeconds({ tempo: 120, bars: 4, repeats: 3 })).toBe(24);
  });

  it('cycles the progression across bars', () => {
    const song: Song = {
      ...lofi,
      chords: {
        ...lofi.chords,
        progression: [
          { degree: 1, bars: 2 },
          { degree: 4, bars: 1 },
        ],
      },
    };
    expect([0, 1, 2, 3, 4].map((bar) => chordDegreeAtBar(song, bar))).toEqual([1, 1, 4, 1, 1]);
  });

  it('plays every drum hit once per bar and loop', () => {
    const song: Song = { ...lofi, bars: 2, swing: 0 };
    const kicks = arrangeSong(song, 2).filter((event) => event.part === 'kick');
    const perBar = [...song.drums.kick].filter((step) => step === 'x').length;
    expect(kicks).toHaveLength(perBar * 2 * 2);
  });

  it('skips muted parts and melody notes past the loop', () => {
    const song: Song = {
      ...lofi,
      bars: 1,
      drums: { ...lofi.drums, enabled: false },
      melody: {
        ...lofi.melody,
        notes: [
          { step: 4, pitch: 0, length: 40 },
          { step: 20, pitch: 1, length: 2 },
        ],
      },
    };
    const events = arrangeSong(song);
    expect(events.some((event) => event.part === 'kick')).toBe(false);
    const melody = events.filter((event) => event.part === 'melody');
    expect(melody).toHaveLength(1);
    expect(melody[0]?.duration).toBeCloseTo(12 * (60 / song.tempo / 4) * 0.95);
  });

  it('swings the off sixteenths', () => {
    const song: Song = { ...lofi, swing: 0.5, tempo: 60 };
    const hats = arrangeSong({ ...song, drums: { ...song.drums, hat: 'xx..............' } }).filter(
      (event) => event.part === 'hat',
    );
    expect(hats.slice(0, 2).map((event) => event.time)).toEqual([0, 0.3125]);
  });

  it('returns events in time order', () => {
    const times = arrangeSong(lofi, 2).map((event) => event.time);
    expect(times).toEqual([...times].sort((left, right) => left - right));
  });
});
