import { z } from 'zod';
import { rsvpReplySchema, type StoredRsvp } from '@/sites/rsvp';

export const EDIT_KEY_HEADER = 'x-edit-key';

const problemSchema = z.object({ problem: z.string() });

const readProblem = async (response: Response): Promise<string> => {
  const parsed = problemSchema.safeParse(await response.json().catch(() => null));
  return parsed.success ? parsed.data.problem : `Request failed with ${response.status}.`;
};

export type ApiResult<T> = { ok: true; value: T } | { ok: false; problem: string };

const call = async <T>(request: Promise<Response>, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  try {
    const response = await request;
    if (!response.ok) {
      return { ok: false, problem: await readProblem(response) };
    }
    const parsed = schema.safeParse(await response.json());
    return parsed.success
      ? { ok: true, value: parsed.data }
      : { ok: false, problem: 'Unexpected response.' };
  } catch {
    return { ok: false, problem: 'Could not reach the server.' };
  }
};

const json = (method: string, body: unknown, headers: Record<string, string> = {}) => ({
  method,
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

export const checkSlug = (slug: string) =>
  call(
    fetch(`/api/sites?slug=${encodeURIComponent(slug)}`),
    z.object({ available: z.boolean(), problem: z.string().nullable() }),
  );

export const createSite = (slug: string, templateId: string, content: unknown) =>
  call(
    fetch('/api/sites', json('POST', { slug, templateId, content })),
    z.object({ slug: z.string(), editKey: z.string() }),
  );

export const saveSite = (slug: string, editKey: string, content: unknown) =>
  call(
    fetch(`/api/sites/${slug}`, json('PUT', { content }, { [EDIT_KEY_HEADER]: editKey })),
    z.object({ updatedAt: z.string() }),
  );

export const listReplies = (slug: string, editKey: string): Promise<ApiResult<StoredRsvp[]>> =>
  call(
    fetch(`/api/sites/${slug}/rsvp`, { headers: { [EDIT_KEY_HEADER]: editKey } }),
    z.object({ replies: z.array(rsvpReplySchema.extend({ receivedAt: z.string() })) }),
  ).then((result) => (result.ok ? { ok: true, value: result.value.replies } : result));

export const uploadAsset = (blob: Blob) =>
  call(
    fetch('/api/site-assets', {
      method: 'POST',
      headers: { 'content-type': blob.type },
      body: blob,
    }),
    z.object({ url: z.string() }),
  );
