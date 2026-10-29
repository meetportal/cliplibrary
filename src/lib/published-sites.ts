import 'server-only';
import { cache } from 'react';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { siteStore } from './site-store';

export interface LoadedSite {
  slug: string;
  template: SiteTemplate;
  content: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const loadPublishedSite = cache(async (slug: string): Promise<LoadedSite | null> => {
  const site = await siteStore.read(slug);
  const template = site === null ? undefined : findSiteTemplate(site.templateId);
  if (site === null || template === undefined || !isRecord(site.content)) {
    return null;
  }
  return { slug: site.slug, template, content: site.content };
});
