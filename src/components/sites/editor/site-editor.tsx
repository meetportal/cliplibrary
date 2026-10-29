'use client';

import { Globe, RotateCcw, Share2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAccessGate } from '@/components/auth/access-gate';
import { Button } from '@/components/ui/button';
import { publishSite } from '@/lib/site-api';
import { useSavedDocument } from '@/lib/use-saved-document';
import { useUndoable } from '@/lib/use-undoable';
import { checkSharedSite, LOCAL_PHOTO_PROBLEM } from '@/sites/site-link';
import { slugify } from '@/sites/slug';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { HistoryActions } from './editor-actions';
import { PublishDialog } from './publish-dialog';
import { type PublishedLinks, ShareDialog } from './share-dialog';
import { SiteAgent } from './site-agent';
import { SiteWorkspace } from './site-workspace';

type Values = Record<string, unknown>;

export interface OpenedSite {
  slug: string;
  content: Values;
  links: PublishedLinks;
}

const isValues = (value: unknown): value is Values =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const holdsLocalPhoto = (values: Values): boolean => /"(blob|data):/.test(JSON.stringify(values));

const Editor = ({ template, opened }: { template: SiteTemplate; opened: OpenedSite | null }) => {
  const start = opened?.content ?? template.defaults;
  const history = useUndoable<Values>(start);
  const [published, setPublished] = useState<{ links: PublishedLinks; content: Values } | null>(
    opened === null ? null : { links: opened.links, content: opened.content },
  );
  const [publishing, setPublishing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [host, setHost] = useState('');
  const { ready, guard, dialog } = useAccessGate();
  const values = history.value;

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const clearDraft = useSavedDocument<Values>({
    key:
      opened === null
        ? `neuclip-site-draft:${template.id}`
        : `neuclip-site-link:${opened.links.editPath.slice(-24)}`,
    value: values,
    parse: (saved) => (isValues(saved) && template.schema.safeParse(saved).success ? saved : null),
    restore: history.reset,
  });

  const publish = useCallback(
    async (slug: string): Promise<string | null> => {
      const site = { slug, templateId: template.id, content: values };
      const checked = checkSharedSite(site);
      if (!checked.ok) {
        return checked.error;
      }
      const result = await publishSite(checked.site);
      if (!result.ok) {
        return result.problem;
      }
      const links = { slug, ...result.value };
      setPublished({ links, content: values });
      setPublishing(false);
      setSharing(true);
      window.history.replaceState(null, '', links.editPath);
      return null;
    },
    [template.id, values],
  );

  const dirty = published === null || published.content !== values;
  const addressSlug = published?.links.slug ?? slugify(template.headline(values));
  const localPhoto = holdsLocalPhoto(values);

  const onPrimary = () =>
    guard(() => {
      if (published !== null && !dirty) {
        setSharing(true);
      } else if (published === null) {
        setPublishing(true);
      } else {
        publish(published.links.slug).catch(() => undefined);
      }
    });

  return (
    <SiteAgent
      chatKey={`neuclip-site:${template.id}`}
      template={template}
      values={values}
      onChange={history.set}
    >
      <SiteWorkspace
        template={template}
        values={values}
        onChange={history.set}
        address={`${host}/s/${addressSlug}`}
        liveUrl={published !== null && !dirty ? published.links.sitePath : null}
        status={
          localPhoto
            ? LOCAL_PHOTO_PROBLEM
            : dirty && published !== null
              ? 'Unpublished changes'
              : null
        }
        toolbar={
          <>
            <HistoryActions history={history} />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                clearDraft();
                history.set(published?.content ?? template.defaults);
              }}
            >
              <RotateCcw />
              <span className="sr-only sm:not-sr-only">Reset</span>
            </Button>
            <Button type="button" size="sm" disabled={localPhoto || !ready} onClick={onPrimary}>
              {published !== null && !dirty ? <Share2 /> : <Globe />}
              {published === null ? 'Publish' : dirty ? 'Publish changes' : 'Share'}
            </Button>
          </>
        }
      />
      <PublishDialog
        open={publishing}
        onOpenChange={setPublishing}
        suggestion={template.headline(values)}
        onPublish={publish}
      />
      {published === null ? null : (
        <ShareDialog open={sharing} onOpenChange={setSharing} links={published.links} />
      )}
      {dialog}
    </SiteAgent>
  );
};

export const SiteEditor = ({
  templateId,
  opened,
}: {
  templateId: string;
  opened: OpenedSite | null;
}) => {
  const template = findSiteTemplate(templateId);
  return template === undefined ? null : <Editor template={template} opened={opened} />;
};
