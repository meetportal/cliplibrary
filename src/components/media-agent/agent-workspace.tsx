'use client';

import { Sparkles } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { selectionNames } from '@/agent/describe-path';
import { applyEdits, type EditOperation } from '@/agent/edits';
import type { MediaContext, MediaDocument, MediaKind } from '@/agent/media';
import { usePersistedState } from '@/lib/use-persisted-state';
import { cn } from '@/lib/utils';
import { AgentChat } from './agent-chat';
import { PAGE_ACTIONS_ID } from './page-actions';

interface AgentWorkspaceProps<K extends MediaKind> {
  kind: K;
  title: string;
  document: MediaDocument<K>;
  focus: readonly string[];
  onChange: (next: MediaDocument<K>) => void;
  children: ReactNode;
}

export const AgentWorkspace = <K extends MediaKind>({
  kind,
  title,
  document: current,
  focus,
  onChange,
  children,
}: AgentWorkspaceProps<K>) => {
  const [open, setOpen] = usePersistedState('cliplibrary-agent-open', false);
  const [expanded, setExpanded] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  const latest = useRef(current);
  latest.current = current;
  const before = useRef(new Map<string, unknown>());

  useEffect(() => {
    setSlot(window.document.getElementById(PAGE_ACTIONS_ID));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && panel.current?.contains(event.target as Node) === true) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const readMedia = (): MediaContext => ({
    kind,
    title,
    focus: [...focus],
    document: latest.current,
  });

  const onEdit = (toolCallId: string, operations: readonly EditOperation[]) => {
    const result = applyEdits(kind, latest.current, operations);
    if (result.ok) {
      onToolCall(toolCallId);
      latest.current = result.document;
      onChange(result.document);
    }
  };

  const onToolCall = (toolCallId: string) => {
    if (!before.current.has(toolCallId)) {
      before.current.set(toolCallId, latest.current);
    }
  };

  const documentFor = useCallback(
    (toolCallId: string): unknown => before.current.get(toolCallId) ?? latest.current,
    [],
  );

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-pressed={open}
      aria-controls="media-agent-panel"
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-medium text-xs transition-colors',
        open
          ? 'bg-violet-600 text-white shadow-sm hover:bg-violet-600/90'
          : 'border border-violet-500/40 text-violet-700 hover:bg-violet-500/10 dark:text-violet-300',
      )}
    >
      <Sparkles className="size-3.5" />
      <span>Edit with AI</span>
    </button>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      {slot === null ? null : createPortal(trigger, slot)}
      <section
        ref={panel}
        id="media-agent-panel"
        aria-label="AI editor"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex-col overflow-hidden rounded-t-2xl border-t bg-background shadow-2xl',
          expanded ? 'top-14' : 'h-[62dvh]',
          'md:static md:h-auto md:w-[400px] md:shrink-0 md:rounded-none md:border-t-0 md:border-l md:shadow-none xl:w-[440px]',
          open ? 'flex' : 'hidden',
        )}
      >
        <div className="flex justify-center pt-2 md:hidden">
          <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        <AgentChat
          readMedia={readMedia}
          selection={selectionNames(kind, current, focus)}
          onEdit={onEdit}
          onToolCall={onToolCall}
          documentFor={documentFor}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((wasExpanded) => !wasExpanded)}
          onClose={() => setOpen(false)}
        />
      </section>
    </div>
  );
};
