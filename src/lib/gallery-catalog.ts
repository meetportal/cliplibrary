import 'server-only';
import type { GalleryItem, GalleryPage } from '@/components/gallery/clip-gallery';
import { facetCounts, filterClips, type GalleryFilters } from '@/lib/gallery-filters';
import { listClips } from './clips';
import { listPosters } from './posters';
import { listSites } from './sites';

export const GALLERY_PAGE_SIZE = 48;

let catalog: readonly GalleryItem[] | null = null;

const galleryCatalog = (): readonly GalleryItem[] => {
  if (catalog === null) {
    catalog = [...listClips(), ...listPosters(), ...listSites()];
  }
  return catalog;
};

export const galleryPage = (
  filters: GalleryFilters,
  cursor = 0,
  limit = GALLERY_PAGE_SIZE,
): GalleryPage => {
  const items = galleryCatalog();
  const matched = filterClips(items, filters);
  const end = cursor + limit;
  return {
    items: matched.slice(cursor, end),
    nextCursor: end < matched.length ? end : null,
    total: items.length,
    shown: matched.length,
    counts: facetCounts(items, filters),
  };
};
