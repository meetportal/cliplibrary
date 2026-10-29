import { z } from 'zod';
import { siteStore } from '@/lib/site-store';

const createSchema = z.object({ slug: z.string(), templateId: z.string(), content: z.unknown() });

export const GET = async (request: Request) => {
  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  const problem = await siteStore.availability(slug);
  return Response.json({ available: problem === null, problem });
};

export const POST = async (request: Request) => {
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ problem: 'Send a slug, template and content.' }, { status: 400 });
  }
  const result = await siteStore.create(parsed.data);
  return result.ok
    ? Response.json(result.value, { status: 201 })
    : Response.json({ problem: result.problem }, { status: result.status });
};
