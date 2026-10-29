import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Storage } from 'unstorage';
import { z } from 'zod';
import { rsvpReplySchema, type StoredRsvp } from './rsvp';
import { slugProblem } from './slug';
import { findSiteTemplate } from './templates';

const MAX_CONTENT_BYTES = 1_500_000;
export const MAX_ASSET_BYTES = 8_000_000;
export const ASSET_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

const recordSchema = z.object({
  slug: z.string(),
  templateId: z.string(),
  content: z.unknown(),
  keyHash: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type SiteRecord = z.infer<typeof recordSchema>;

export type PublishedSite = Omit<SiteRecord, 'keyHash'>;

export type StoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; problem: string };

const fail = (status: number, problem: string): { ok: false; status: number; problem: string } => ({
  ok: false,
  status,
  problem,
});

const hashKey = (key: string): string => createHash('sha256').update(key).digest('hex');

const sameHash = (left: string, right: string): boolean => {
  const a = Buffer.from(left, 'hex');
  const b = Buffer.from(right, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
};

const holdsObjectUrl = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.startsWith('blob:');
  }
  if (Array.isArray(value)) {
    return value.some(holdsObjectUrl);
  }
  return typeof value === 'object' && value !== null && Object.values(value).some(holdsObjectUrl);
};

const checkContent = (templateId: string, content: unknown): StoreResult<unknown> => {
  const template = findSiteTemplate(templateId);
  if (template === undefined) {
    return fail(400, 'Unknown template.');
  }
  const parsed = template.schema.safeParse(content);
  if (!parsed.success) {
    return fail(400, 'The website content is not valid for this template.');
  }
  if (holdsObjectUrl(parsed.data)) {
    return fail(400, 'Upload local photos before saving.');
  }
  if (JSON.stringify(parsed.data).length > MAX_CONTENT_BYTES) {
    return fail(413, 'The website is too large to save.');
  }
  return { ok: true, value: parsed.data };
};

const siteKey = (slug: string): string => `site:${slug}`;
const rsvpKey = (slug: string): string => `rsvp:${slug}`;

const publicView = ({ keyHash: _keyHash, ...site }: SiteRecord): PublishedSite => site;

export const createSiteStore = (storage: Storage, now: () => Date = () => new Date()) => {
  const readRecord = async (slug: string): Promise<SiteRecord | null> => {
    if (slugProblem(slug) !== null) {
      return null;
    }
    const parsed = recordSchema.safeParse(await storage.getItem(siteKey(slug)));
    return parsed.success ? parsed.data : null;
  };

  const authorize = async (slug: string, editKey: string): Promise<StoreResult<SiteRecord>> => {
    const record = await readRecord(slug);
    if (record === null) {
      return fail(404, 'This website does not exist.');
    }
    if (!sameHash(record.keyHash, hashKey(editKey))) {
      return fail(403, 'This edit link is not valid.');
    }
    return { ok: true, value: record };
  };

  return {
    async availability(slug: string): Promise<string | null> {
      const problem = slugProblem(slug);
      if (problem !== null) {
        return problem;
      }
      return (await storage.hasItem(siteKey(slug))) ? 'That address is already taken.' : null;
    },

    async create(input: {
      slug: string;
      templateId: string;
      content: unknown;
    }): Promise<StoreResult<{ slug: string; editKey: string }>> {
      const problem = await this.availability(input.slug);
      if (problem !== null) {
        return fail(problem.includes('taken') ? 409 : 400, problem);
      }
      const content = checkContent(input.templateId, input.content);
      if (!content.ok) {
        return content;
      }
      const editKey = randomBytes(24).toString('base64url');
      const stamp = now().toISOString();
      const record: SiteRecord = {
        slug: input.slug,
        templateId: input.templateId,
        content: content.value,
        keyHash: hashKey(editKey),
        createdAt: stamp,
        updatedAt: stamp,
      };
      await storage.setItem(siteKey(input.slug), record);
      return { ok: true, value: { slug: input.slug, editKey } };
    },

    async read(slug: string): Promise<PublishedSite | null> {
      const record = await readRecord(slug);
      return record === null ? null : publicView(record);
    },

    async canEdit(slug: string, editKey: string): Promise<boolean> {
      return (await authorize(slug, editKey)).ok;
    },

    async update(
      slug: string,
      editKey: string,
      content: unknown,
    ): Promise<StoreResult<PublishedSite>> {
      const access = await authorize(slug, editKey);
      if (!access.ok) {
        return access;
      }
      const checked = checkContent(access.value.templateId, content);
      if (!checked.ok) {
        return checked;
      }
      const record = { ...access.value, content: checked.value, updatedAt: now().toISOString() };
      await storage.setItem(siteKey(slug), record);
      return { ok: true, value: publicView(record) };
    },

    async addRsvp(slug: string, reply: unknown): Promise<StoreResult<StoredRsvp>> {
      if ((await readRecord(slug)) === null) {
        return fail(404, 'This website does not exist.');
      }
      const parsed = rsvpReplySchema.safeParse(reply);
      if (!parsed.success) {
        return fail(400, 'Please fill in your name.');
      }
      const stored: StoredRsvp = { ...parsed.data, receivedAt: now().toISOString() };
      const replies = await this.readRsvps(slug);
      await storage.setItem(rsvpKey(slug), [...replies, stored]);
      return { ok: true, value: stored };
    },

    async readRsvps(slug: string): Promise<StoredRsvp[]> {
      const raw = await storage.getItem(rsvpKey(slug));
      const parsed = z
        .array(rsvpReplySchema.extend({ receivedAt: z.string() }))
        .safeParse(raw ?? []);
      return parsed.success ? parsed.data : [];
    },

    async listRsvps(slug: string, editKey: string): Promise<StoreResult<StoredRsvp[]>> {
      const access = await authorize(slug, editKey);
      return access.ok ? { ok: true, value: await this.readRsvps(slug) } : access;
    },

    async putAsset(bytes: Uint8Array, contentType: string): Promise<StoreResult<string>> {
      if (!ASSET_TYPES.some((type) => type === contentType)) {
        return fail(415, 'Upload a JPG, PNG, WebP or GIF image.');
      }
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_ASSET_BYTES) {
        return fail(413, 'Images must be under 8 MB.');
      }
      const id = randomBytes(12).toString('hex');
      await storage.setItemRaw(`asset:${id}`, bytes);
      await storage.setItem(`asset-type:${id}`, contentType);
      return { ok: true, value: id };
    },

    async getAsset(id: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
      if (!/^[a-f0-9]{24}$/.test(id)) {
        return null;
      }
      const [bytes, contentType] = await Promise.all([
        storage.getItemRaw<Uint8Array>(`asset:${id}`),
        storage.getItem<string>(`asset-type:${id}`),
      ]);
      return bytes === null || typeof contentType !== 'string' ? null : { bytes, contentType };
    },
  };
};

export type SiteStore = ReturnType<typeof createSiteStore>;
