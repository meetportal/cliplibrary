import { z } from 'zod';
import type { SharedSite } from '@/sites/site-link';

const problemSchema = z.object({ problem: z.string() });

export type ApiResult<T> = { ok: true; value: T } | { ok: false; problem: string };

const call = async <T>(request: Promise<Response>, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  try {
    const response = await request;
    const body: unknown = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const parsed = problemSchema.safeParse(body);
      return {
        ok: false,
        problem: parsed.success ? parsed.data.problem : `Request failed with ${response.status}.`,
      };
    }
    const parsed = schema.safeParse(body);
    return parsed.success
      ? { ok: true, value: parsed.data }
      : { ok: false, problem: 'Unexpected response.' };
  } catch {
    return { ok: false, problem: 'Could not reach the server.' };
  }
};

const post = (url: string, body: unknown) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

export const publishSite = (site: SharedSite) =>
  call(post('/api/sites/publish', site), z.object({ sitePath: z.string(), editPath: z.string() }));

const keySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable(),
});

export type ApiKeyRow = z.infer<typeof keySchema>;

export const listApiKeys = () =>
  call(fetch('/api/api-keys'), z.object({ keys: z.array(keySchema) }));

export const createApiKey = (name: string) =>
  call(post('/api/api-keys', { name }), z.object({ secret: z.string(), key: keySchema }));

export const revokeApiKey = (id: string) =>
  call(fetch(`/api/api-keys/${id}`, { method: 'DELETE' }), z.null());
