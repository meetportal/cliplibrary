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
import { editSiteUrl, publicSiteUrl } from './edit-keys';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  editKey: string;
  justPublished: boolean;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  slug,
  editKey,
  justPublished,
}: ShareDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{justPublished ? 'Your website is live' : 'Share your website'}</DialogTitle>
        <DialogDescription>
          Send the website link to your guests. Keep the edit link for yourself.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-5">
        <CopyField
          id="share-public"
          label="Website link"
          value={publicSiteUrl(slug)}
          hint="Anyone with this link can view the website and RSVP."
        />
        <CopyField
          id="share-edit"
          label="Private edit link"
          value={editSiteUrl(slug, editKey)}
          hint="Opens this editor on any device. Do not share it with guests."
        />
        <Button asChild variant="outline" className="self-start">
          <a href={`/s/${slug}`} target="_blank" rel="noreferrer">
            <ExternalLink />
            Open website
          </a>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
