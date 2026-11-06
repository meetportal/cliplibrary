import type { SiteTemplate } from '../types';

export const SITE_TEMPLATES: readonly SiteTemplate[] = [];

export const findSiteTemplate = (id: string): SiteTemplate | undefined =>
  SITE_TEMPLATES.find((template) => template.id === id);
