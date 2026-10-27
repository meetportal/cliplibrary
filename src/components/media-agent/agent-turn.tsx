'use client';

import { Brain, CircleCheck, CircleX, MessageSquareText } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import type { MediaKind } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { ContextStep } from './context-step';
import { EditStep } from './edit-step';
import { TraceStep } from './trace-step';

const withBold = (text: string): ReactNode[] =>
  text.split(/\*\*(.+?)\*\*/g).map((chunk, index) =>
    index % 2 === 1 ? (
      <strong key={`${index}-${chunk}`} className="font-semibold text-foreground">
        {chunk}
      </strong>
    ) : (
      <Fragment key={`${index}-${chunk}`}>{chunk}</Fragment>
    ),
  );

const formatTokens = (count: number): string => count.toLocaleString();

const Summary = ({ message }: { message: MediaAgentMessage }) => {
  const meta = message.metadata;
  if (meta?.finishedAt === undefined || meta.startedAt === undefined) {
    return null;
  }
  const seconds = ((meta.finishedAt - meta.startedAt) / 1000).toFixed(1);
  const steps = meta.steps ?? 1;
  return (
    <TraceStep
      icon={CircleCheck}
      tone="success"
      title="Done"
      meta={`${seconds}s · ${steps} step${steps === 1 ? '' : 's'}`}
    >
      <p className="text-[11px] text-muted-foreground" data-testid="agent-summary">
        {formatTokens(meta.inputTokens ?? 0)} tokens in · {formatTokens(meta.outputTokens ?? 0)} out
        {meta.reasoningTokens ? ` · ${formatTokens(meta.reasoningTokens)} thinking` : ''}
        {meta.model === undefined ? '' : ` · ${meta.model.replace(/^google\//, '')}`}
      </p>
    </TraceStep>
  );
};

interface AgentTurnProps {
  message: MediaAgentMessage;
  kind: MediaKind;
  documentFor: (toolCallId: string) => unknown;
  error: string | null;
}

export const AgentTurn = ({ message, kind, documentFor, error }: AgentTurnProps) => {
  let attempts = 0;
  return (
    <ol className="w-full" aria-label="Agent activity">
      {message.parts.map((part, index) => {
        const key = `${message.id}-${index}`;
        if (part.type === 'data-context') {
          return <ContextStep key={key} context={part.data} />;
        }
        if (part.type === 'reasoning') {
          return part.text.trim() === '' ? null : (
            <TraceStep
              key={key}
              icon={Brain}
              title="Thinking"
              meta={part.state === 'streaming' ? 'live' : undefined}
              live={part.state === 'streaming'}
              collapsible
              collapseWhenDone
            >
              <p className="max-h-56 overflow-y-auto whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
                {withBold(part.text.trim())}
              </p>
            </TraceStep>
          );
        }
        if (part.type === 'text') {
          return part.text.trim() === '' ? null : (
            <TraceStep
              key={key}
              icon={MessageSquareText}
              title="Reply"
              live={part.state === 'streaming'}
            >
              <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
                {part.text.trim()}
              </p>
            </TraceStep>
          );
        }
        if (part.type === 'tool-editMedia') {
          attempts += 1;
          return (
            <EditStep
              key={key}
              part={part}
              attempt={attempts}
              kind={kind}
              document={documentFor(part.toolCallId)}
            />
          );
        }
        return null;
      })}
      <Summary message={message} />
      {error === null ? null : (
        <TraceStep icon={CircleX} tone="error" title="Stopped">
          <p className="text-destructive text-xs">{error}</p>
        </TraceStep>
      )}
    </ol>
  );
};
