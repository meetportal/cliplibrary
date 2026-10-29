import { EDIT_KEY_HEADER } from '@/lib/site-api';
import { siteStore } from '@/lib/site-store';

type Context = { params: Promise<{ slug: string }> };

export const POST = async (request: Request, { params }: Context) => {
  const { slug } = await params;
  const result = await siteStore.addRsvp(slug, await request.json().catch(() => null));
  return result.ok
    ? Response.json({ receivedAt: result.value.receivedAt }, { status: 201 })
    : Response.json({ problem: result.problem }, { status: result.status });
};

export const GET = async (request: Request, { params }: Context) => {
  const { slug } = await params;
  const result = await siteStore.listRsvps(slug, request.headers.get(EDIT_KEY_HEADER) ?? '');
  return result.ok
    ? Response.json({ replies: result.value })
    : Response.json({ problem: result.problem }, { status: result.status });
};
