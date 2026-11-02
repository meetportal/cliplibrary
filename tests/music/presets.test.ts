import { describe, expect, it } from 'bun:test';
import { auditClipControls, resolveClipControls } from '@/core/clip-controls';
import {
  findMusicPreset,
  MUSIC_PRESETS,
  songControls,
  songRenderPrompt,
  songSchema,
} from '@/music';

describe('music presets', () => {
  it('have unique ids', () => {
    const ids = MUSIC_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(findMusicPreset('lofi-sunset')?.title).toBe('Lofi Sunset');
    expect(findMusicPreset('missing')).toBeUndefined();
  });

  it.each(MUSIC_PRESETS.map((preset) => [preset.id, preset] as const))(
    '%s satisfies the song schema',
    (_id, preset) => {
      expect(songSchema.safeParse(preset.song).success).toBe(true);
    },
  );

  it('places every song path exactly once', () => {
    expect(auditClipControls(songSchema, songControls)).toEqual({
      missing: [],
      repeated: [],
      unknown: [],
      repeatedTitles: [],
    });
    expect(resolveClipControls(songSchema, songControls).length).toBeGreaterThan(0);
  });
});

describe('songRenderPrompt', () => {
  const song = MUSIC_PRESETS[0]?.song;

  it('describes the score for an instrumental clip', () => {
    if (song === undefined) {
      throw new Error('missing preset');
    }
    const prompt = songRenderPrompt(song, 'clip');
    expect(prompt).toContain('Instrumental track, no vocals.');
    expect(prompt).toContain('82 BPM, key of A minor.');
    expect(prompt).toContain('Chord progression: Am - F - C - G.');
    expect(prompt).toContain('A seamless 30 second loop.');
  });

  it('adds lyrics and drops muted parts for a full song', () => {
    if (song === undefined) {
      throw new Error('missing preset');
    }
    const prompt = songRenderPrompt(
      { ...song, lyrics: 'Golden hour', drums: { ...song.drums, enabled: false } },
      'song',
    );
    expect(prompt).toContain('Song with sung vocals.');
    expect(prompt).toContain('Lyrics:\nGolden hour');
    expect(prompt).not.toContain('lofi drums');
    expect(prompt).toContain('complete song');
  });
});
