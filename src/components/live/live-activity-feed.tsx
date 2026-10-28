'use client';

import { Bot, CircleAlert, MousePointer2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { LiveStatus } from '@/lib/use-live';
import { cn } from '@/lib/utils';
import type { LiveActivity } from '@/live/protocol';
import { LiveStatusPill, timeAgo } from './live-status';

const VISIBLE = 8;

const useNow = (): number => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const ActivityRow = ({
  entry,
  fresh,
  now,
}: {
  entry: LiveActivity;
  fresh: boolean;
  now: number;
}) => {
  const Icon = entry.ok ? (entry.source === 'agent' ? Bot : MousePointer2) : CircleAlert;
  return (
    <li
      className={cn(
        'flex gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-700',
        fresh ? 'bg-violet-500/10' : 'bg-transparent',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
          entry.ok
            ? entry.source === 'agent'
              ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
              : 'bg-muted text-muted-foreground'
            : 'bg-destructive/10 text-destructive',
        )}
      >
        <Icon className="size-3" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-snug">{entry.summary}</p>
        {entry.detail === null ? null : (
          <p
            className={cn(
              'mt-0.5 line-clamp-2 break-all font-mono text-[10px]',
              entry.ok ? 'text-muted-foreground' : 'text-destructive',
            )}
          >
            {entry.detail}
          </p>
        )}
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {entry.source === 'agent' ? 'Agent' : 'You'} · {timeAgo(entry.at, now)}
        </p>
      </div>
    </li>
  );
};

interface LiveActivityFeedProps {
  status: LiveStatus;
  activity: readonly LiveActivity[];
}

export const LiveActivityFeed = ({ status, activity }: LiveActivityFeedProps) => {
  const now = useNow();
  const latest = activity.at(-1);
  const [freshId, setFreshId] = useState<string | null>(null);

  useEffect(() => {
    if (latest === undefined) {
      return;
    }
    setFreshId(latest.id);
    const timer = setTimeout(() => setFreshId(null), 2400);
    return () => clearTimeout(timer);
  }, [latest]);

  return (
    <section aria-label="Live activity" className="border-border border-b px-3 pb-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Agent activity
        </span>
        <LiveStatusPill status={status} />
      </div>
      <ol className="space-y-0.5" data-testid="live-activity">
        {[...activity]
          .reverse()
          .slice(0, VISIBLE)
          .map((entry) => (
            <ActivityRow key={entry.id} entry={entry} fresh={entry.id === freshId} now={now} />
          ))}
      </ol>
    </section>
  );
};
