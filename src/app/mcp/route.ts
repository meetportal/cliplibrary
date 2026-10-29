import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { bearerToken } from '@/auth/bearer';
import { apiKeyOwner } from '@/lib/api-keys';
import { isApprovedUser } from '@/lib/session';
import { createMcpServer } from '@/mcp/server';

const refuse = (status: number, message: string): Response =>
  Response.json(
    { error: status === 401 ? 'unauthorized' : 'forbidden', message },
    { status, headers: status === 401 ? { 'www-authenticate': 'Bearer realm="neuclip"' } : {} },
  );

const handle = async (request: Request): Promise<Response> => {
  const { origin } = new URL(request.url);
  const userId = await apiKeyOwner(bearerToken(request));
  if (userId === null) {
    return refuse(
      401,
      `Create an API key at ${origin}/integrations and send it as "Authorization: Bearer <key>".`,
    );
  }
  if (!(await isApprovedUser(userId))) {
    return refuse(403, 'This account is waiting for approval.');
  }
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer(origin, userId).connect(transport);
  return transport.handleRequest(request);
};

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
