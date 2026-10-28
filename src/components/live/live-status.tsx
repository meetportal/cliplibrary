import type { LiveStatus } from '@/lib/use-live';
import { cn } from '@/lib/utils';

const LABELS: Record<LiveStatus, string> = {
  connecting: 'Connecting',
  open: 'Live',
  closed: 'Reconnecting',
};

export const LiveStatusPill = ({ status }: { status: LiveStatus }) => (
  <span
    data-testid="live-status"
    data-status={status}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs',
      status === 'open'
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    )}
  >
    <span className="relative flex size-2">
      {status === 'open' ? (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
      ) : null}
      <span
        className={cn(
          'relative inline-flex size-2 rounded-full',
          status === 'open' ? 'bg-emerald-500' : 'bg-amber-500',
        )}
      />
    </span>
    {LABELS[status]}
  </span>
);

export const timeAgo = (at: number, now: number): string => {
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  if (seconds < 5) {
    return 'just now';
  }
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`;
};
