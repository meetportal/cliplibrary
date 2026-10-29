import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { z } from 'zod';
import { checkSiteDocument } from '@/agent/site';
import { slugProblem } from './slug';

export interface SharedSite {
  slug: string;
  templateId: string;
  content: Record<string, unknown>;
}

export type SiteCheck = { ok: true; site: SharedSite } | { ok: false; error: string };

const sharedSiteSchema = z.object({
  slug: z.string(),
  templateId: z.string(),
  content: z.unknown(),
});

const holdsLocalFile = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.startsWith('blob:') || value.startsWith('data:');
  }
  if (Array.isArray(value)) {
    return value.some(holdsLocalFile);
  }
  return typeof value === 'object' && value !== null && Object.values(value).some(holdsLocalFile);
};

export const LOCAL_PHOTO_PROBLEM =
  'Photos picked from this device cannot be shared. Paste an image link instead.';

export const checkSharedSite = (value: unknown): SiteCheck => {
  const shape = sharedSiteSchema.safeParse(value);
  if (!shape.success) {
    return { ok: false, error: 'A website is { slug, templateId, content }.' };
  }
  const slugIssue = slugProblem(shape.data.slug);
  if (slugIssue !== null) {
    return { ok: false, error: `Address: ${slugIssue}` };
  }
  const document = checkSiteDocument(shape.data);
  if (!document.ok) {
    return document;
  }
  if (holdsLocalFile(document.document.content)) {
    return { ok: false, error: LOCAL_PHOTO_PROBLEM };
  }
  return { ok: true, site: { slug: shape.data.slug, ...document.document } };
};

export const encodeSite = (site: SharedSite): string =>
  compressToEncodedURIComponent(JSON.stringify(site));

export const decodeSite = (data: string): SiteCheck => {
  try {
    const json = decompressFromEncodedURIComponent(data);
    return json === '' || json === null
      ? { ok: false, error: 'This link does not hold a website.' }
      : checkSharedSite(JSON.parse(json));
  } catch {
    return { ok: false, error: 'This link does not hold a website.' };
  }
};

export interface SiteLinkQuery {
  d: string;
  sig: string;
}

const siteQuery = ({ d, sig }: SiteLinkQuery): string =>
  `d=${encodeURIComponent(d)}&sig=${encodeURIComponent(sig)}`;

export const publicSitePath = (slug: string, query: SiteLinkQuery): string =>
  `/s/${slug}?${siteQuery(query)}`;

export const editSitePath = (templateId: string, query: SiteLinkQuery): string =>
  `/sites/${templateId}?${siteQuery(query)}`;
