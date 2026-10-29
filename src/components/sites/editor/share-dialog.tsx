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
import type { SavedSite } from '@/lib/site-api';
import { publicSitePath, siteEditorPath } from '@/sites/published-site';
import { CopyField } from './copy-field';

export const ShareDialog = ({
  open,
  onOpenChange,
  site,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: SavedSite;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Your website is live</DialogTitle>
        <DialogDescription>
          Send the website link to your guests. Changes you publish later show up at the same link,
          and the website stays under Websites in your account.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-5">
        <CopyField
          id="share-public"
          label="Website link"
          value={`${window.location.origin}${publicSitePath(site.slug)}`}
          hint="Anyone with this link can open the website."
        />
        <CopyField
          id="share-edit"
          label="Edit link"
          value={`${window.location.origin}${siteEditorPath(site.id)}`}
          hint="Opens this website in the editor. Only you can use it."
        />
        <Button asChild variant="outline" className="self-start">
          <a href={publicSitePath(site.slug)} target="_blank" rel="noreferrer">
            <ExternalLink />
            Open website
          </a>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
