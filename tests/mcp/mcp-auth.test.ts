import { beforeEach, describe, expect, it, mock } from 'bun:test';

const API_KEY = 'ak_valid';
const OAUTH_TOKEN = 'oat_valid';
const PENDING_TOKEN = 'oat_pending';

const owners: Record<string, string> = {
  [API_KEY]: 'user_key',
  [OAUTH_TOKEN]: 'user_oauth',
  [PENDING_TOKEN]: 'user_pending',
};

const acceptedTypes: unknown[] = [];

const authenticateRequest = (request: Request, options: { acceptsToken: unknown }) => {
  acceptedTypes.push(options.acceptsToken);
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') ?? '')?.[1] ?? '';
  const subject = owners[token];
  return Promise.resolve({
    toAuth: () =>
      subject === undefined
        ? { isAuthenticated: false, subject: null }
        : { isAuthenticated: true, subject },
  });
};

mock.module('@clerk/nextjs/server', () => ({
  auth: () => Promise.resolve({ userId: null }),
  currentUser: () => Promise.resolve(null),
  clerkClient: () =>
    Promise.resolve({
      authenticateRequest,
      users: {
        getUser: (id: string) =>
          Promise.resolve({ publicMetadata: { approved: id !== 'user_pending' } }),
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
    expect(acceptedTypes.at(-1)).toEqual(['api_key', 'oauth_token']);
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
