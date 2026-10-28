import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createMcpServer } from '@/mcp/server';

const handle = async (request: Request): Promise<Response> => {
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer(new URL(request.url).origin).connect(transport);
  return transport.handleRequest(request);
};

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
