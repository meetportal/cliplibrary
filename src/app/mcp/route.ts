import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { mcpChallenge } from '@/auth/mcp-metadata';
import { mcpTokenOwner } from '@/lib/mcp-auth';
import { isApprovedUser } from '@/lib/session';
import { createMcpServer } from '@/mcp/server';

const refuse = (origin: string, status: number, message: string): Response =>
  Response.json(
    { error: status === 401 ? 'unauthorized' : 'forbidden', message },
    { status, headers: status === 401 ? { 'www-authenticate': mcpChallenge(origin) } : {} },
  );

const handle = async (request: Request): Promise<Response> => {
  const { origin } = new URL(request.url);
  const userId = await mcpTokenOwner(request);
  if (userId === null) {
    return refuse(
      origin,
      401,
      `Sign in with OAuth from your MCP client, or create an API key at ${origin}/integrations and send it as "Authorization: Bearer <key>".`,
    );
  }
  if (!(await isApprovedUser(userId))) {
    return refuse(origin, 403, 'This account is waiting for approval.');
  }
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer(origin, userId).connect(transport);
  return transport.handleRequest(request);
};

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
