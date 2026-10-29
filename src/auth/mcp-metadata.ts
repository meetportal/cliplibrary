export const MCP_PATH = '/mcp';

const firstValue = (value: string | null): string | undefined =>
  value?.split(',')[0]?.trim() || undefined;

export const publicOrigin = (request: Request): string => {
  const url = new URL(request.url);
  const host =
    firstValue(request.headers.get('x-forwarded-host')) ??
    firstValue(request.headers.get('host')) ??
    url.host;
  const protocol =
    firstValue(request.headers.get('x-forwarded-proto')) ?? url.protocol.slice(0, -1);
  return `${protocol}://${host}`;
};

const resourceMetadataUrl = (origin: string): string =>
  `${origin}/.well-known/oauth-protected-resource${MCP_PATH}`;

export const mcpChallenge = (origin: string): string =>
  `Bearer realm="neuclip", resource_metadata="${resourceMetadataUrl(origin)}"`;
