import { z } from 'zod';
import { EDIT_KEY_HEADER } from '@/lib/site-api';
import { siteStore } from '@/lib/site-store';

const updateSchema = z.object({ content: z.unknown() });

export const PUT = async (request: Request, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ problem: 'Send the website content.' }, { status: 400 });
  }
  const result = await siteStore.update(
    slug,
    request.headers.get(EDIT_KEY_HEADER) ?? '',
    parsed.data.content,
  );
  return result.ok
    ? Response.json({ updatedAt: result.value.updatedAt })
    : Response.json({ problem: result.problem }, { status: result.status });
};
