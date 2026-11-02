import { z } from 'zod';
import { resolveClipControls } from '@/core/clip-controls';
import type { ControlSectionView } from '@/core/types';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { type ControlPathTarget, controlFieldGuide, describeControlPath } from './control-guide';

export interface SiteDocument {
  templateId: string;
  content: Record<string, unknown>;
}

const siteDocumentSchema = z.object({
  templateId: z.string(),
  content: z.record(z.string(), z.unknown()),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export type SiteCheck = { ok: true; document: SiteDocument } | { ok: false; error: string };

export const checkSiteDocument = (value: unknown): SiteCheck => {
  const shape = siteDocumentSchema.safeParse(value);
  if (!shape.success) {
    return { ok: false, error: 'A website document is { templateId, content }.' };
  }
  const template = findSiteTemplate(shape.data.templateId);
  if (template === undefined) {
    return { ok: false, error: `Unknown website template "${shape.data.templateId}".` };
  }
  const content = template.schema.safeParse(shape.data.content);
  if (!content.success) {
    return { ok: false, error: z.prettifyError(content.error) };
  }
  return isRecord(content.data)
    ? { ok: true, document: { templateId: template.id, content: content.data } }
    : { ok: false, error: 'Website content must be an object.' };
};

const sectionsCache = new Map<string, ControlSectionView[]>();

const siteSections = (template: SiteTemplate): ControlSectionView[] => {
  const cached = sectionsCache.get(template.id);
  if (cached !== undefined) {
    return cached;
  }
  const sections = resolveClipControls(template.schema, template.controls, template.defaults);
  sectionsCache.set(template.id, sections);
  return sections;
};

export const siteFieldGuide = (template: SiteTemplate): string =>
  controlFieldGuide(siteSections(template), '/content');

export const describeSitePath = (templateId: string, path: string): ControlPathTarget => {
  const template = findSiteTemplate(templateId);
  return describeControlPath(
    template === undefined ? [] : siteSections(template),
    '/content',
    path,
  );
};
