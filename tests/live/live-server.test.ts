import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ServerMessage } from '@/live/protocol';

let server: Bun.Subprocess<'ignore', 'pipe', 'inherit'>;
let baseUrl: URL;
let requestId = 0;

beforeAll(async () => {
  server = Bun.spawn(['bun', 'run', `${import.meta.dir}/fixtures/stub-live-server.ts`], {
    stdout: 'pipe',
  });
  const reader = server.stdout.getReader();
  const { value } = await reader.read();
  reader.releaseLock();
  baseUrl = new URL(new TextDecoder().decode(value).trim());
});

afterAll(() => {
  server.kill();
});

const rpc = async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
  requestId += 1;
  const response = await Bun.fetch(new URL('/mcp', baseUrl).href, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params }),
  });
  const body = (await response.json()) as { result: T };
  return body.result;
};

const call = (name: string, args: Record<string, unknown>) =>
  rpc<CallToolResult>('tools/call', { name, arguments: args });

const textOf = (result: CallToolResult): string =>
  result.content.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('');

const jsonOf = <T>(result: CallToolResult): T => JSON.parse(textOf(result)) as T;

const openSocket = (query: string) => {
  const messages: ServerMessage[] = [];
  const waiters = new Map<number, (message: ServerMessage) => void>();
  const socket = new WebSocket(new URL(`/ws${query}`, baseUrl.href.replace('http', 'ws')));
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data)) as ServerMessage;
    messages.push(message);
    waiters.get(messages.length)?.(message);
  });
  const next = (count: number): Promise<ServerMessage> => {
    const ready = messages[count - 1];
    return ready === undefined
      ? new Promise((resolve) => waiters.set(count, resolve))
      : Promise.resolve(ready);
  };
  return { socket, messages, next };
};

describe('live MCP server', () => {
  it('lists every tool', async () => {
    const { tools } = await rpc<{ tools: { name: string }[] }>('tools/list', {});
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'add_clip',
      'create_video',
      'edit_video',
      'export_video',
      'get_clip',
      'get_video',
      'list_videos',
      'render_frame',
      'search_clips',
    ]);
  });

  it('searches clips and describes one', async () => {
    const { results } = jsonOf<{ results: { id: string; preview: string }[] }>(
      await call('search_clips', { query: 'brand reveal', limit: 3 }),
    );
    expect(results[0]).toMatchObject({
      id: 'brand-reveal',
      preview: 'http://app.test/previews/brand-reveal.mp4',
    });
    const clip = jsonOf<{ fieldGuide: string; defaultProps: { brandName: string } }>(
      await call('get_clip', { clipId: 'brand-reveal' }),
    );
    expect(clip.defaultProps.brandName).toBe('Halo');
    expect(clip.fieldGuide).toContain('props/brandName');
    expect((await call('get_clip', { clipId: 'nope' })).isError).toBe(true);
  });

  it('streams agent edits to watching editors and takes editor edits back', async () => {
    const list = openSocket('');
    expect(await list.next(1)).toEqual({ type: 'sessions', sessions: [] });

    const created = jsonOf<{ videoId: string; liveUrl: string }>(
      await call('create_video', { title: 'Acme launch', clips: [{ clipId: 'brand-reveal' }] }),
    );
    expect(created.liveUrl).toBe(`http://app.test/live/${created.videoId}`);
    expect(await list.next(2)).toMatchObject({
      type: 'sessions',
      sessions: [{ title: 'Acme launch' }],
    });

    const editor = openSocket(`?session=${created.videoId}`);
    expect(await editor.next(1)).toMatchObject({ type: 'session', session: { version: 0 } });

    await call('edit_video', {
      videoId: created.videoId,
      summary: 'Rename the brand',
      operations: [{ op: 'replace', path: '/tracks/0/elements/0/props/brandName', value: 'Acme' }],
    });
    const pushed = await editor.next(2);
    expect(
      pushed.type === 'session' ? pushed.session.project.tracks[0]?.elements[0] : null,
    ).toMatchObject({
      props: { brandName: 'Acme' },
    });
    expect(pushed.type === 'session' ? pushed.session.activity.at(-1)?.summary : null).toBe(
      'Rename the brand',
    );

    if (pushed.type !== 'session') {
      throw new Error('expected a session');
    }
    const { session } = pushed;
    editor.socket.send(
      JSON.stringify({
        type: 'replace',
        baseVersion: 1,
        project: { ...session.project, background: '#123456' },
      }),
    );
    expect(await editor.next(3)).toEqual({ type: 'ack', version: 2 });
    const fetched = jsonOf<{ project: { background: string } }>(
      await call('get_video', { videoId: created.videoId }),
    );
    expect(fetched.project.background).toBe('#123456');

    editor.socket.send(
      JSON.stringify({ type: 'replace', baseVersion: 0, project: session.project }),
    );
    expect(await editor.next(4)).toMatchObject({ type: 'session', session: { version: 2 } });

    editor.socket.close();
    list.socket.close();
  });

  it('rejects invalid edits and logs them without changing the video', async () => {
    const { videoId } = jsonOf<{ videoId: string }>(
      await call('create_video', { title: 'Bad edits', clips: [{ clipId: 'brand-reveal' }] }),
    );
    const result = await call('edit_video', {
      videoId,
      summary: 'Break the colour',
      operations: [{ op: 'replace', path: '/tracks/0/elements/0/props/markColor', value: 42 }],
    });
    expect(result.isError).toBe(true);
    expect(jsonOf<{ version: number }>(await call('get_video', { videoId })).version).toBe(0);
    const watcher = openSocket(`?session=${videoId}`);
    const snapshot = await watcher.next(1);
    expect(snapshot.type === 'session' ? snapshot.session.activity.at(-1) : null).toMatchObject({
      ok: false,
      summary: 'Break the colour',
    });
    watcher.socket.close();
    expect((await call('create_video', { title: 'x', clips: [{ clipId: 'nope' }] })).isError).toBe(
      true,
    );
  });

  it('adds clips, renders frames and exports', async () => {
    const { videoId } = jsonOf<{ videoId: string }>(await call('create_video', { title: 'Grow' }));
    const added = jsonOf<{
      timeline: { elements: { clip: string }[] }[];
      durationInFrames: number;
    }>(await call('add_clip', { videoId, clipId: 'word-build', props: { text: 'SHIP IT' } }));
    expect(added.timeline[0]?.elements[0]?.clip).toContain('word-build');
    const frame = await call('render_frame', { videoId, seconds: 1 });
    const [image] = frame.content;
    expect(image).toMatchObject({ type: 'image', mimeType: 'image/jpeg' });
    expect(image?.type === 'image' ? Buffer.from(image.data, 'base64')[3] : null).toBe(30);
    expect(jsonOf<{ path: string }>(await call('export_video', { videoId })).path).toBe(
      `/exports/${videoId}.mp4`,
    );
    const videos = jsonOf<{ id: string }[]>(await call('list_videos', {}));
    expect(videos[0]?.id).toBe(videoId);
  });
});
