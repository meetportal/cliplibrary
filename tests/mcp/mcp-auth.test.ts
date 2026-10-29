import { beforeEach, describe, expect, it, mock } from 'bun:test';

const API_KEY = 'ak_valid';
const OAUTH_TOKEN = 'oat_valid';
const PENDING_TOKEN = 'oat_pending';

const owners: Record<string, { subject: string; kind: 'api_key' | 'oauth' }> = {
  [API_KEY]: { subject: 'user_key', kind: 'api_key' },
  [OAUTH_TOKEN]: { subject: 'user_oauth', kind: 'oauth' },
  [PENDING_TOKEN]: { subject: 'user_pending', kind: 'oauth' },
};

const verifier = (kind: 'api_key' | 'oauth') => (token: string) => {
  const owner = owners[token];
  return owner?.kind === kind
    ? Promise.resolve({ subject: owner.subject, revoked: false, expired: false })
    : Promise.reject(new Error('invalid token'));
};

mock.module('@clerk/nextjs/server', () => ({
  auth: async () => ({ userId: null }),
  currentUser: async () => null,
  clerkClient: async () => ({
    apiKeys: { verify: verifier('api_key') },
    idPOAuthAccessToken: { verify: verifier('oauth') },
    users: {
      getUser: async (id: string) => ({ publicMetadata: { approved: id !== 'user_pending' } }),
    },
  }),
}));

const { POST } = await import('@/app/mcp/route');
const metadata = await import('@/app/.well-known/oauth-protected-resource/mcp/route');

const listTools = (token: string | null) =>
  POST(
    new Request('https://clips.test/mcp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        ...(token === null ? {} : { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
    }),
  );

beforeEach(() => {
  Object.assign(Bun.env, {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: `pk_test_${btoa('clerk.clips.test$')}`,
  });
});

describe('/mcp auth', () => {
  it('serves a request signed with an OAuth access token', async () => {
    const response = await listTools(OAUTH_TOKEN);
    expect(response.status).toBe(200);
    expect(((await response.json()) as { result: { tools: unknown[] } }).result.tools).not.toEqual(
      [],
    );
  });

  it('still serves a request signed with an API key', async () => {
    expect((await listTools(API_KEY)).status).toBe(200);
  });

  it('points unauthenticated clients at the protected resource metadata', async () => {
    const responses = await Promise.all([listTools(null), listTools('oat_forged')]);
    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.headers.get('www-authenticate')).toBe(
        'Bearer realm="neuclip", resource_metadata="https://clips.test/.well-known/oauth-protected-resource/mcp"',
      );
    }
  });

  it('refuses OAuth users who are waiting for approval', async () => {
    expect((await listTools(PENDING_TOKEN)).status).toBe(403);
  });

  it('names Clerk as the authorization server for the /mcp resource', async () => {
    const response = metadata.GET(
      new Request('https://clips.test/.well-known/oauth-protected-resource/mcp'),
    );
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(await response.json()).toMatchObject({
      resource: 'https://clips.test/mcp',
      authorization_servers: ['https://clerk.clips.test'],
      scopes_supported: ['profile', 'email'],
    });
  });
});
