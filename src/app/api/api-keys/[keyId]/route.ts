import { revokeApiKey } from '@/lib/api-keys';
import { accessDenied, currentAccess } from '@/lib/session';

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ keyId: string }> },
) => {
  const access = await currentAccess();
  if (access.kind === 'signed-out') {
    return accessDenied(access);
  }
  const result = await revokeApiKey(access.userId, (await params).keyId);
  return result.ok
    ? new Response(null, { status: 204 })
    : Response.json({ problem: result.problem }, { status: result.status });
};
