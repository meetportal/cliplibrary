import { createSite } from '@/db/sites';
import { accessDenied, currentAccess } from '@/lib/session';
import { checkPublishedSite } from '@/sites/published-site';
import { siteWriteResponse } from './site-response';

export const POST = async (request: Request) => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const checked = checkPublishedSite(await request.json().catch(() => null));
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  return siteWriteResponse(await createSite(access.userId, checked.site));
};
