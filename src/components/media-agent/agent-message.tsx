'use client';

import { AlertCircle, Check, LoaderCircle, RefreshCw } from 'lucide-react';
import type { MediaAgentMessage } from '@/agent/tools';
import { cn } from '@/lib/utils';

type MessagePart = MediaAgentMessage['parts'][number];
type EditPart = Extract<MessagePart, { type: 'tool-editMedia' }>;

const EditStatus = ({ part }: { part: EditPart }) => {
  const summary = part.input?.summary;
  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <span className="flex items-center gap-2 text-muted-foreground">
        <LoaderCircle className="size-3.5 animate-spin" />
        {summary === undefined ? 'Preparing an edit' : summary}
      </span>
    );
  }
  if (part.state === 'output-available' && part.output.ok) {
    return (
      <span className="flex items-center gap-2">
        <Check className="size-3.5 text-emerald-500" />
        {summary ?? 'Applied an edit'}
      </span>
    );
  }
  if (part.state === 'output-available') {
    return (
      <span className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="size-3.5" />
        That edit did not fit the design, adjusting
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-destructive">
      <AlertCircle className="size-3.5" />
      The edit could not be applied
    </span>
  );
};

export const AgentMessage = ({ message }: { message: MediaAgentMessage }) => {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      {message.parts.map((part, index) => {
        const key = `${message.id}-${index}`;
        if (part.type === 'text') {
          return part.text.trim() === '' ? null : (
            <p
              key={key}
              className={cn(
                'max-w-[85%] whitespace-pre-wrap break-words text-sm leading-relaxed',
                isUser ? 'rounded-2xl rounded-br-md bg-violet-600 px-3.5 py-2 text-white' : '',
              )}
            >
              {part.text}
            </p>
          );
        }
        if (part.type === 'tool-editMedia') {
          return (
            <div
              key={key}
              data-testid="agent-edit"
              data-state={part.state}
              className="max-w-[85%] rounded-lg border bg-muted/40 px-3 py-2 text-xs"
            >
              <EditStatus part={part} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
