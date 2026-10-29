'use client';

import { MailOpen, Redo2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Undoable, useUndoRedoKeys } from '@/lib/use-undoable';

export const HistoryActions = <T,>({
  history,
  onPlayIntro,
}: {
  history: Undoable<T>;
  onPlayIntro: () => void;
}) => {
  useUndoRedoKeys(history.undo, history.redo);
  return (
    <>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Undo"
        disabled={!history.canUndo}
        onClick={history.undo}
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Redo"
        disabled={!history.canRedo}
        onClick={history.redo}
      >
        <Redo2 />
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onPlayIntro}>
        <MailOpen />
        Play intro
      </Button>
    </>
  );
};
