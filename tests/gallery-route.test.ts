import { describe, expect, it } from 'bun:test';
import { GET } from '@/app/api/gallery/route';
import type { GalleryPage } from '@/components/gallery/clip-gallery';

const fetchPage = async (search: string): Promise<{ page: GalleryPage; response: Response }> => {
  const response = GET(new Request(`https://clips.test/api/gallery${search}`));
  return { page: await response.json(), response };
};

describe('GET /api/gallery', () => {
  it('is never stored by a shared cache, which would ignore the query string', async () => {
    const { response } = await fetchPage('');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
