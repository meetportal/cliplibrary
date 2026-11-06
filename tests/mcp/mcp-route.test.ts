import { beforeEach, describe, expect, it } from 'bun:test';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { POST } from '@/app/mcp/route';
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
});
