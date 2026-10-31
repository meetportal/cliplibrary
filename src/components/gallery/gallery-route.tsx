'use client';

import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type GalleryFilters, parseFilters, serializeFilters } from '@/lib/gallery-filters';
import { replaceLocationSearch, useLocationSearch } from '@/lib/use-location-search';
import { ClipGallery, type GalleryPage } from './clip-gallery';
import { GalleryTile } from './gallery-tile';

const QUERY_DEBOUNCE_MS = 200;

const fetchGalleryPage = async (search: string, cursor: number): Promise<GalleryPage> => {
  const params = new URLSearchParams(search);
  params.set('cursor', String(cursor));
  const response = await fetch(`/api/gallery?${params}`);
  if (!response.ok) {
    throw new Error(`Gallery page failed with ${response.status}`);
  }
  return response.json();
};

const Gallery = ({ initialPage }: { initialPage: GalleryPage }) => {
  const search = useLocationSearch();
  const filters = useMemo(() => parseFilters(new URLSearchParams(search)), [search]);
  const [draft, setDraft] = useState<string | null>(null);
  const query = draft ?? filters.query;
  const key = serializeFilters(filters);

  const { data, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['gallery', key],
      queryFn: ({ pageParam }) => fetchGalleryPage(key, pageParam),
      initialPageParam: 0,
      getNextPageParam: (page) => page.nextCursor ?? undefined,
      initialData: () => (key === '' ? { pages: [initialPage], pageParams: [0] } : undefined),
      placeholderData: keepPreviousData,
      staleTime: Number.POSITIVE_INFINITY,
    });
  const pages = data?.pages ?? [initialPage];
  const summary = pages[0] ?? initialPage;
  const items = useMemo(() => pages.flatMap((page) => page.items), [pages]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage().catch(() => undefined);
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const navigate = useCallback((next: GalleryFilters) => {
    replaceLocationSearch(serializeFilters(next));
    setDraft(null);
  }, []);

  useEffect(() => {
    if (draft === null || draft === filters.query) {
      return;
    }
    const timer = window.setTimeout(
      () => navigate({ ...filters, query: draft }),
      QUERY_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [draft, filters, navigate]);

  return (
    <ClipGallery
      items={items}
      total={summary.total}
      shown={summary.shown}
      counts={summary.counts}
      onEndReached={loadMore}
      Tile={GalleryTile}
      filters={filters}
      query={query}
      onQueryChange={setDraft}
      onChange={(next) => navigate({ ...next, query })}
    />
  );
};

export const ClipGalleryRoute = ({ initialPage }: { initialPage: GalleryPage }) => {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <Gallery initialPage={initialPage} />
    </QueryClientProvider>
  );
};
