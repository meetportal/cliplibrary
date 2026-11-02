import { describe, expect, it } from 'bun:test';
import { describePath } from '@/agent/describe-path';
import { applyEdits } from '@/agent/edits';
import { mediaInstructions } from '@/agent/instructions';
import { checkMedia } from '@/agent/media';
import { MUSIC_PRESETS } from '@/music';

const song = MUSIC_PRESETS[0]?.song;

describe('music media', () => {
  it('accepts a valid song and rejects a broken one', () => {
    expect(checkMedia('music', song).ok).toBe(true);
    expect(checkMedia('music', { ...song, tempo: 400 }).ok).toBe(false);
  });

  it('applies a score edit and validates it', () => {
    const result = applyEdits('music', song, [
      { op: 'replace', path: '/tempo', value: 124 },
      { op: 'add', path: '/melody/notes/-', value: { step: 62, pitch: 0, length: 2 } },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.tempo).toBe(124);
      expect(result.document.melody.notes.at(-1)).toEqual({ step: 62, pitch: 0, length: 2 });
    }
    const broken = applyEdits('music', song, [
      { op: 'replace', path: '/drums/kick', value: 'x...' },
    ]);
    expect(broken.ok).toBe(false);
  });

  it('labels changed paths with the studio controls', () => {
    expect(describePath('music', song, '/tempo')).toEqual({
      scope: 'Song',
      section: null,
      field: 'Tempo (BPM)',
    });
    expect(describePath('music', song, '/chords/progression/2/degree')).toEqual({
      scope: 'Song',
      section: 'Chords',
      field: 'Progression 3 › Degree',
    });
    expect(describePath('music', song, '/melody/notes/4')).toEqual({
      scope: 'Song',
      section: 'Melody',
      field: 'Note 5',
    });
  });

  it('explains the score to the model', () => {
    const prompt = mediaInstructions({
      kind: 'music',
      title: 'Lofi Sunset',
      document: song,
      focus: [],
      chatTitle: null,
    });
    expect(prompt).toContain('composing agent for the song "Lofi Sunset"');
    expect(prompt).toContain('Melody notes: /melody/notes');
    expect(prompt).toContain('Tempo (BPM): /tempo');
  });
});
