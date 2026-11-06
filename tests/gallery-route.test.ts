import { describe, expect, it } from 'bun:test';
import { GET } from '@/app/api/gallery/route';
import type { GalleryPage } from '@/components/gallery/clip-gallery';

const fetchPage = async (search: string): Promise<{ page: GalleryPage; response: Response }> => {
  const response = GET(new Request(`https://clips.test/api/gallery${search}`));
  return { page: await response.json(), response };
};

const ids = (page: GalleryPage): string[] =>
  page.items.map((item) => `${item.kind}-${item.meta.id}`);

const pagesFrom = async (cursor: number): Promise<GalleryPage[]> => {
  const { page } = await fetchPage(`?cursor=${cursor}`);
  return page.nextCursor === null ? [page] : [page, ...(await pagesFrom(page.nextCursor))];
};

describe('GET /api/gallery', () => {
  it('is never stored by a shared cache, which would ignore the query string', async () => {
    const { response } = await fetchPage('');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('applies the search and filters from the query string', async () => {
    const { page: search } = await fetchPage(`?${new URLSearchParams({ q: 'dot ring' })}`);
    expect(search.items.map((item) => item.meta.id).sort()).toEqual([
      'dot-ring-logo-reveal-a',
      'dot-ring-logo-reveal-b',
      'dot-ring-logo-reveal-c',
    ]);
    const { page: dark } = await fetchPage('?theme=dark');
    expect(dark.items.length).toBeGreaterThan(0);
    expect(dark.items.every((item) => item.meta.theme === 'dark')).toBe(true);
    const { page: posters } = await fetchPage('?type=poster');
    expect(posters.items).toEqual([]);
    expect(posters.counts.kinds.poster ?? 0).toBe(posters.shown);
  });

  it('follows the cursor to the end without repeating an item', async () => {
    const pages = await pagesFrom(0);
    const seen = pages.flatMap(ids);
    expect(new Set(seen).size).toBe(seen.length);
    expect(seen).toHaveLength(pages[0]?.total ?? -1);
  });
});
