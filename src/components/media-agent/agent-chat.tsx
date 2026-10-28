'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  ArrowUp,
  Crosshair,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { EditOperation } from '@/agent/edits';
import type { MediaContext } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { agentContextSchema, agentMetadataSchema } from '@/agent/trace';
import { Button } from '@/components/ui/button';
import { AgentStatus } from './agent-status';
import { AgentTurn } from './agent-turn';

const SUGGESTIONS: Record<MediaContext['kind'], string[]> = {
  clip: [
    'Change the main line to SHIP FASTER WITH LESS STRESS',
    'Make the big words bright orange',
    'Slow the whole animation down a bit',
  ],
  poster: [
    'Rewrite the headline to be more exciting',
    'Switch to a deep navy background and keep the text readable',
    'Make all the review stars gold',
  ],
};

const DEFAULT_MODEL = 'gemini-3.7-flash';

const withoutTrace = (messages: MediaAgentMessage[]): MediaAgentMessage[] =>
  messages.map((message) => ({
    ...message,
    parts: message.parts.filter((part) => part.type !== 'data-context'),
  }));

interface AgentChatProps {
  readMedia: () => MediaContext;
  selection: readonly string[];
  onEdit: (toolCallId: string, operations: readonly EditOperation[]) => void;
  onToolCall: (toolCallId: string) => void;
  documentFor: (toolCallId: string) => unknown;
  expanded: boolean;
  onToggleExpanded: () => void;
  onClose: () => void;
}

export const AgentChat = ({
  readMedia,
  selection,
  onEdit,
  onToolCall,
  documentFor,
  expanded,
  onToggleExpanded,
  onClose,
}: AgentChatProps) => {
  const media = useRef(readMedia);
  media.current = readMedia;
  const edit = useRef(onEdit);
  edit.current = onEdit;
  const seen = useRef(onToolCall);
  seen.current = onToolCall;
  const [transport] = useState(
    () =>
      new DefaultChatTransport<MediaAgentMessage>({
        api: '/api/agent',
        prepareSendMessagesRequest: (request) => ({
          body: { messages: withoutTrace(request.messages), media: media.current() },
        }),
      }),
  );
  const { messages, sendMessage, status, stop, error, regenerate, setMessages, clearError } =
    useChat<MediaAgentMessage>({
      transport,
      messageMetadataSchema: agentMetadataSchema,
      dataPartSchemas: { context: agentContextSchema },
    });
  const [input, setInput] = useState('');
  const applied = useRef(new Set<string>());
  const scroller = useRef<HTMLDivElement>(null);
  const busy = status === 'submitted' || status === 'streaming';
  const { kind, title } = readMedia();
  const last = messages.at(-1);
  const model =
    [...messages].reverse().find((message) => message.metadata?.model !== undefined)?.metadata
      ?.model ?? DEFAULT_MODEL;

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === 'tool-editMedia') {
          seen.current(part.toolCallId);
        }
        if (
          part.type === 'tool-editMedia' &&
          part.state === 'output-available' &&
          part.output.ok &&
          !applied.current.has(part.toolCallId)
        ) {
          applied.current.add(part.toolCallId);
          edit.current(part.toolCallId, part.output.operations);
        }
      }
    }
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '' || busy) {
      return;
    }
    clearError();
    sendMessage({ text: trimmed }).catch(() => undefined);
    setInput('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  };

  const reset = () => {
    stop().catch(() => undefined);
    clearError();
    setMessages([]);
  };

  const errorText = error === undefined ? null : error.message;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm leading-tight">AI editor</h2>
          <p className="truncate text-muted-foreground text-xs">{title}</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={reset}
          disabled={messages.length === 0}
          aria-label="New chat"
          title="New chat"
        >
          <RotateCcw />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onToggleExpanded}
          aria-label={expanded ? 'Shrink AI editor' : 'Expand AI editor'}
        >
          {expanded ? <Minimize2 /> : <Maximize2 />}
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close AI editor">
          <X />
        </Button>
      </div>
      <AgentStatus status={status} last={last} model={model.replace(/^google\//, '')} />
      <div
        ref={scroller}
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col gap-4">
            <div className="space-y-1 text-center">
              <p className="font-medium text-sm">
                Describe a change to this {kind === 'clip' ? 'video' : 'poster'}
              </p>
              <p className="text-muted-foreground text-xs">
                You will see what the agent reads, how it thinks, which controls it picks and
                whether each edit passes validation. Every edit can be undone.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS[kind].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-lg border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) =>
            message.role === 'user' ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-violet-600 px-3.5 py-2 text-sm text-white">
                  {message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('')}
                </p>
              </div>
            ) : (
              <AgentTurn
                key={message.id}
                message={message}
                kind={kind}
                documentFor={documentFor}
                error={index === messages.length - 1 ? errorText : null}
              />
            ),
          )
        )}
        {errorText !== null && last?.role !== 'assistant' ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
            {errorText}
          </p>
        ) : null}
        {errorText === null ? null : (
          <Button
            size="sm"
            variant="outline"
            className="self-start"
            onClick={() => regenerate().catch(() => undefined)}
          >
            <RotateCcw /> Retry
          </Button>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <p className="mb-2 flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
          <Crosshair className="size-3 shrink-0" />
          {selection.length === 0
            ? `Editing the whole ${kind === 'clip' ? 'video' : 'poster'}`
            : `Selected: ${selection.join(', ')}`}
        </p>
        <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={`Ask for a change to this ${kind === 'clip' ? 'video' : 'poster'}`}
            aria-label="Message the AI editor"
            className="field-sizing-content max-h-32 min-h-6 flex-1 resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          {busy ? (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              onClick={() => stop().catch(() => undefined)}
              aria-label="Stop"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-sm"
              className="bg-violet-600 text-white hover:bg-violet-600/90 disabled:bg-muted disabled:text-muted-foreground"
              disabled={input.trim() === ''}
              aria-label="Send"
            >
              <ArrowUp />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
