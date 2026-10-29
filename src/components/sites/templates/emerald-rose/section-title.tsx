import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CAPS, SCRIPT } from './fonts';

export const SectionTitle = ({
  script,
  caps,
  className,
  children,
}: {
  script: string;
  caps?: string;
  className?: string;
  children?: ReactNode;
}) => (
  <div className={cn('flex flex-col items-center text-center', className)}>
    {caps === undefined ? null : (
      <span className={cn(CAPS, 'text-(--er-muted) text-xs')}>{caps}</span>
    )}
    <h2 className={cn(SCRIPT, 'text-5xl leading-tight @3xl:text-6xl')}>{script}</h2>
    {children}
  </div>
);

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
