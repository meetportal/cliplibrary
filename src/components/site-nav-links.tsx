'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/integrations', label: 'MCP' },
  { href: '/account', label: 'Profile' },
] as const;

export const SiteNavLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? 'page' : undefined}
          className={cn(
            'hidden hover:text-foreground sm:inline',
            pathname === link.href && 'font-medium text-foreground',
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
