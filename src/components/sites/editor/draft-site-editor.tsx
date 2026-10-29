'use client';

import { Globe, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSavedDocument } from '@/lib/use-saved-document';
import { useUndoable } from '@/lib/use-undoable';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { rememberEditKey } from './edit-keys';
import { HistoryActions } from './editor-actions';
import { PublishDialog } from './publish-dialog';
import { SiteWorkspace } from './site-workspace';
import { usePhotoUploads } from './use-photo-uploads';

type Values = Record<string, unknown>;

const isValues = (value: unknown): value is Values =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const DraftEditor = ({ template }: { template: SiteTemplate }) => {
  const router = useRouter();
  const history = useUndoable<Values>(template.defaults);
  const latest = useRef(history.value);
  latest.current = history.value;
  const [introRun, setIntroRun] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const clearDraft = useSavedDocument<Values>({
    key: `neuclip-site-draft:${template.id}`,
    value: history.value,
    parse: (saved) => (isValues(saved) && template.schema.safeParse(saved).success ? saved : null),
    restore: history.reset,
  });

  const { set } = history;
  const apply = useCallback(
    (swap: (current: Values) => Values) => set(swap(latest.current)),
    [set],
  );
  const photos = usePhotoUploads(apply);

  const onChange = (next: Values) => {
    history.set(next);
    photos.upload(next);
  };

  const onPublished = (slug: string, editKey: string) => {
    rememberEditKey(slug, editKey);
    clearDraft();
    router.push(`/s/${slug}/edit?published=1`);
  };

  return (
    <>
      <SiteWorkspace
        template={template}
        values={history.value}
        onChange={onChange}
        introRun={introRun}
        status={
          photos.uploading ? 'Uploading photo' : (photos.problem ?? 'Draft, saved in this browser')
        }
        toolbar={
          <>
            <HistoryActions history={history} onPlayIntro={() => setIntroRun(introRun + 1)} />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                clearDraft();
                history.set(template.defaults);
              }}
            >
              <RotateCcw />
              <span className="sr-only sm:not-sr-only">Reset</span>
            </Button>
            <Button type="button" size="sm" onClick={() => setPublishing(true)}>
              <Globe />
              Publish
            </Button>
          </>
        }
      />
      <PublishDialog
        open={publishing}
        onOpenChange={setPublishing}
        templateId={template.id}
        suggestion={template.headline(history.value)}
        content={history.value}
        disabled={photos.uploading}
        onPublished={onPublished}
      />
    </>
  );
};

export const DraftSiteEditor = ({ templateId }: { templateId: string }) => {
  const template = findSiteTemplate(templateId);
  return template === undefined ? null : <DraftEditor template={template} />;
};
