import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SiteEditor } from '@/components/sites/editor/site-editor';
import { findLatestOwnedSite } from '@/db/sites';
import { currentUserId } from '@/lib/session';
import { siteEditorPath } from '@/sites/published-site';
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
  const userId = await currentUserId();
  const existing = userId === null ? null : await findLatestOwnedSite(userId, templateId);
  if (existing !== null) {
    redirect(siteEditorPath(existing.id));
  }
  return <SiteEditor templateId={templateId} opened={null} />;
};

export default SiteTemplatePage;
