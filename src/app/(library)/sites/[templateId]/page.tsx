import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type OpenedSite, SiteEditor } from '@/components/sites/editor/site-editor';
import { openSignedSite } from '@/lib/site-signing';
import { editSitePath, publicSitePath } from '@/sites/site-link';
import { findSiteTemplate } from '@/sites/templates';

type Props = {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ d?: string; sig?: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const template = findSiteTemplate((await params).templateId);
  return { title: template === undefined ? 'Website' : `${template.meta.title} · Neuclip` };
};

const openFromLink = async (templateId: string, searchParams: Props['searchParams']) => {
  const { d, sig } = await searchParams;
  if (d === undefined || sig === undefined) {
    return null;
  }
  const opened = openSignedSite({ d, sig });
  if (!opened.ok || opened.site.templateId !== templateId) {
    return null;
  }
  const site: OpenedSite = {
    slug: opened.site.slug,
    content: opened.site.content,
    links: {
      slug: opened.site.slug,
      sitePath: publicSitePath(opened.site.slug, { d, sig }),
      editPath: editSitePath(templateId, { d, sig }),
    },
  };
  return site;
};

const SiteTemplatePage = async ({ params, searchParams }: Props) => {
  const { templateId } = await params;
  if (findSiteTemplate(templateId) === undefined) {
    notFound();
  }
  return (
    <SiteEditor templateId={templateId} opened={await openFromLink(templateId, searchParams)} />
  );
};

export default SiteTemplatePage;
