'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CopyField } from './copy-field';

export interface PublishedLinks {
  slug: string;
  sitePath: string;
  editPath: string;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  links,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: PublishedLinks;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Your website is live</DialogTitle>
        <DialogDescription>
          Send the website link to your guests. Keep the edit link to change it later; each change
          gives you a new link.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-5">
        <CopyField
          id="share-public"
          label="Website link"
          value={`${window.location.origin}${links.sitePath}`}
          hint="Anyone with this link can open the website."
        />
        <CopyField
          id="share-edit"
          label="Edit link"
          value={`${window.location.origin}${links.editPath}`}
          hint="Opens this website in the editor so you can publish a new version."
        />
        <Button asChild variant="outline" className="self-start">
          <a href={links.sitePath} target="_blank" rel="noreferrer">
            <ExternalLink />
            Open website
          </a>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
