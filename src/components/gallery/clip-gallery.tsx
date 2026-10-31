'use client';

import { SearchX } from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_FILTERS,
  type FacetCounts,
  type GalleryFilters,
  type GalleryMeta,
} from '@/lib/gallery-filters';
import { FilterBar } from './filter-bar';
import { MasonryGrid } from './masonry-grid';

export interface VideoGalleryItem {
  kind: 'video';
  meta: GalleryMeta;
  video: string;
  firstFrame: string;
  width: number;
  height: number;
}

export interface PosterGalleryItem {
  kind: 'poster';
  meta: GalleryMeta;
  preview: string;
  width: number;
  height: number;
}

export interface SiteGalleryItem {
  kind: 'site';
  meta: GalleryMeta;
  preview: string;
  width: number;
  height: number;
}

export type GalleryItem = VideoGalleryItem | PosterGalleryItem | SiteGalleryItem;

export interface GalleryPage {
  items: GalleryItem[];
  nextCursor: number | null;
  total: number;
  shown: number;
  counts: FacetCounts;
}

type GalleryTile = ComponentType<GalleryItem>;

const galleryItemKey = (item: GalleryItem): string => `${item.kind}-${item.meta.id}`;

const heightRatio = (item: GalleryItem): number => item.height / item.width;

interface ClipGalleryProps {
  items: readonly GalleryItem[];
  total: number;
  shown: number;
  counts: FacetCounts;
  onEndReached: () => void;
  Tile: GalleryTile;
  filters: GalleryFilters;
  query: string;
  onQueryChange: (query: string) => void;
  onChange: (next: GalleryFilters) => void;
}

export const ClipGallery = ({
  items,
  total,
  shown,
  counts,
  onEndReached,
  Tile,
  filters,
  query,
  onQueryChange,
  onChange,
}: ClipGalleryProps) => {
  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        filters={filters}
        query={query}
        counts={counts}
        total={total}
        shown={shown}
        onQueryChange={onQueryChange}
        onChange={onChange}
      />
      {shown === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 px-6 py-16 text-center">
          <SearchX className="size-6 text-muted-foreground" />
          <p className="font-medium text-sm">Nothing matches these filters.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onQueryChange('');
              onChange({ ...DEFAULT_FILTERS, sort: filters.sort });
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <MasonryGrid
          items={items}
          itemKey={galleryItemKey}
          heightRatio={heightRatio}
          Tile={Tile}
          onEndReached={onEndReached}
        />
      )}
    </div>
  );
};
