import { describe, expect, it } from 'bun:test';
import { GET } from '@/app/api/gallery/route';
import type { GalleryPage } from '@/components/gallery/clip-gallery';
import { GALLERY_PAGE_SIZE } from '@/lib/gallery-catalog';

const fetchPage = async (search: string): Promise<{ page: GalleryPage; response: Response }> => {
  const response = GET(new Request(`https://clips.test/api/gallery${search}`));
  return { page: await response.json(), response };
};

const ids = (page: GalleryPage): string[] =>
  page.items.map((item) => `${item.kind}-${item.meta.id}`);

describe('GET /api/gallery', () => {
  it('is never stored by a shared cache, which would ignore the query string', async () => {
    const { response } = await fetchPage('');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('returns the next page for a cursor without repeating items', async () => {
    const { page: first } = await fetchPage('');
    const { page: second } = await fetchPage(`?cursor=${GALLERY_PAGE_SIZE}`);
    expect(second.items).toHaveLength(GALLERY_PAGE_SIZE);
    expect(ids(second).filter((id) => ids(first).includes(id))).toEqual([]);
  });

  it('applies the search and filters from the query string', async () => {
    const { page: search } = await fetchPage(`?${new URLSearchParams({ q: 'phone wall' })}`);
    expect(search.items.map((item) => item.meta.title)).toEqual(['Phone Wall']);
    const { page: posters } = await fetchPage('?type=poster');
    expect(posters.items.every((item) => item.kind === 'poster')).toBe(true);
    expect(posters.counts.kinds.poster).toBe(posters.shown);
  });

  it('never repeats an item across every page of the library', async () => {
    const { page: first } = await fetchPage('');
    const cursors = Array.from(
      { length: Math.ceil(first.total / GALLERY_PAGE_SIZE) },
      (_, index) => index * GALLERY_PAGE_SIZE,
    );
    const pages = await Promise.all(cursors.map((cursor) => fetchPage(`?cursor=${cursor}`)));
    const seen = pages.flatMap(({ page }) => ids(page));
    expect(new Set(seen).size).toBe(seen.length);
    expect(seen).toHaveLength(first.total);
    expect(pages.at(-1)?.page.nextCursor).toBeNull();
  });
});
