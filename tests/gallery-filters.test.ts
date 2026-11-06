import { describe, expect, it } from 'bun:test';
import {
  DEFAULT_FILTERS,
  facetCounts,
  filterClips,
  formatDuration,
  type GalleryMeta,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
} from '@/lib/gallery-filters';
import { videoMeta } from '@/lib/video-meta';
import { CLIP_REGISTRY } from '@/schemas';

const items = CLIP_REGISTRY.map((meta) => ({ meta: videoMeta(meta) }));
const ids = (list: { meta: GalleryMeta }[]) => list.map((item) => item.meta.id);
const CHEVRON = ['chevron-mark-assemble-a', 'chevron-mark-assemble-b', 'chevron-mark-assemble-c'];
const DOT_RING = ['dot-ring-logo-reveal-a', 'dot-ring-logo-reveal-b', 'dot-ring-logo-reveal-c'];

describe('gallery filters', () => {
  const search = (query: string) => ids(filterClips(items, { ...DEFAULT_FILTERS, query })).sort();

  it('requires every search token across title, tags, category and description', () => {
    expect(search('chevron FLIP')).toEqual(CHEVRON);
    expect(search('pink ring')).toEqual(DOT_RING);
    expect(search('dot ring flip')).toEqual([]);
  });

  it('forgives typos, completes prefixes and knows category synonyms', () => {
    expect(search('chevrom')).toEqual(CHEVRON);
    expect(search('chev')).toEqual(CHEVRON);
    expect(search('wordmark')).toEqual([...CHEVRON, ...DOT_RING]);
  });

  it('filters by category, every selected tag and theme together', () => {
    const result = filterClips(items, {
      ...DEFAULT_FILTERS,
      category: 'brand',
      tags: ['logo', 'draw'],
      theme: 'dark',
    });
    expect(ids(result)).toEqual(['dot-ring-logo-reveal-b']);
  });

  it('counts each facet against the other active filters', () => {
    const { categories, themes, tags } = facetCounts(items, { ...DEFAULT_FILTERS, theme: 'dark' });
    const dark = CLIP_REGISTRY.filter((meta) => meta.theme === 'dark').length;
    expect(categories.brand).toBe(dark);
    expect(tags.draw).toBe(1);
    expect(themes.light).toBe(CLIP_REGISTRY.length - dark);
  });

  it('reports active filters and formats durations', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, query: ' x ' })).toBe(true);
    const meta = CLIP_REGISTRY.find((entry) => entry.id === 'dot-ring-logo-reveal-a');
    expect(meta === undefined ? '' : formatDuration(videoMeta(meta))).toBe('6s');
  });

  it('round-trips filters through the URL and drops defaults', () => {
    const filters = {
      query: 'phone',
      kind: 'video' as const,
      category: 'phone-layouts' as const,
      tags: ['3d' as const, 'grid' as const],
      theme: 'light' as const,
      sort: 'longest' as const,
    };
    const query = serializeFilters(filters);
    expect(parseFilters(new URLSearchParams(query.slice(1)))).toEqual(filters);
    expect(serializeFilters(DEFAULT_FILTERS)).toBe('');
  });

  it('filters by kind and sorts posters and videos together by recency', () => {
    const poster: GalleryMeta = {
      id: 'hiring-spotlight',
      kind: 'poster',
      title: 'Hiring Spotlight',
      description: 'Recruitment posts',
      category: 'social-posts',
      tags: ['hiring'],
      theme: 'dark',
      durationInFrames: 0,
      fps: 30,
      updatedAt: '2999-01-01T00:00:00.000Z',
    };
    const mixed = [...items, { meta: poster }];
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, kind: 'poster' }))).toEqual([
      'hiring-spotlight',
    ]);
    expect(filterClips(mixed, { ...DEFAULT_FILTERS, kind: 'video' })).toHaveLength(items.length);
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, sort: 'updated' }))[0]).toBe(
      'hiring-spotlight',
    );
    expect(ids(filterClips(mixed, DEFAULT_FILTERS))[0]).toBe('hiring-spotlight');
    const stale = {
      meta: { ...poster, id: 'stale-poster', updatedAt: '2000-01-01T00:00:00.000Z' },
    };
    expect(ids(filterClips([stale, ...mixed], DEFAULT_FILTERS)).at(-1)).toBe('stale-poster');
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, query: 'hiring' }))).toContain(
      'hiring-spotlight',
    );
    expect(facetCounts(mixed, DEFAULT_FILTERS).kinds.poster).toBe(1);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, kind: 'poster' })).toBe(true);
  });

  it('ignores unknown values in the URL', () => {
    const parsed = parseFilters(
      new URLSearchParams({ category: 'nope', tags: '3d,bogus', theme: 'sepia', sort: 'x' }),
    );
    expect(parsed.category).toBe('all');
    expect(parsed.tags).toEqual(['3d']);
    expect(parsed.theme).toBe('all');
    expect(parsed.sort).toBe('relevance');
  });

  it('puts the most recently updated clips first when there is no search to rank by', () => {
    const newestFirst = (list: { meta: GalleryMeta }[]) => list.map((item) => item.meta.updatedAt);
    const order = newestFirst(filterClips(items, DEFAULT_FILTERS));
    expect(order).toEqual([...order].sort((left, right) => right.localeCompare(left)));
    expect(newestFirst(filterClips(items, { ...DEFAULT_FILTERS, sort: 'updated' }))).toEqual(order);
    const ranked = filterClips(items, { ...DEFAULT_FILTERS, query: 'phone', sort: 'updated' });
    const rankedOrder = newestFirst(ranked);
    expect(rankedOrder).toEqual([...rankedOrder].sort((left, right) => right.localeCompare(left)));
  });

  it('sorts by duration and by name', () => {
    const shortest = filterClips(items, { ...DEFAULT_FILTERS, sort: 'shortest' });
    const seconds = shortest.map((item) => item.meta.durationInFrames / item.meta.fps);
    expect(seconds).toEqual([...seconds].sort((left, right) => left - right));
    const byName = filterClips(items, { ...DEFAULT_FILTERS, sort: 'name-desc' }).map(
      (item) => item.meta.title,
    );
    expect(byName).toEqual([...byName].sort((left, right) => right.localeCompare(left)));
  });
});
