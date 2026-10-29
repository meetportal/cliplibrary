import { beforeEach, describe, expect, it } from 'bun:test';
import {
  createSite,
  deleteSite,
  editingContent,
  findLatestOwnedSite,
  findOwnedSite,
  findSiteBySlug,
  listOwnedSites,
  saveSiteDraft,
  updateSite,
} from '@/db/sites';
import { resetTestDatabase } from '../test-database';

const site = { slug: 'maya-and-daniel', templateId: 'emerald-rose', content: { title: 'M & D' } };

beforeEach(resetTestDatabase);

describe('site store', () => {
  it('keeps every address unique', async () => {
    const created = await createSite('user_a', site);
    expect(created.ok).toBe(true);
    expect(await createSite('user_b', site)).toEqual({ ok: false, reason: 'taken' });
    expect((await findSiteBySlug('maya-and-daniel'))?.ownerId).toBe('user_a');
  });

  it('lets only the owner change or delete a website', async () => {
    const created = await createSite('user_a', site);
    if (!created.ok) {
      throw new Error('not created');
    }
    const { id } = created.site;
    const change = { slug: 'maya-daniel-2027', content: { title: 'Maya & Daniel' } };
    expect(await updateSite('user_b', id, change)).toEqual({ ok: false, reason: 'missing' });
    expect(await findOwnedSite('user_b', id)).toBeNull();
    const updated = await updateSite('user_a', id, change);
    expect(updated.ok && updated.site).toMatchObject({ id, ...change });
    expect(await findSiteBySlug('maya-and-daniel')).toBeNull();
    expect(await deleteSite('user_b', id)).toBe(false);
    expect(await deleteSite('user_a', id)).toBe(true);
    expect(await listOwnedSites('user_a')).toEqual([]);
  });

  it('refuses to move a website onto a taken address', async () => {
    await createSite('user_b', { ...site, slug: 'taken-address' });
    const created = await createSite('user_a', site);
    if (!created.ok) {
      throw new Error('not created');
    }
    expect(
      await updateSite('user_a', created.site.id, { slug: 'taken-address', content: {} }),
    ).toEqual({ ok: false, reason: 'taken' });
  });

  it('keeps unpublished edits in a draft until they are published', async () => {
    const created = await createSite('user_a', site);
    if (!created.ok) {
      throw new Error('not created');
    }
    const { id } = created.site;
    expect(await saveSiteDraft('user_b', id, { title: 'Stolen' })).toBe(false);
    expect(await saveSiteDraft('user_a', id, { title: 'Draft' })).toBe(true);
    const drafted = await findOwnedSite('user_a', id);
    expect(drafted?.content).toEqual({ title: 'M & D' });
    expect(drafted === null ? null : editingContent(drafted)).toEqual({ title: 'Draft' });
    expect((await findLatestOwnedSite('user_a', 'emerald-rose'))?.id).toBe(id);
    expect(await findLatestOwnedSite('user_a', 'other-template')).toBeNull();
    const published = await updateSite('user_a', id, {
      slug: site.slug,
      content: { title: 'Draft' },
    });
    expect(published.ok && published.site).toMatchObject({
      content: { title: 'Draft' },
      draft: null,
    });
  });
});
