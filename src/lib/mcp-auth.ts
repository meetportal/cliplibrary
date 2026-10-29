import 'server-only';
import { clerkClient } from '@clerk/nextjs/server';
import { apiKeyOwner } from '@/lib/api-keys';

export const MCP_SCOPES = ['profile', 'email'];

const oauthTokenOwner = async (token: string): Promise<string | null> => {
  if (token === '') {
    return null;
  }
  try {
    const verified = await (await clerkClient()).idPOAuthAccessToken.verify(token);
    return verified.revoked || verified.expired ? null : verified.subject;
  } catch {
    return null;
  }
};

export const mcpTokenOwner = async (token: string): Promise<string | null> =>
  (await apiKeyOwner(token)) ?? (await oauthTokenOwner(token));
