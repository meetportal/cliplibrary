import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CAPS } from './fonts';

export const PillLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={cn(
      CAPS,
      'inline-flex items-center justify-center rounded-full bg-(--er-primary) px-6 py-2.5 text-(--er-bg) text-xs transition hover:brightness-125',
      className,
    )}
  >
    {children}
  </a>
);
