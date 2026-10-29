import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DraftSiteEditor } from '@/components/sites/editor/draft-site-editor';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';

export const generateStaticParams = () =>
  SITE_TEMPLATES.map((template) => ({ templateId: template.id }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> => {
  const { templateId } = await params;
  const template = findSiteTemplate(templateId);
  return { title: template === undefined ? 'Website' : `${template.meta.title} · Neuclip` };
};

const SiteTemplatePage = async ({ params }: { params: Promise<{ templateId: string }> }) => {
  const { templateId } = await params;
  if (findSiteTemplate(templateId) === undefined) {
    notFound();
  }
  return <DraftSiteEditor templateId={templateId} />;
};

export default SiteTemplatePage;
