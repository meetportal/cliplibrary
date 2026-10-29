import { accessDenied, currentAccess } from '@/lib/session';
import { signSite } from '@/lib/site-signing';
import { checkSharedSite, editSitePath, publicSitePath } from '@/sites/site-link';

export const POST = async (request: Request) => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const checked = checkSharedSite(await request.json().catch(() => null));
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  const query = signSite(checked.site);
  return Response.json({
    sitePath: publicSitePath(checked.site.slug, query),
    editPath: editSitePath(checked.site.templateId, query),
  });
};
