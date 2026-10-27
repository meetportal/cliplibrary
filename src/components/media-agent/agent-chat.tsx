'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowUp, RotateCcw, Sparkles, Square, X } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { EditOperation } from '@/agent/edits';
import type { MediaContext } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { Button } from '@/components/ui/button';
import { AgentMessage } from './agent-message';

const SUGGESTIONS: Record<MediaContext['kind'], string[]> = {
  clip: [
    'Change the main text to something punchier',
    'Switch to a dark colour scheme',
    'Make the animation feel faster',
  ],
  poster: [
    'Rewrite the headline to be more exciting',
    'Use a warm colour palette',
    'Make the title bigger and bolder',
  ],
};

interface AgentChatProps {
  readMedia: () => MediaContext;
  onEdit: (operations: readonly EditOperation[]) => void;
  onClose: () => void;
}

export const AgentChat = ({ readMedia, onEdit, onClose }: AgentChatProps) => {
  const media = useRef(readMedia);
  media.current = readMedia;
  const edit = useRef(onEdit);
  edit.current = onEdit;
  const [transport] = useState(
    () =>
      new DefaultChatTransport<MediaAgentMessage>({
        api: '/api/agent',
        body: () => ({ media: media.current() }),
      }),
  );
  const { messages, sendMessage, status, stop, error, regenerate, setMessages, clearError } =
    useChat<MediaAgentMessage>({ transport });
  const [input, setInput] = useState('');
  const applied = useRef(new Set<string>());
  const scroller = useRef<HTMLDivElement>(null);
  const busy = status === 'submitted' || status === 'streaming';
  const kind = readMedia().kind;

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (
          part.type === 'tool-editMedia' &&
          part.state === 'output-available' &&
          part.output.ok &&
          !applied.current.has(part.toolCallId)
        ) {
          applied.current.add(part.toolCallId);
          edit.current(part.output.operations);
        }
      }
    }
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '' || busy) {
      return;
    }
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-violet-600/10 text-violet-600 dark:text-violet-400">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm">Edit with AI</h2>
          <p className="truncate text-muted-foreground text-xs">{readMedia().title}</p>
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
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close AI editor">
          <X />
        </Button>
      </div>
      <div
        ref={scroller}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col gap-3 text-center">
            <p className="text-muted-foreground text-sm">
              Describe a change and it lands in the editor. Every edit can be undone.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS[kind].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-lg border bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => <AgentMessage key={message.id} message={message} />)
        )}
        {status === 'submitted' ? (
          <div className="flex gap-1 py-1" role="status" aria-label="Thinking">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        ) : null}
        {error === undefined ? null : (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
            <span>{error.message}</span>
            <Button size="xs" variant="outline" onClick={() => regenerate().catch(() => undefined)}>
              Retry
            </Button>
          </div>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500/40">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={
              kind === 'clip' ? 'Ask for a change to this video' : 'Ask for a change to this poster'
            }
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
              className="bg-violet-600 text-white hover:bg-violet-600/90"
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
