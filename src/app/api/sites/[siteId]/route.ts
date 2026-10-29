import { z } from 'zod';
import { deleteSite, findOwnedSite, updateSite } from '@/db/sites';
import { accessDenied, currentAccess } from '@/lib/session';
import { checkPublishedSite } from '@/sites/published-site';
import { siteWriteResponse } from '../site-response';

type Context = { params: Promise<{ siteId: string }> };

const changeSchema = z.object({ slug: z.string(), content: z.unknown() });

const missing = () => Response.json({ problem: 'That website does not exist.' }, { status: 404 });

export const PUT = async (request: Request, { params }: Context) => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const { siteId } = await params;
  const site = await findOwnedSite(access.userId, siteId);
  if (site === null) {
    return missing();
  }
  const change = changeSchema.safeParse(await request.json().catch(() => null));
  const checked = checkPublishedSite(
    change.success ? { ...change.data, templateId: site.templateId } : null,
  );
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  return siteWriteResponse(await updateSite(access.userId, siteId, checked.site));
};

export const DELETE = async (_request: Request, { params }: Context) => {
  const access = await currentAccess();
  if (access.kind === 'signed-out') {
    return accessDenied(access);
  }
  return (await deleteSite(access.userId, (await params).siteId))
    ? new Response(null, { status: 204 })
    : missing();
};
