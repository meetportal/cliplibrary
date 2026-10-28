import { describe, expect, it } from 'bun:test';
import { describePath, readPointer, selectionNames } from '@/agent/describe-path';
import { buildAgentContext } from '@/agent/trace';
import { seedProjectForClip } from '@/core';
import { findPoster } from '@/posters';

const clip = seedProjectForClip('word-build');
const poster = findPoster('amber-client-reviews-01')?.build();

if (poster === undefined) {
  throw new Error('missing poster fixture');
}

const clipElementId = clip.tracks[0]?.elements[0]?.id ?? '';

describe('describePath', () => {
  it('names the clip control a prop path belongs to', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/text')).toEqual({
      scope: 'Word Build',
      section: 'Text',
      field: 'Line',
    });
  });

  it('prefers a dedicated control over a linked one', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/bigColor').field).toBe(
      'Big word color',
    );
  });

  it('names the colour role when a path leads a role', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/look/background')).toEqual({
      scope: 'Word Build',
      section: 'Colors',
      field: 'Background color',
    });
  });

  it('names poster theme controls and list items', () => {
    expect(describePath('poster', poster, '/controls/1/value')).toEqual({
      scope: 'Theme',
      section: 'Colors',
      field: 'Primary color',
    });
    expect(describePath('poster', poster, '/controls/8/values/0')).toEqual({
      scope: 'Theme',
      section: 'Copy',
      field: 'Reviewer 1',
    });
  });

  it('falls back to readable keys outside the control layout', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/transform/x')).toEqual({
      scope: 'Composition element',
      section: null,
      field: 'Transform › X',
    });
    expect(describePath('clip', clip, '/durationInFrames').scope).toBe('Project');
  });

  it('names poster elements, the background, the title and new elements', () => {
    expect(describePath('poster', poster, '/elements/0/fontFamily')).toEqual({
      scope: 'CLIENT',
      section: 'Text',
      field: 'Font family',
    });
    expect(describePath('poster', poster, '/elements/5/fill')).toEqual({
      scope: 'Star',
      section: null,
      field: 'Fill',
    });
    expect(describePath('poster', poster, '/background').field).toBe('Background');
    expect(describePath('poster', poster, '/title').field).toBe('Title');
    expect(describePath('poster', poster, '/elements/-').scope).toBe('New element');
  });
});

describe('readPointer', () => {
  it('reads existing values and tolerates missing ones', () => {
    expect(readPointer(poster, '/title')).toBe(poster.title);
    expect(readPointer(poster, '/elements/999/fill')).toBeUndefined();
  });
});

describe('selectionNames', () => {
  it('lists selected clip and poster elements by name', () => {
    expect(selectionNames('clip', clip, [clipElementId])).toEqual(['Word Build']);
    expect(selectionNames('poster', poster, [poster.elements[0]?.id ?? ''])).toEqual(['CLIENT']);
    expect(selectionNames('poster', poster, [])).toEqual([]);
  });
});

describe('buildAgentContext', () => {
  it('summarises a clip with its timing and mapped controls', () => {
    const context = buildAgentContext({
      kind: 'clip',
      title: 'Word Build',
      document: clip,
      masked: clip,
      focus: [clipElementId],
      assets: 0,
      history: 1,
      instructions: 'prompt',
      model: 'primary',
      fallbackModel: 'fallback',
    });
    expect(context.timing).toContain('fps');
    expect(context.controls).toBeGreaterThan(10);
    expect(context.selection).toEqual(['Word Build']);
    expect(context.documentBytes).toBe(JSON.stringify(clip).length);
  });

  it('summarises a poster with its theme controls and no timing', () => {
    const context = buildAgentContext({
      kind: 'poster',
      title: 'Amber',
      document: poster,
      masked: poster,
      focus: [],
      assets: 2,
      history: 3,
      instructions: 'prompt',
      model: 'primary',
      fallbackModel: 'fallback',
    });
    expect(context).toMatchObject({
      canvas: `${poster.width}×${poster.height}`,
      timing: null,
      controls: poster.controls.length,
      elements: poster.elements.length,
      assets: 2,
      history: 3,
    });
  });
});
