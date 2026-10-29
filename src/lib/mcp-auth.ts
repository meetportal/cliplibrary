import 'server-only';
import { clerkClient } from '@clerk/nextjs/server';

export const MCP_SCOPES = ['profile', 'email'];

export const mcpTokenOwner = async (request: Request): Promise<string | null> => {
  try {
    const state = await (await clerkClient()).authenticateRequest(request, {
      acceptsToken: ['api_key', 'oauth_token'],
    });
    const auth = state.toAuth();
    return auth?.isAuthenticated === true ? auth.subject : null;
  } catch {
    return null;
  }
};
