import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteEditor } from '@/components/sites/editor/site-editor';
import { findSiteTemplate } from '@/sites/templates';

type Props = { params: Promise<{ templateId: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const template = findSiteTemplate((await params).templateId);
  return { title: template === undefined ? 'Website' : `${template.meta.title} · Neuclip` };
};

const SiteTemplatePage = async ({ params }: Props) => {
  const { templateId } = await params;
  if (findSiteTemplate(templateId) === undefined) {
    notFound();
  }
  return <SiteEditor templateId={templateId} opened={null} />;
};

export default SiteTemplatePage;
