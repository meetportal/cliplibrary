import Link from 'next/link';
import type { ReactNode } from 'react';
import { AccountMenu } from '@/components/auth/account-menu';
import { BrandMark } from '@/components/brand-mark';
import { PAGE_ACTIONS_ID } from '@/components/media-agent/page-actions';
import { SiteNavLinks } from '@/components/site-nav-links';
import { ThemeToggle } from '@/components/theme-toggle';

const LibraryLayout = ({ children }: { children: ReactNode }) => (
  <>
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 bg-background/70 px-4 backdrop-blur-md sm:px-5">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <BrandMark className="size-6" />
        neuclip
      </Link>
      <nav className="flex items-center gap-4 text-muted-foreground text-sm">
        <div id={PAGE_ACTIONS_ID} className="contents" />
        <SiteNavLinks />
        <ThemeToggle />
        <AccountMenu />
      </nav>
    </header>
    <main className="flex min-h-0 flex-1 flex-col">{children}</main>
  </>
);

export default LibraryLayout;
