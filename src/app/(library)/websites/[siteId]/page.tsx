import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteEditor } from '@/components/sites/editor/site-editor';
import { findOwnedSite } from '@/db/sites';
import { requireUserId } from '@/lib/auth-pages';
import { siteEditorPath } from '@/sites/published-site';

type Props = { params: Promise<{ siteId: string }> };

export const metadata: Metadata = { title: 'Website · Neuclip' };

const WebsiteEditorPage = async ({ params }: Props) => {
  const { siteId } = await params;
  const site = await findOwnedSite(await requireUserId(siteEditorPath(siteId)), siteId);
  if (site === null) {
    notFound();
  }
  return (
    <SiteEditor
      templateId={site.templateId}
      opened={{
        id: site.id,
        slug: site.slug,
        content: site.content,
        draft: site.draft,
        updatedAt: site.updatedAt.toISOString(),
      }}
    />
  );
};

export default WebsiteEditorPage;
