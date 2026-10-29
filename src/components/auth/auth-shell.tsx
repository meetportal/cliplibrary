import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandMark } from '@/components/brand-mark';

export const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) => (
  <div className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-16">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Link href="/" aria-label="neuclip home">
          <BrandMark className="size-10" />
        </Link>
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        {children}
      </div>
      <p className="text-center text-muted-foreground text-sm">{footer}</p>
    </div>
  </div>
);

export const Divider = () => (
  <div className="flex items-center gap-3 text-muted-foreground text-xs">
    <span className="h-px flex-1 bg-border" />
    or
    <span className="h-px flex-1 bg-border" />
  </div>
);

export const FormError = ({ message }: { message: string | null }) =>
  message === null ? null : (
    <p role="alert" className="text-destructive text-sm">
      {message}
    </p>
  );
