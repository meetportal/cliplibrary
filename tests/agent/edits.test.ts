import { describe, expect, it } from 'bun:test';
import { maskAssets, restoreAssets } from '@/agent/assets';
import { applyEdits } from '@/agent/edits';
import { mediaInstructions } from '@/agent/instructions';
import { checkMedia } from '@/agent/media';
import { createMediaTools, editSucceeded } from '@/agent/tools';
import { seedProjectForClip } from '@/core';
import { findPoster } from '@/posters';

const clip = seedProjectForClip('word-build');
const poster = findPoster('amber-client-reviews-01')?.build();

if (poster === undefined) {
  throw new Error('missing poster fixture');
}

const textIndex = poster.elements.findIndex((element) => element.type === 'text');

describe('applyEdits', () => {
  it('replaces a clip prop and keeps the project valid', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'HELLO WORLD' },
    ]);
    expect(result.ok).toBe(true);
    expect(result.ok ? result.document.tracks[0]?.elements[0] : null).toMatchObject({
      props: { text: 'HELLO WORLD' },
    });
  });

  it('rejects a prop that breaks the clip schema', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/bigColor', value: 'red' },
    ]);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toContain('/tracks/0/elements/0/props');
  });

  it('reports a path that does not exist', () => {
    const result = applyEdits('clip', clip, [{ op: 'remove', path: '/tracks/9' }]);
    expect(result.ok).toBe(false);
  });

  it('does not mutate the source document', () => {
    const before = JSON.stringify(poster);
    applyEdits('poster', poster, [{ op: 'replace', path: '/title', value: 'Changed' }]);
    expect(JSON.stringify(poster)).toBe(before);
  });

  it('rejects fonts outside the bundled set', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/elements/${textIndex}/fontFamily`, value: 'Comic Sans MS' },
    ]);
    expect(result.ok ? '' : result.error).toContain('not a bundled font');
  });

  it('rejects duplicate element ids', () => {
    const result = applyEdits('poster', poster, [
      { op: 'copy', from: `/elements/${textIndex}`, path: '/elements/-' },
    ]);
    expect(result.ok ? '' : result.error).toContain('duplicate id');
  });
});

describe('checkMedia', () => {
  it('accepts the seeded clip and the built poster', () => {
    expect(checkMedia('clip', clip).ok).toBe(true);
    expect(checkMedia('poster', poster).ok).toBe(true);
  });

  it('rejects a poster sent as a clip', () => {
    expect(checkMedia('clip', poster).ok).toBe(false);
  });
});

describe('assets', () => {
  it('masks heavy strings and restores them', () => {
    const image = `data:image/png;base64,${'a'.repeat(50)}`;
    const { masked, assets } = maskAssets({ src: image, again: image, name: 'photo' });
    expect(masked).toEqual({ src: 'asset://0', again: 'asset://0', name: 'photo' });
    expect(restoreAssets(masked, assets)).toEqual({ src: image, again: image, name: 'photo' });
  });

  it('leaves unknown asset references alone', () => {
    expect(restoreAssets('asset://4', [])).toBe('asset://4');
  });
});

describe('mediaInstructions', () => {
  it('describes clip fields with their prop paths and the selection', () => {
    const text = mediaInstructions('clip', 'Word Build', clip, ['element-1']);
    expect(text).toContain('props/text');
    expect(text).toContain('Selected element ids: element-1.');
  });

  it('lists the bundled fonts for posters', () => {
    const text = mediaInstructions('poster', 'Amber', poster, []);
    expect(text).toContain('Bebas Neue');
    expect(text).toContain('Nothing is selected.');
  });
});

describe('createMediaTools', () => {
  const run = (tools: ReturnType<typeof createMediaTools>, value: string) => {
    const execute = tools.editMedia.execute;
    if (execute === undefined) {
      throw new Error('editMedia has no execute');
    }
    return execute(
      {
        summary: 'Rename',
        operations: [{ op: 'replace', path: '/elements/0/name', value }],
      },
      { toolCallId: 'call', messages: [], context: {} } as never,
    );
  };

  it('chains edits and restores masked assets in the returned operations', async () => {
    const { masked, assets } = maskAssets(poster);
    const tools = createMediaTools('poster', masked, [...assets, 'data:image/png;base64,x']);
    const output = await run(tools, `asset://${assets.length}`);
    expect(output).toEqual({
      ok: true,
      operations: [{ op: 'replace', path: '/elements/0/name', value: 'data:image/png;base64,x' }],
    });
  });

  it('stops the loop only after a successful edit', () => {
    expect(
      editSucceeded({ steps: [{ toolResults: [{ output: { ok: false, error: 'x' } }] }] }),
    ).toBe(false);
    expect(
      editSucceeded({ steps: [{ toolResults: [{ output: { ok: true, operations: [] } }] }] }),
    ).toBe(true);
    expect(editSucceeded({ steps: [] })).toBe(false);
  });
});
