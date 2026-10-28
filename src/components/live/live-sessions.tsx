'use client';

import { Check, Clapperboard, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { LIVE_SERVER_URL } from '@/lib/live.config';
import { useLiveSessions } from '@/lib/use-live';
import type { LiveSessionSummary } from '@/live/protocol';
import { LiveStatusPill, timeAgo } from './live-status';

const MCP_URL = `${LIVE_SERVER_URL}/mcp`;

const CONNECT_COMMANDS = [
  { label: 'Claude Code', value: `claude mcp add --transport http cliplibrary ${MCP_URL}` },
  {
    label: 'Any MCP client',
    value: JSON.stringify({ mcpServers: { cliplibrary: { type: 'http', url: MCP_URL } } }, null, 2),
  },
];

const CopyBlock = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-xs">{label}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              .writeText(value)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              })
              .catch(() => undefined);
          }}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground text-xs hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-all rounded-lg bg-muted/60 p-3 font-mono text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  );
};

const SessionRow = ({ session, now }: { session: LiveSessionSummary; now: number }) => (
  <li>
    <Link
      href={`/live/${session.id}`}
      className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300">
        <Clapperboard className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-sm">{session.title}</span>
        <span className="block text-muted-foreground text-xs">
          {session.clips} clip{session.clips === 1 ? '' : 's'} · {session.seconds}s · v
          {session.version}
        </span>
      </span>
      <span className="shrink-0 text-muted-foreground text-xs">
        {timeAgo(session.updatedAt, now)}
      </span>
    </Link>
  </li>
);

export const LiveSessions = () => {
  const { status, sessions } = useLiveSessions();
  const now = Date.now();
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-5 lg:grid-cols-[1fr_380px]">
      <section aria-label="Live videos" className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-semibold text-xl tracking-tight">Live videos</h1>
            <p className="text-muted-foreground text-sm">
              Videos an agent is building through MCP. Open one to watch it change as it happens.
            </p>
          </div>
          <LiveStatusPill status={status} />
        </div>
        {sessions === null ? (
          <p className="text-muted-foreground text-sm">
            {status === 'open'
              ? 'Loading…'
              : `Waiting for the live server at ${LIVE_SERVER_URL}. Start it with bun run live.`}
          </p>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-border border-dashed px-6 py-10 text-center">
            <p className="font-medium text-sm">No live videos yet</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Ask your agent to make one, for example: “make a 20 second launch video for my app”.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" data-testid="live-sessions">
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} now={now} />
            ))}
          </ul>
        )}
      </section>
      <aside className="min-w-0 space-y-4 rounded-2xl border border-border p-5">
        <div>
          <h2 className="font-semibold text-sm">Connect an agent</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            The MCP server lets an agent search every clip, build a video and edit it here live.
          </p>
        </div>
        {CONNECT_COMMANDS.map((command) => (
          <CopyBlock key={command.label} label={command.label} value={command.value} />
        ))}
      </aside>
    </div>
  );
};
