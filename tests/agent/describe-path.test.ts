import { describe, expect, it } from 'bun:test';
import { describePath, selectionNames } from '@/agent/describe-path';
import { seedProjectForClip } from '@/core';
import { reviewPoster as poster } from './review-poster';

const clip = seedProjectForClip('dot-ring-logo-reveal');
const scope = 'Dot Ring Logo Reveal';

const clipElementId = clip.tracks[0]?.elements[0]?.id ?? '';

describe('describePath', () => {
  it('names the clip control a prop path belongs to', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/companyName')).toEqual({
      scope,
      section: 'Logo and name',
      field: 'Company name',
    });
  });

  it('prefers a dedicated control over a linked one', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/colors/ring').field).toBe(
      'Ring color',
    );
  });

  it('names the colour role when a path leads a role', () => {
    expect(describePath('clip', clip, '/tracks/0/elements/0/props/colors/primary')).toEqual({
      scope,
      section: 'Colors',
      field: 'Primary color',
    });
  });

  it('names poster theme controls and list items', () => {
    expect(describePath('poster', poster, '/controls/2/value')).toEqual({
      scope: 'Theme',
      section: 'Colors',
      field: 'Primary color',
    });
    expect(describePath('poster', poster, '/controls/6/values/0')).toEqual({
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
    expect(describePath('poster', poster, '/elements/1/fill')).toEqual({
      scope: 'Star',
      section: null,
      field: 'Fill',
    });
    expect(describePath('poster', poster, '/background').field).toBe('Background');
    expect(describePath('poster', poster, '/title').field).toBe('Title');
    expect(describePath('poster', poster, '/elements/-').scope).toBe('New element');
  });
});

describe('selectionNames', () => {
  it('lists selected clip and poster elements by name', () => {
    expect(selectionNames('clip', clip, [clipElementId])).toEqual([scope]);
    expect(selectionNames('poster', poster, [poster.elements[0]?.id ?? ''])).toEqual(['CLIENT']);
    expect(selectionNames('poster', poster, [])).toEqual([]);
  });
});
