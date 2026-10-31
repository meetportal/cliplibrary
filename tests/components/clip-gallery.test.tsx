import { describe, expect, it } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { ClipGallery, type GalleryItem } from '@/components/gallery/clip-gallery';
import { GALLERY_PAGE_SIZE, galleryPage } from '@/lib/gallery-catalog';
import { DEFAULT_FILTERS, type GalleryFilters } from '@/lib/gallery-filters';

const StubTile = ({ meta }: GalleryItem) => <article>{meta.title}</article>;

const Harness = ({ initial = DEFAULT_FILTERS }: { initial?: GalleryFilters }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState(initial.query);
  const [pages, setPages] = useState(1);
  const effective = { ...filters, query };
  const page = galleryPage(effective, 0, pages * GALLERY_PAGE_SIZE);
  return (
    <ClipGallery
      items={page.items}
      total={page.total}
      shown={page.shown}
      counts={page.counts}
      onEndReached={() => {
        if (page.nextCursor !== null) {
          setPages((count) => count + 1);
        }
      }}
      Tile={StubTile}
      filters={filters}
      query={query}
      onQueryChange={setQuery}
      onChange={setFilters}
    />
  );
};

const withWideGrid = (run: () => void) => {
  const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 1200 });
  try {
    run();
  } finally {
    if (width !== undefined) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', width);
    }
  }
};

describe('galleryPage', () => {
  it('pages through the filtered library with a cursor', () => {
    const first = galleryPage(DEFAULT_FILTERS);
    expect(first.items).toHaveLength(GALLERY_PAGE_SIZE);
    expect(first.nextCursor).toBe(GALLERY_PAGE_SIZE);
    expect(first.shown).toBe(first.total);
    const second = galleryPage(DEFAULT_FILTERS, GALLERY_PAGE_SIZE);
    expect(second.items[0]?.meta.id).not.toBe(first.items[0]?.meta.id);
    const last = galleryPage(DEFAULT_FILTERS, first.total - 1);
    expect(last.items).toHaveLength(1);
    expect(last.nextCursor).toBeNull();
  });

  it('filters, counts and ends early for a narrow search', () => {
    const page = galleryPage({ ...DEFAULT_FILTERS, query: 'phone wall' });
    expect(page.items.map((item) => item.meta.title)).toEqual(['Phone Wall']);
    expect(page.nextCursor).toBeNull();
    expect(page.counts.kinds.video).toBe(1);
  });
});

describe('ClipGallery', () => {
  it('starts with one page of tiles and only mounts the ones near the viewport', () => {
    withWideGrid(() => {
      render(<Harness />);
    });
    const total = galleryPage(DEFAULT_FILTERS).total;
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText(`${total} items`)).toBeInTheDocument();
    const mounted = screen.getAllByRole('article').length;
    expect(mounted).toBeGreaterThan(0);
    expect(mounted).toBeLessThanOrEqual(GALLERY_PAGE_SIZE);
  });

  it('narrows the grid as you type a search', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search the library' }), {
      target: { value: 'phone wall' },
    });
    expect(screen.getAllByRole('article').map((node) => node.textContent)).toEqual(['Phone Wall']);
    expect(screen.getByText(/^1 of \d+ items$/)).toBeInTheDocument();
  });

  it('shows removable chips for active filters and an empty state', () => {
    render(<Harness initial={{ ...DEFAULT_FILTERS, category: 'transitions', tags: ['phone'] }} />);
    expect(screen.getByText('Nothing matches these filters.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter #phone' }));
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByText(/^\d+ items$/)).toBeInTheDocument();
  });

  it('orders the grid by name when sorted by name', () => {
    render(<Harness initial={{ ...DEFAULT_FILTERS, sort: 'name-asc' }} />);
    const titles = screen.getAllByRole('article').map((node) => node.textContent ?? '');
    expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right)));
  });
});
