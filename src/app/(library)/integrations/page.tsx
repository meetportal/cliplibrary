import type { Metadata } from 'next';
import { McpSetup } from '@/components/integrations/mcp-setup';
import { requireUserId } from '@/lib/auth-pages';
import { currentAccess } from '@/lib/session';

export const metadata: Metadata = { title: 'MCP · Neuclip' };

const IntegrationsPage = async () => {
  await requireUserId('/integrations');
  const access = await currentAccess();
  return <McpSetup approved={access.kind === 'approved'} />;
};

export default IntegrationsPage;
