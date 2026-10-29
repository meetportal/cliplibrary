import { metadataCorsOptionsRequestHandler } from '@clerk/mcp-tools/next';
import { corsHeaders, generateClerkProtectedResourceMetadata } from '@clerk/mcp-tools/server';
import { MCP_PATH } from '@/auth/mcp-metadata';
import { MCP_SCOPES } from '@/lib/mcp-auth';

export const GET = (request: Request): Response => {
  // biome-ignore lint/style/noProcessEnv: the Clerk publishable key names the authorization server
  const { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: publishableKey = '' } = process.env;
  return Response.json(
    generateClerkProtectedResourceMetadata({
      publishableKey,
      resourceUrl: `${new URL(request.url).origin}${MCP_PATH}`,
      properties: { scopes_supported: MCP_SCOPES, resource_name: 'neuclip' },
    }),
    { headers: { 'cache-control': 'max-age=3600', ...corsHeaders } },
  );
};

export const OPTIONS = metadataCorsOptionsRequestHandler();
