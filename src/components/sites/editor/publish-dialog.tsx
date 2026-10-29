'use client';

import { Check, Globe, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkSlug, createSite } from '@/lib/site-api';
import { slugify, slugProblem } from '@/sites/slug';

type SlugCheck = { slug: string; problem: string | null } | null;

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  suggestion: string;
  content: unknown;
  disabled: boolean;
  onPublished: (slug: string, editKey: string) => void;
}

const useSlugCheck = (slug: string): SlugCheck => {
  const [check, setCheck] = useState<SlugCheck>(null);
  useEffect(() => {
    const local = slugProblem(slug);
    if (local !== null) {
      setCheck({ slug, problem: local });
      return;
    }
    setCheck(null);
    const timer = setTimeout(() => {
      checkSlug(slug)
        .then((result) =>
          setCheck({ slug, problem: result.ok ? result.value.problem : result.problem }),
        )
        .catch(() => undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug]);
  return check?.slug === slug ? check : null;
};

export const PublishDialog = ({
  open,
  onOpenChange,
  templateId,
  suggestion,
  content,
  disabled,
  onPublished,
}: PublishDialogProps) => {
  const [slug, setSlug] = useState(() => slugify(suggestion));
  const [touched, setTouched] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [host, setHost] = useState('');
  const check = useSlugCheck(slug);

  useEffect(() => {
    setHost(window.location.host);
  }, []);
  const ready = check !== null && check.problem === null && !publishing && !disabled;

  useEffect(() => {
    if (open && !touched) {
      setSlug(slugify(suggestion));
    }
  }, [open, suggestion, touched]);

  const publish = async () => {
    setPublishing(true);
    setFailure(null);
    const result = await createSite(slug, templateId, content);
    setPublishing(false);
    if (result.ok) {
      onPublished(result.value.slug, result.value.editKey);
    } else {
      setFailure(result.problem);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish your website</DialogTitle>
          <DialogDescription>
            Pick the address guests will open. You can keep editing after it is live.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) {
              publish().catch(() => undefined);
            }
          }}
        >
          <Label htmlFor="site-slug">Website address</Label>
          <div className="flex items-center overflow-hidden rounded-md bg-muted text-sm">
            <span className="shrink-0 pl-3 text-muted-foreground">{host}/s/</span>
            <Input
              id="site-slug"
              value={slug}
              autoFocus
              spellCheck={false}
              onChange={(event) => {
                setTouched(true);
                setSlug(event.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              className="rounded-none bg-transparent pl-0.5 shadow-none focus-visible:ring-0"
            />
          </div>
          <p className="flex min-h-5 items-center gap-1.5 text-xs" aria-live="polite">
            {check === null ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Checking
              </span>
            ) : check.problem === null ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
                This address is free
              </span>
            ) : (
              <span className="text-destructive">{check.problem}</span>
            )}
          </p>
          {failure === null ? null : <p className="text-destructive text-sm">{failure}</p>}
          {disabled ? (
            <p className="text-muted-foreground text-sm">
              Wait for your photos to finish uploading.
            </p>
          ) : null}
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={!ready}>
              {publishing ? <Loader2 className="animate-spin" /> : <Globe />}
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
