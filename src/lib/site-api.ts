import { z } from 'zod';
import type { Project } from '@/project';
import type { PublishedSite } from '@/sites/published-site';

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

const send = (method: 'POST' | 'PUT', url: string, body: unknown) =>
  fetch(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const post = (url: string, body: unknown) => send('POST', url, body);

const savedSiteSchema = z.object({
  site: z.object({ id: z.string(), slug: z.string(), updatedAt: z.string() }),
});

export type SavedSite = z.infer<typeof savedSiteSchema>['site'];

export const publishSite = (site: PublishedSite) => call(post('/api/sites', site), savedSiteSchema);

export const publishSiteChanges = (id: string, change: Pick<PublishedSite, 'slug' | 'content'>) =>
  call(send('PUT', `/api/sites/${id}`, change), savedSiteSchema);

export const deleteSite = (id: string) =>
  call(fetch(`/api/sites/${id}`, { method: 'DELETE' }), z.null());

export const saveVideo = (id: string, project: Project) =>
  call(send('PUT', `/api/videos/${id}`, { project }), z.object({ updatedAt: z.string() }));

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
