import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublishedSiteEditor } from '@/components/sites/editor/published-site-editor';
import { loadPublishedSite } from '@/lib/published-sites';

type Params = Promise<{ slug: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const site = await loadPublishedSite((await params).slug);
  return {
    title: site === null ? 'Website' : `Edit ${site.template.headline(site.content)} · Neuclip`,
    robots: { index: false },
  };
};

const EditSitePage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ published?: string }>;
}) => {
  const site = await loadPublishedSite((await params).slug);
  if (site === null) {
    notFound();
  }
  return (
    <PublishedSiteEditor
      slug={site.slug}
      templateId={site.template.id}
      content={site.content}
      justPublished={(await searchParams).published === '1'}
    />
  );
};

export default EditSitePage;
