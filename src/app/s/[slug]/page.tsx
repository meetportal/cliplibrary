import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicSite } from '@/components/sites/public-site';
import { openSignedSite } from '@/lib/site-signing';
import { findSiteTemplate } from '@/sites/templates';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ d?: string; sig?: string }>;
};

const openPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { d = '', sig = '' } = await searchParams;
  const opened = openSignedSite({ d, sig });
  const template = opened.ok ? findSiteTemplate(opened.site.templateId) : undefined;
  return opened.ok && opened.site.slug === slug && template !== undefined
    ? { site: opened.site, template }
    : null;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const page = await openPage(props);
  if (page === null) {
    return { title: 'Website not found' };
  }
  const title = page.template.headline(page.site.content);
  return { title, openGraph: { title, description: page.template.meta.description } };
};

const PublishedSitePage = async (props: Props) => {
  const page = await openPage(props);
  if (page === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-semibold text-xl">This website link does not work</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Ask the person who sent it for the latest link.
        </p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Go to neuclip
        </Link>
      </div>
    );
  }
  return <PublicSite templateId={page.site.templateId} content={page.site.content} />;
};

export default PublishedSitePage;
