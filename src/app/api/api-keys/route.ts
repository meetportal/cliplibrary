import { z } from 'zod';
import { createApiKey, listApiKeys } from '@/lib/api-keys';
import { accessDenied, currentAccess } from '@/lib/session';

const createSchema = z.object({ name: z.string().trim().min(1).max(60) });

export const GET = async () => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const result = await listApiKeys(access.userId);
  return result.ok
    ? Response.json({ keys: result.value })
    : Response.json({ problem: result.problem }, { status: result.status });
};

export const POST = async (request: Request) => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ problem: 'Give the key a name.' }, { status: 400 });
  }
  const result = await createApiKey(access.userId, parsed.data.name);
  return result.ok
    ? Response.json(result.value, { status: 201 })
    : Response.json({ problem: result.problem }, { status: result.status });
};
