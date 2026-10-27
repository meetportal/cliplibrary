'use client';

import { Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { applyEdits, type EditOperation } from '@/agent/edits';
import type { MediaContext, MediaDocument, MediaKind } from '@/agent/media';
import { cn } from '@/lib/utils';
import { AgentChat } from './agent-chat';
import { PAGE_ACTIONS_ID } from './page-actions';

interface MediaAgentProps<K extends MediaKind> {
  kind: K;
  title: string;
  document: MediaDocument<K>;
  focus: readonly string[];
  onChange: (next: MediaDocument<K>) => void;
}

export const MediaAgent = <K extends MediaKind>({
  kind,
  title,
  document: current,
  focus,
  onChange,
}: MediaAgentProps<K>) => {
  const [open, setOpen] = useState(false);
  const latest = useRef(current);
  latest.current = current;

  const readMedia = (): MediaContext => ({
    kind,
    title,
    focus: [...focus],
    document: latest.current,
  });

  const onEdit = (operations: readonly EditOperation[]) => {
    const result = applyEdits(kind, latest.current, operations);
    if (result.ok) {
      latest.current = result.document;
      onChange(result.document);
    }
  };
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById(PAGE_ACTIONS_ID));
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((wasOpen) => !wasOpen)}
      aria-expanded={open}
      aria-controls="media-agent-panel"
      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-violet-600 px-3 font-medium text-white text-xs shadow-sm transition-colors hover:bg-violet-600/90"
    >
      <Sparkles className="size-3.5" />
      <span>Edit with AI</span>
    </button>
  );

  return (
    <>
      {slot === null ? null : createPortal(trigger, slot)}
      <section
        id="media-agent-panel"
        aria-label="AI editor"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex h-[min(72dvh,40rem)] flex-col rounded-t-2xl border-t bg-background shadow-2xl',
          'sm:inset-x-auto sm:top-14 sm:right-0 sm:h-auto sm:w-[400px] sm:rounded-none sm:border-t-0 sm:border-l',
          open ? '' : 'hidden',
        )}
      >
        <AgentChat readMedia={readMedia} onEdit={onEdit} onClose={() => setOpen(false)} />
      </section>
    </>
  );
};
