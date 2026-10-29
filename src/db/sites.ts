import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { database } from './client';
import { isUniqueViolation } from './errors';
import { sites } from './schema';

export type SiteRow = typeof sites.$inferSelect;

type SiteFields = Pick<SiteRow, 'slug' | 'templateId' | 'content'>;

export type SiteWrite = { ok: true; site: SiteRow } | { ok: false; reason: 'missing' | 'taken' };

export const SLUG_TAKEN = 'That address is already taken. Pick another one.';

export const createSite = async (ownerId: string, site: SiteFields): Promise<SiteWrite> => {
  const [row] = await database()
    .insert(sites)
    .values({ ownerId, ...site })
    .onConflictDoNothing({ target: sites.slug })
    .returning();
  return row === undefined ? { ok: false, reason: 'taken' } : { ok: true, site: row };
};

export const updateSite = async (
  ownerId: string,
  id: string,
  change: Pick<SiteFields, 'slug' | 'content'>,
): Promise<SiteWrite> => {
  try {
    const [row] = await database()
      .update(sites)
      .set({ ...change, draft: null, updatedAt: new Date() })
      .where(and(eq(sites.id, id), eq(sites.ownerId, ownerId)))
      .returning();
    return row === undefined ? { ok: false, reason: 'missing' } : { ok: true, site: row };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, reason: 'taken' };
    }
    throw error;
  }
};

export const saveSiteDraft = async (
  ownerId: string,
  id: string,
  draft: Record<string, unknown>,
): Promise<boolean> =>
  (
    await database()
      .update(sites)
      .set({ draft, updatedAt: new Date() })
      .where(and(eq(sites.id, id), eq(sites.ownerId, ownerId)))
      .returning({ id: sites.id })
  ).length > 0;

export const editingContent = (site: SiteRow): Record<string, unknown> =>
  site.draft ?? site.content;

const findSite = async (id: string): Promise<SiteRow | null> =>
  (await database().select().from(sites).where(eq(sites.id, id)))[0] ?? null;

export const findOwnedSite = async (ownerId: string, id: string): Promise<SiteRow | null> => {
  const site = await findSite(id);
  return site?.ownerId === ownerId ? site : null;
};

export const findSiteBySlug = async (slug: string): Promise<SiteRow | null> =>
  (await database().select().from(sites).where(eq(sites.slug, slug)))[0] ?? null;

export const findLatestOwnedSite = async (
  ownerId: string,
  templateId: string,
): Promise<SiteRow | null> =>
  (
    await database()
      .select()
      .from(sites)
      .where(and(eq(sites.ownerId, ownerId), eq(sites.templateId, templateId)))
      .orderBy(desc(sites.updatedAt))
      .limit(1)
  )[0] ?? null;

export const listOwnedSites = (ownerId: string): Promise<SiteRow[]> =>
  database().select().from(sites).where(eq(sites.ownerId, ownerId)).orderBy(desc(sites.updatedAt));

export const deleteSite = async (ownerId: string, id: string): Promise<boolean> =>
  (
    await database()
      .delete(sites)
      .where(and(eq(sites.id, id), eq(sites.ownerId, ownerId)))
      .returning({ id: sites.id })
  ).length > 0;
