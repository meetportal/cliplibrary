export const MCP_PATH = '/mcp';

const resourceMetadataUrl = (origin: string): string =>
  `${origin}/.well-known/oauth-protected-resource${MCP_PATH}`;

export const mcpChallenge = (origin: string): string =>
  `Bearer realm="neuclip", resource_metadata="${resourceMetadataUrl(origin)}"`;
