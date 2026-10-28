'use client';

import { ChevronRight, LoaderCircle, type LucideIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type StepTone = 'neutral' | 'active' | 'success' | 'warning' | 'error';

const TONES: Record<StepTone, string> = {
  neutral: 'border-border text-muted-foreground',
  active: 'border-violet-500/50 bg-violet-500/10 text-violet-600 dark:text-violet-300',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  error: 'border-destructive/40 bg-destructive/10 text-destructive',
};

interface TraceStepProps {
  icon: LucideIcon;
  title: ReactNode;
  meta?: ReactNode;
  tone?: StepTone;
  live?: boolean;
  collapsible?: boolean;
  collapseWhenDone?: boolean;
  children?: ReactNode;
}

export const TraceStep = ({
  icon: Icon,
  title,
  meta,
  tone = 'neutral',
  live = false,
  collapsible = false,
  collapseWhenDone = false,
  children,
}: TraceStepProps) => {
  const [open, setOpen] = useState(!collapsible || live);

  useEffect(() => {
    if (collapseWhenDone && !live) {
      setOpen(false);
    }
  }, [collapseWhenDone, live]);

  const header = (
    <>
      <span className="font-medium text-foreground">{title}</span>
      {meta === undefined ? null : (
        <span className="ml-auto shrink-0 text-muted-foreground tabular-nums">{meta}</span>
      )}
      {collapsible ? (
        <ChevronRight
          className={cn(
            'size-3.5 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-90',
          )}
        />
      ) : null}
    </>
  );

  return (
    <li
      className="relative flex gap-3 pb-4 before:absolute before:top-7 before:bottom-1 before:left-[11px] before:w-px before:bg-border last:pb-0 last:before:hidden"
      data-testid="trace-step"
    >
      <span
        className={cn(
          'relative flex size-6 shrink-0 items-center justify-center rounded-full border bg-background',
          TONES[live ? 'active' : tone],
        )}
      >
        {live ? <LoaderCircle className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
            aria-expanded={open}
            className="flex w-full items-center gap-2 text-left text-xs"
          >
            {header}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs">{header}</div>
        )}
        {children === undefined || !open ? null : <div className="mt-2">{children}</div>}
      </div>
    </li>
  );
};

export const RawJson = ({ label, value }: { label: string; value: unknown }) => (
  <details className="group rounded-md border bg-muted/30 text-[11px]">
    <summary className="cursor-pointer select-none px-2 py-1 text-muted-foreground hover:text-foreground">
      {label}
    </summary>
    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all border-t px-2 py-1.5 font-mono">
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </pre>
  </details>
);
