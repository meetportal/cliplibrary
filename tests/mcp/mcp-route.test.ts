import { describe, expect, it } from 'bun:test';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { POST } from '@/app/mcp/route';
import { createMcpServer } from '@/mcp/server';
import { decodeVideo, type SharedVideo } from '@/mcp/video-link';
import { decodeSite, type SharedSite } from '@/sites/site-link';

const sign = (site: SharedSite) => ({ d: JSON.stringify(site).length.toString(), sig: 'test' });

const handler = async (request: Request): Promise<Response> => {
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer('https://clips.test', { sign }).connect(transport);
  return transport.handleRequest(request);
};

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
  editorUrl: string;
  video: SharedVideo;
  timeline: { elements: { clip: string; from: number }[] }[];
}

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
      'get_site_template',
      'list_site_templates',
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

  it('publishes a website and edits it into a new link', async () => {
    const { templates } = jsonOf<{ templates: { id: string; demo: string }[] }>(
      await call('list_site_templates', {}),
    );
    expect(templates[0]).toMatchObject({
      id: 'emerald-rose',
      demo: 'https://clips.test/preview/emerald-rose',
    });
    const template = jsonOf<{ fieldGuide: string }>(
      await call('get_site_template', { templateId: 'emerald-rose' }),
    );
    expect(template.fieldGuide).toContain('/content/couple/firstName');
    const created = jsonOf<{ siteUrl: string; editorUrl: string; title: string; site: SharedSite }>(
      await call('create_site', {
        templateId: 'emerald-rose',
        slug: 'maya-and-daniel',
        content: { couple: { firstName: 'Maya', secondName: 'Daniel', monogram: 'M & D' } },
        operations: [{ op: 'replace', path: '/content/event/venue', value: 'Villa Cimbrone' }],
      }),
    );
    expect(created.title).toBe('Maya & Daniel');
    expect(created.siteUrl).toStartWith('https://clips.test/s/maya-and-daniel?d=');
    expect(created.editorUrl).toStartWith('https://clips.test/sites/emerald-rose?d=');
    const edited = jsonOf<{ site: SharedSite; siteUrl: string }>(
      await call('edit_site', {
        site: created.site,
        slug: 'maya-daniel-2027',
        operations: [{ op: 'replace', path: '/content/event/startsAt', value: '2027-06-12T16:00' }],
      }),
    );
    expect(edited.siteUrl).toStartWith('https://clips.test/s/maya-daniel-2027?');
    expect(edited.site.content).toMatchObject({
      event: { venue: 'Villa Cimbrone', startsAt: '2027-06-12T16:00' },
    });
    expect(
      (
        await call('edit_site', {
          site: created.site,
          operations: [{ op: 'replace', path: '/templateId', value: 'other' }],
        })
      ).isError,
    ).toBe(true);
    expect(
      (await call('create_site', { templateId: 'emerald-rose', slug: 'Bad Slug' })).isError,
    ).toBe(true);
    expect(decodeSite('nonsense').ok).toBe(false);
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
