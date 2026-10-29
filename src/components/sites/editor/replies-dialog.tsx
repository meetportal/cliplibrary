'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { listReplies } from '@/lib/site-api';
import type { StoredRsvp } from '@/sites/rsvp';

type Loaded = { replies: StoredRsvp[] } | { problem: string } | null;

const guestTotal = (replies: StoredRsvp[]): number =>
  replies.reduce((sum, reply) => sum + (reply.attending ? reply.guests : 0), 0);

const ReplyItem = ({ reply }: { reply: StoredRsvp }) => (
  <li className="rounded-lg bg-muted/60 p-3 text-sm">
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium">{reply.name}</span>
      <span
        className={
          reply.attending ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
        }
      >
        {reply.attending ? `Attending, ${reply.guests}` : 'Declined'}
      </span>
    </div>
    {reply.dietary === '' ? null : (
      <p className="mt-1 text-muted-foreground">Dietary: {reply.dietary}</p>
    )}
    {reply.message === '' ? null : <p className="mt-1">{reply.message}</p>}
  </li>
);

const ReplyList = ({ replies }: { replies: StoredRsvp[] }) =>
  replies.length === 0 ? (
    <p className="text-muted-foreground text-sm">No replies yet.</p>
  ) : (
    <ul className="flex flex-col gap-2">
      {[...replies].reverse().map((reply) => (
        <ReplyItem key={reply.receivedAt + reply.name} reply={reply} />
      ))}
    </ul>
  );

const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`;

const summary = (loaded: Loaded): string =>
  loaded !== null && 'replies' in loaded
    ? `${plural(loaded.replies.length, 'reply', 'replies')}, ${plural(guestTotal(loaded.replies), 'guest', 'guests')} attending.`
    : 'Replies your guests sent from the website.';

export const RepliesDialog = ({
  open,
  onOpenChange,
  slug,
  editKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  editKey: string;
}) => {
  const [loaded, setLoaded] = useState<Loaded>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setLoaded(null);
    listReplies(slug, editKey)
      .then((result) =>
        setLoaded(result.ok ? { replies: result.value } : { problem: result.problem }),
      )
      .catch(() => undefined);
  }, [open, slug, editKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>RSVP replies</DialogTitle>
          <DialogDescription>{summary(loaded)}</DialogDescription>
        </DialogHeader>
        {loaded === null ? (
          <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
        ) : 'problem' in loaded ? (
          <p className="text-destructive text-sm">{loaded.problem}</p>
        ) : (
          <ReplyList replies={loaded.replies} />
        )}
      </DialogContent>
    </Dialog>
  );
};
