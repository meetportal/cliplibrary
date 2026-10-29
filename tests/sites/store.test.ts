import { describe, expect, it } from 'bun:test';
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { createSiteStore } from '@/sites/store';
import { emeraldRoseDefaults } from '@/sites/templates/weddings/emerald-rose';

const freshStore = () =>
  createSiteStore(
    createStorage({ driver: memoryDriver() }),
    () => new Date('2026-10-28T12:00:00Z'),
  );

const publish = async (store: ReturnType<typeof freshStore>, slug = 'rachelle-and-thomas') => {
  const created = await store.create({
    slug,
    templateId: 'emerald-rose',
    content: emeraldRoseDefaults,
  });
  if (!created.ok) {
    throw new Error(created.problem);
  }
  return created.value.editKey;
};

describe('site store', () => {
  it('publishes a site and reads it back without its key', async () => {
    const store = freshStore();
    await publish(store);
    const site = await store.read('rachelle-and-thomas');
    expect(site?.templateId).toBe('emerald-rose');
    expect(site?.content).toEqual(emeraldRoseDefaults);
    expect(site !== null && 'keyHash' in site).toBe(false);
  });

  it('refuses a taken, malformed or reserved address', async () => {
    const store = freshStore();
    await publish(store);
    const again = await store.create({
      slug: 'rachelle-and-thomas',
      templateId: 'emerald-rose',
      content: emeraldRoseDefaults,
    });
    expect(again).toMatchObject({ ok: false, status: 409 });
    expect(await store.availability('Bad Slug')).not.toBeNull();
    expect(await store.availability('edit')).not.toBeNull();
    expect(await store.availability('free-name')).toBeNull();
  });

  it('rejects content that breaks the template schema or holds object urls', async () => {
    const store = freshStore();
    const broken = await store.create({
      slug: 'broken',
      templateId: 'emerald-rose',
      content: { ...emeraldRoseDefaults, colors: { primary: 'green' } },
    });
    expect(broken).toMatchObject({ ok: false, status: 400 });
    const local = await store.create({
      slug: 'local-photo',
      templateId: 'emerald-rose',
      content: {
        ...emeraldRoseDefaults,
        photos: { ...emeraldRoseDefaults.photos, hero: 'blob:http://localhost/1' },
      },
    });
    expect(local).toMatchObject({ ok: false, status: 400 });
  });

  it('only saves edits with the edit key', async () => {
    const store = freshStore();
    const editKey = await publish(store);
    const renamed = {
      ...emeraldRoseDefaults,
      couple: { ...emeraldRoseDefaults.couple, firstName: 'Maya' },
    };
    expect(await store.update('rachelle-and-thomas', 'wrong', renamed)).toMatchObject({
      ok: false,
      status: 403,
    });
    expect((await store.update('rachelle-and-thomas', editKey, renamed)).ok).toBe(true);
    const site = await store.read('rachelle-and-thomas');
    expect(site?.content).toMatchObject({ couple: { firstName: 'Maya' } });
  });

  it('collects RSVPs that only the owner can list', async () => {
    const store = freshStore();
    const editKey = await publish(store);
    const reply = { name: 'Ana', attending: true, guests: 2, dietary: '', message: 'Yay' };
    expect((await store.addRsvp('rachelle-and-thomas', reply)).ok).toBe(true);
    expect(await store.addRsvp('rachelle-and-thomas', { ...reply, name: ' ' })).toMatchObject({
      ok: false,
      status: 400,
    });
    expect(await store.addRsvp('missing-site', reply)).toMatchObject({ ok: false, status: 404 });
    expect(await store.listRsvps('rachelle-and-thomas', 'wrong')).toMatchObject({ ok: false });
    expect(await store.listRsvps('rachelle-and-thomas', editKey)).toEqual({
      ok: true,
      value: [{ ...reply, receivedAt: '2026-10-28T12:00:00.000Z' }],
    });
  });

  it('stores uploaded images by id', async () => {
    const store = freshStore();
    const stored = await store.putAsset(new Uint8Array([1, 2, 3]), 'image/png');
    if (!stored.ok) {
      throw new Error(stored.problem);
    }
    expect(await store.getAsset(stored.value)).toMatchObject({ contentType: 'image/png' });
    expect(await store.putAsset(new Uint8Array([1]), 'text/html')).toMatchObject({ status: 415 });
    expect(await store.getAsset('../etc')).toBeNull();
  });
});
