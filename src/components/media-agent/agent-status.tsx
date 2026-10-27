'use client';

import type { ChatStatus } from 'ai';
import { useEffect, useRef, useState } from 'react';
import type { MediaAgentMessage } from '@/agent/tools';
import { cn } from '@/lib/utils';
import type { EditPart } from './edit-step';

type Tone = 'idle' | 'busy' | 'done' | 'error';

const toolPhase = (part: EditPart): { label: string; tone: Tone } => {
  if (part.state === 'input-streaming') {
    return { label: 'Choosing controls to edit', tone: 'busy' };
  }
  if (part.state === 'input-available') {
    return { label: 'Validating the edit', tone: 'busy' };
  }
  if (part.state === 'output-available') {
    return part.output.ok
      ? { label: 'Applying the edit', tone: 'busy' }
      : { label: 'Edit rejected, the model is fixing it', tone: 'busy' };
  }
  return { label: 'Edit failed', tone: 'busy' };
};

const phaseOf = (
  status: ChatStatus,
  last: MediaAgentMessage | undefined,
): { label: string; tone: Tone } => {
  if (status === 'error') {
    return { label: 'Stopped with an error', tone: 'error' };
  }
  if (status === 'submitted') {
    return { label: 'Sending the document to the model', tone: 'busy' };
  }
  const assistant = last?.role === 'assistant' ? last : undefined;
  if (status === 'ready') {
    return assistant?.metadata?.finishedAt === undefined
      ? { label: 'Ready', tone: 'idle' }
      : { label: 'Done', tone: 'done' };
  }
  const part = assistant?.parts.at(-1);
  if (part === undefined || part.type === 'data-context' || part.type === 'step-start') {
    return { label: 'Reading the context', tone: 'busy' };
  }
  if (part.type === 'reasoning') {
    return { label: 'Thinking', tone: 'busy' };
  }
  if (part.type === 'text') {
    return { label: 'Writing the reply', tone: 'busy' };
  }
  if (part.type === 'tool-editMedia') {
    return toolPhase(part);
  }
  return { label: 'Working', tone: 'busy' };
};

const DOTS: Record<Tone, string> = {
  idle: 'bg-muted-foreground/50',
  busy: 'bg-violet-500 animate-pulse',
  done: 'bg-emerald-500',
  error: 'bg-destructive',
};

const useElapsed = (busy: boolean): number | null => {
  const startedAt = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    if (!busy) {
      return;
    }
    startedAt.current = Date.now();
    setElapsed(0);
    const timer = setInterval(() => {
      setElapsed(Date.now() - (startedAt.current ?? Date.now()));
    }, 100);
    return () => clearInterval(timer);
  }, [busy]);

  return elapsed;
};

export const AgentStatus = ({
  status,
  last,
  model,
}: {
  status: ChatStatus;
  last: MediaAgentMessage | undefined;
  model: string;
}) => {
  const phase = phaseOf(status, last);
  const elapsed = useElapsed(phase.tone === 'busy');
  return (
    <div
      className="flex items-center gap-2 border-b bg-muted/30 px-4 py-1.5 text-xs"
      role="status"
      aria-live="polite"
      data-testid="agent-status"
    >
      <span className={cn('size-2 shrink-0 rounded-full', DOTS[phase.tone])} />
      <span
        className={cn(
          'truncate',
          phase.tone === 'busy' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {phase.label}
      </span>
      {elapsed === null ? null : (
        <span className="text-muted-foreground tabular-nums">{(elapsed / 1000).toFixed(1)}s</span>
      )}
      <span className="ml-auto shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
        {model}
      </span>
    </div>
  );
};
