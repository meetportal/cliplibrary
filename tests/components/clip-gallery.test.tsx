import { describe, expect, it } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { ClipGallery, type GalleryItem } from '@/components/gallery/clip-gallery';
import { galleryPage } from '@/lib/gallery-catalog';
import { DEFAULT_FILTERS, type GalleryFilters } from '@/lib/gallery-filters';

const PAGE_SIZE = 2;
const DOT_RING = ['Dot Ring Logo Reveal'];

const StubTile = ({ meta }: GalleryItem) => <article>{meta.title}</article>;

const Harness = ({ initial = DEFAULT_FILTERS }: { initial?: GalleryFilters }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState(initial.query);
  const [pages, setPages] = useState(1);
  const effective = { ...filters, query };
  const page = galleryPage(effective, 0, pages * PAGE_SIZE);
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
  const height = window.innerHeight;
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 1200 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100_000 });
  try {
    run();
  } finally {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
    if (width !== undefined) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', width);
    }
  }
};

describe('galleryPage', () => {
  it('pages through the filtered library with a cursor', () => {
    const first = galleryPage(DEFAULT_FILTERS, 0, PAGE_SIZE);
    expect(first.items).toHaveLength(PAGE_SIZE);
    expect(first.nextCursor).toBe(PAGE_SIZE);
    expect(first.shown).toBe(first.total);
    expect(galleryPage(DEFAULT_FILTERS).nextCursor).toBeNull();
    const second = galleryPage(DEFAULT_FILTERS, PAGE_SIZE, PAGE_SIZE);
    expect(second.items[0]?.meta.id).not.toBe(first.items[0]?.meta.id);
    const last = galleryPage(DEFAULT_FILTERS, first.total - 1);
    expect(last.items).toHaveLength(1);
    expect(last.nextCursor).toBeNull();
  });

  it('filters, counts and ends early for a narrow search', () => {
    const page = galleryPage({ ...DEFAULT_FILTERS, query: 'dot ring' });
    expect(page.items.map((item) => item.meta.title).sort()).toEqual(DOT_RING);
    expect(page.nextCursor).toBeNull();
    expect(page.counts.kinds.video).toBe(DOT_RING.length);
  });
});

describe('ClipGallery', () => {
  it('pages in the rest of the library as the grid reaches its end', () => {
    withWideGrid(() => {
      render(<Harness />);
    });
    const total = galleryPage(DEFAULT_FILTERS).total;
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText(`${total} items`)).toBeInTheDocument();
    expect(total).toBeGreaterThan(PAGE_SIZE);
    expect(screen.getAllByRole('article')).toHaveLength(total);
  });

  it('narrows the grid as you type a search', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search the library' }), {
      target: { value: 'dot ring' },
    });
    expect(
      screen
        .getAllByRole('article')
        .map((node) => node.textContent)
        .sort(),
    ).toEqual(DOT_RING);
    expect(screen.getByText(/^1 of \d+ items$/)).toBeInTheDocument();
  });

  it('shows removable chips for active filters and an empty state', () => {
    render(<Harness initial={{ ...DEFAULT_FILTERS, category: 'brand', tags: ['phone'] }} />);
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
