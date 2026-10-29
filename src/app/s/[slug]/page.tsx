import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicSite } from '@/components/sites/public-site';
import { loadPublishedSite } from '@/lib/published-sites';

type Params = Promise<{ slug: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const site = await loadPublishedSite((await params).slug);
  if (site === null) {
    return { title: 'Website not found' };
  }
  const title = site.template.headline(site.content);
  return { title, openGraph: { title, description: site.template.meta.description } };
};

const PublishedSitePage = async ({ params }: { params: Params }) => {
  const site = await loadPublishedSite((await params).slug);
  if (site === null) {
    notFound();
  }
  return <PublicSite templateId={site.template.id} content={site.content} slug={site.slug} />;
};

export default PublishedSitePage;
