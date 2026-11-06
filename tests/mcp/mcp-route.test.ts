import { beforeEach, describe, expect, it } from 'bun:test';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { POST } from '@/app/mcp/route';
import { findVideo } from '@/db/videos';
import { createMcpServer } from '@/mcp/server';
import { resetTestDatabase } from '../test-database';

let ownerId = 'user_test';

const handler = async (request: Request): Promise<Response> => {
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer('https://clips.test', ownerId).connect(transport);
  return transport.handleRequest(request);
};

beforeEach(async () => {
  ownerId = 'user_test';
  await resetTestDatabase();
});

let requestId = 0;

const rpc = async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
  requestId += 1;
  const response = await handler(
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
  videoId: string;
  editorUrl: string;
  timeline: { elements: { clip: string; from: number }[] }[];
}

const CHEVRON = 'chevron-mark-assemble-a';
const DOT_RING = 'dot-ring-logo-reveal-a';

describe('/mcp', () => {
  it('lists the tools', async () => {
    const { tools } = await rpc<{ tools: { name: string }[] }>('tools/list', {});
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'add_clip',
      'create_site',
      'create_video',
      'edit_site',
      'edit_video',
      'get_clip',
      'get_site',
      'get_site_template',
      'get_video',
      'list_site_templates',
      'list_sites',
      'list_videos',
      'search_clips',
    ]);
  });

  it('asks for an API key before serving anything', async () => {
    const response = await POST(
      new Request('https://clips.test/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
      }),
    );
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain('Bearer');
  });

  it('keeps videos private to their owner', async () => {
    const video = jsonOf<VideoResult>(
      await call('create_video', { title: 'Mine', clips: [{ clipId: CHEVRON }] }),
    );
    ownerId = 'user_other';
    expect((await call('get_video', { videoId: video.videoId })).isError).toBe(true);
    expect(jsonOf<{ videos: unknown[] }>(await call('list_videos', {})).videos).toEqual([]);
  });

  it('searches clips and describes one with its raw template tokens', async () => {
    const { results } = jsonOf<{ results: { id: string; preview: string }[] }>(
      await call('search_clips', { query: 'dot ring logo reveal', limit: 3 }),
    );
    expect(results.map((result) => result.id).sort()).toEqual([
      'dot-ring-logo-reveal-a',
      'dot-ring-logo-reveal-b',
      'dot-ring-logo-reveal-c',
    ]);
    expect(results[0]?.preview).toBe(`https://clips.test/previews/${results[0]?.id}.mp4`);
    const clip = jsonOf<{ fieldGuide: string; defaultProps: { companyName: string } }>(
      await call('get_clip', { clipId: DOT_RING }),
    );
    expect(clip.defaultProps.companyName).toBe('{{Company Name}}');
    expect(clip.fieldGuide).toContain('props/companyName');
    expect((await call('get_clip', { clipId: 'nope' })).isError).toBe(true);
  });

  it('builds a saved video across calls at one editor link', async () => {
    const created = jsonOf<VideoResult>(
      await call('create_video', {
        title: 'Acme launch',
        clips: [{ clipId: CHEVRON, props: { brand: { name: 'Acme' } } }],
      }),
    );
    expect(created.editorUrl).toBe(`https://clips.test/video/${created.videoId}`);

    const added = jsonOf<VideoResult>(
      await call('add_clip', { videoId: created.videoId, clipId: DOT_RING }),
    );
    expect(added.timeline[0]?.elements.map((element) => element.clip)).toEqual([
      `${CHEVRON} (Chevron Mark Assemble A)`,
      `${DOT_RING} (Dot Ring Logo Reveal A)`,
    ]);

    const edited = jsonOf<VideoResult>(
      await call('edit_video', {
        videoId: created.videoId,
        title: 'Acme is here',
        operations: [
          { op: 'replace', path: '/tracks/0/elements/0/props/colors/primary', value: '#2a9d8f' },
        ],
      }),
    );
    expect(edited.editorUrl).toBe(created.editorUrl);
    const saved = await findVideo(created.videoId);
    expect(saved?.title).toBe('Acme is here');
    expect(saved?.project.tracks[0]?.elements[0]).toMatchObject({
      props: { brand: { name: 'Acme' }, colors: { primary: '#2a9d8f' } },
    });
    const current = jsonOf<{ project: { tracks: unknown[] } }>(
      await call('get_video', { videoId: created.videoId }),
    );
    expect(current.project.tracks).toHaveLength(1);
    expect(
      jsonOf<{ videos: { videoId: string }[] }>(await call('list_videos', {})).videos,
    ).toMatchObject([{ videoId: created.videoId }]);
  });

  it('explains invalid input instead of changing anything', async () => {
    const { videoId } = jsonOf<VideoResult>(
      await call('create_video', { title: 'x', clips: [{ clipId: CHEVRON }] }),
    );
    const broken = await call('edit_video', {
      videoId,
      operations: [{ op: 'replace', path: '/tracks/0/elements/0/props/mark/cell', value: 'big' }],
    });
    expect(broken.isError).toBe(true);
    expect(textOf(broken)).toContain('cell');
    expect((await call('create_video', { title: 'x', clips: [{ clipId: 'nope' }] })).isError).toBe(
      true,
    );
    expect((await call('add_clip', { videoId: 'missing', clipId: DOT_RING })).isError).toBe(true);
  });
});
