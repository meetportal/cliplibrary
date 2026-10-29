'use client';

import { ExternalLink, Inbox, Share2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUndoable } from '@/lib/use-undoable';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { recallEditKey, rememberEditKey } from './edit-keys';
import { HistoryActions } from './editor-actions';
import { RepliesDialog } from './replies-dialog';
import { ShareDialog } from './share-dialog';
import { SiteWorkspace } from './site-workspace';
import { type SaveState, useAutosave } from './use-autosave';
import { usePhotoUploads } from './use-photo-uploads';

type Values = Record<string, unknown>;

interface PublishedSiteEditorProps {
  slug: string;
  templateId: string;
  content: Values;
  justPublished: boolean;
}

const readEditKey = (slug: string): string | null => {
  const fromLink = new URLSearchParams(window.location.hash.slice(1)).get('key');
  if (fromLink !== null && fromLink !== '') {
    rememberEditKey(slug, fromLink);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    return fromLink;
  }
  return recallEditKey(slug);
};

const describeSave = (state: SaveState, uploading: boolean, problem: string | null): string => {
  if (uploading) {
    return 'Uploading photo';
  }
  if (problem !== null) {
    return problem;
  }
  if (state.kind === 'pending') {
    return 'Saving';
  }
  return state.kind === 'failed' ? state.problem : 'All changes are live';
};

const MissingKey = ({ slug }: { slug: string }) => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
    <h1 className="font-semibold text-xl">Open your private edit link</h1>
    <p className="text-muted-foreground text-sm">
      This browser does not have the edit key for this website. Open the private edit link you saved
      when you published it.
    </p>
    <Button asChild variant="outline">
      <a href={`/s/${slug}`}>
        <ExternalLink />
        View the website
      </a>
    </Button>
  </div>
);

const Editor = ({
  slug,
  template,
  content,
  editKey,
  justPublished,
}: {
  slug: string;
  template: SiteTemplate;
  content: Values;
  editKey: string;
  justPublished: boolean;
}) => {
  const history = useUndoable<Values>(content);
  const latest = useRef(history.value);
  latest.current = history.value;
  const [introRun, setIntroRun] = useState(0);
  const [sharing, setSharing] = useState(justPublished);
  const [showReplies, setShowReplies] = useState(false);

  const { set } = history;
  const apply = useCallback(
    (swap: (current: Values) => Values) => set(swap(latest.current)),
    [set],
  );
  const photos = usePhotoUploads(apply);
  const valid = template.schema.safeParse(history.value).success;
  const save = useAutosave({
    slug,
    editKey,
    value: history.value,
    ready: valid && !photos.uploading,
  });

  return (
    <>
      <SiteWorkspace
        template={template}
        values={history.value}
        onChange={(next) => {
          history.set(next);
          photos.upload(next);
        }}
        introRun={introRun}
        status={describeSave(save, photos.uploading, photos.problem)}
        toolbar={
          <>
            <HistoryActions history={history} onPlayIntro={() => setIntroRun(introRun + 1)} />
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowReplies(true)}>
              <Inbox />
              <span className="sr-only sm:not-sr-only">Replies</span>
            </Button>
            <Button type="button" size="sm" onClick={() => setSharing(true)}>
              <Share2 />
              Share
            </Button>
          </>
        }
      />
      <ShareDialog
        open={sharing}
        onOpenChange={setSharing}
        slug={slug}
        editKey={editKey}
        justPublished={justPublished}
      />
      <RepliesDialog
        open={showReplies}
        onOpenChange={setShowReplies}
        slug={slug}
        editKey={editKey}
      />
    </>
  );
};

export const PublishedSiteEditor = ({
  slug,
  templateId,
  content,
  justPublished,
}: PublishedSiteEditorProps) => {
  const [editKey, setEditKey] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    setEditKey(readEditKey(slug));
  }, [slug]);
  const template = findSiteTemplate(templateId);
  if (template === undefined || editKey === undefined) {
    return null;
  }
  if (editKey === null) {
    return <MissingKey slug={slug} />;
  }
  return (
    <Editor
      slug={slug}
      template={template}
      content={content}
      editKey={editKey}
      justPublished={justPublished}
    />
  );
};
