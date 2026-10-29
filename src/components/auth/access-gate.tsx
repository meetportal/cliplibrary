'use client';

import { Hourglass } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { PENDING_MESSAGE } from '@/auth/approval';
import { signInHref } from '@/auth/links';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAccount } from './use-account';

export const PendingNotice = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-4 text-amber-900 text-sm dark:text-amber-200">
      <Hourglass className="mt-0.5 size-4 shrink-0" />
      <p>{PENDING_MESSAGE}</p>
    </div>
  </div>
);

export const useAccessGate = (): {
  ready: boolean;
  guard: (action: () => void) => void;
  dialog: ReactNode;
} => {
  const { loaded, user } = useAccount();
  const [pending, setPending] = useState(false);

  const guard = (action: () => void) => {
    if (!loaded) {
      return;
    }
    if (user === null) {
      window.location.assign(signInHref(window.location.pathname + window.location.search));
    } else if (user.approved) {
      action();
    } else {
      setPending(true);
    }
  };

  const dialog = (
    <Dialog open={pending} onOpenChange={setPending}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Waiting for approval</DialogTitle>
          <DialogDescription>{PENDING_MESSAGE}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return { ready: loaded, guard, dialog };
};
