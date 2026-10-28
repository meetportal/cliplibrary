import { describe, expect, it } from 'bun:test';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { POST } from '@/app/mcp/route';
import { decodeVideo, type SharedVideo } from '@/mcp/video-link';

let requestId = 0;

const rpc = async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
  requestId += 1;
  const response = await POST(
    new Request('https://clips.test/mcp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params }),
    }),
  );
  return ((await response.json()) as { result: T }).result;
};

const call = (name: string, args: Record<string, unknown>) =>
  rpc<CallToolResult>('tools/call', { name, arguments: args });

const textOf = (result: CallToolResult): string =>
  result.content.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('');

const jsonOf = <T>(result: CallToolResult): T => JSON.parse(textOf(result)) as T;

interface VideoResult {
  editorUrl: string;
  video: SharedVideo;
  timeline: { elements: { clip: string; from: number }[] }[];
}

describe('/mcp', () => {
  it('lists the tools', async () => {
    const { tools } = await rpc<{ tools: { name: string }[] }>('tools/list', {});
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'add_clip',
      'create_video',
      'edit_video',
      'get_clip',
      'search_clips',
    ]);
  });

  it('searches clips and describes one', async () => {
    const { results } = jsonOf<{ results: { id: string; preview: string }[] }>(
      await call('search_clips', { query: 'brand reveal', limit: 3 }),
    );
    expect(results[0]).toMatchObject({
      id: 'brand-reveal',
      preview: 'https://clips.test/previews/brand-reveal.mp4',
    });
    const clip = jsonOf<{ fieldGuide: string; defaultProps: { brandName: string } }>(
      await call('get_clip', { clipId: 'brand-reveal' }),
    );
    expect(clip.defaultProps.brandName).toBe('Halo');
    expect(clip.fieldGuide).toContain('props/brandName');
    expect((await call('get_clip', { clipId: 'nope' })).isError).toBe(true);
  });

  it('builds a video across calls and links each version to the editor', async () => {
    const created = jsonOf<VideoResult>(
      await call('create_video', {
        title: 'Acme launch',
        clips: [{ clipId: 'brand-reveal', props: { brandName: 'Acme' } }],
      }),
    );
    expect(created.editorUrl.startsWith('https://clips.test/video#')).toBe(true);

    const added = jsonOf<VideoResult>(
      await call('add_clip', { video: created.video, clipId: 'cta-end-card' }),
    );
    expect(added.timeline[0]?.elements.map((element) => element.clip)).toEqual([
      'brand-reveal (Brand Reveal)',
      'cta-end-card (CTA End Card)',
    ]);

    const edited = jsonOf<VideoResult>(
      await call('edit_video', {
        video: added.video,
        title: 'Acme is here',
        operations: [
          { op: 'replace', path: '/tracks/0/elements/0/props/tagline', value: 'Ship faster.' },
        ],
      }),
    );
    const decoded = decodeVideo(edited.editorUrl.split('#')[1] ?? '');
    expect(decoded.ok ? decoded.video.title : null).toBe('Acme is here');
    expect(decoded.ok ? decoded.video.project.tracks[0]?.elements[0] : null).toMatchObject({
      props: { brandName: 'Acme', tagline: 'Ship faster.' },
    });
  });

  it('explains invalid input instead of changing anything', async () => {
    const { video } = jsonOf<VideoResult>(
      await call('create_video', { title: 'x', clips: [{ clipId: 'brand-reveal' }] }),
    );
    const broken = await call('edit_video', {
      video,
      operations: [{ op: 'replace', path: '/tracks/0/elements/0/props/markColor', value: 42 }],
    });
    expect(broken.isError).toBe(true);
    expect(textOf(broken)).toContain('markColor');
    expect((await call('create_video', { title: 'x', clips: [{ clipId: 'nope' }] })).isError).toBe(
      true,
    );
    expect(
      (await call('add_clip', { video: { title: 'x', project: { fps: 0 } }, clipId: 'word-build' }))
        .isError,
    ).toBe(true);
  });
});
