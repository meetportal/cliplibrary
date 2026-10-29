'use client';

import { Globe, RotateCcw, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccessGate } from '@/components/auth/access-gate';
import { Button } from '@/components/ui/button';
import { publishSite, publishSiteChanges, type SavedSite } from '@/lib/site-api';
import { useSavedDocument } from '@/lib/use-saved-document';
import { useUndoable } from '@/lib/use-undoable';
import {
  checkPublishedSite,
  LOCAL_PHOTO_PROBLEM,
  publicSitePath,
  siteEditorPath,
} from '@/sites/published-site';
import { slugify } from '@/sites/slug';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { HistoryActions } from './editor-actions';
import { PublishDialog } from './publish-dialog';
import { ShareDialog } from './share-dialog';
import { SiteAgent } from './site-agent';
import { SiteWorkspace } from './site-workspace';

type Values = Record<string, unknown>;

export interface OpenedSite {
  id: string;
  slug: string;
  content: Values;
  updatedAt: string;
}

interface Published {
  site: SavedSite;
  content: Values;
}

const isValues = (value: unknown): value is Values =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const holdsLocalPhoto = (values: Values): boolean => /"(blob|data):/.test(JSON.stringify(values));

const statusText = (localPhoto: boolean, problem: string | null, unpublished: boolean) => {
  if (localPhoto) {
    return LOCAL_PHOTO_PROBLEM;
  }
  return problem ?? (unpublished ? 'Unpublished changes' : null);
};

const Editor = ({ template, opened }: { template: SiteTemplate; opened: OpenedSite | null }) => {
  const start = opened?.content ?? template.defaults;
  const history = useUndoable<Values>(start);
  const [published, setPublished] = useState<Published | null>(
    opened === null ? null : { site: opened, content: opened.content },
  );
  const [publishing, setPublishing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [host, setHost] = useState('');
  const { ready, guard, dialog } = useAccessGate();
  const values = history.value;

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const clearDraft = useSavedDocument<Values>({
    key:
      published === null
        ? `neuclip-site-draft:${template.id}`
        : `neuclip-site:${published.site.id}:${published.site.updatedAt}`,
    value: values,
    parse: (saved) => (isValues(saved) && template.schema.safeParse(saved).success ? saved : null),
    restore: history.reset,
  });

  const markPublished = (site: SavedSite) => {
    clearDraft();
    setProblem(null);
    setPublished({ site, content: values });
  };

  const publish = async (slug: string): Promise<string | null> => {
    const checked = checkPublishedSite({ slug, templateId: template.id, content: values });
    if (!checked.ok) {
      return checked.error;
    }
    const result = await publishSite(checked.site);
    if (!result.ok) {
      return result.problem;
    }
    markPublished(result.value.site);
    setPublishing(false);
    setSharing(true);
    window.history.replaceState(null, '', siteEditorPath(result.value.site.id));
    return null;
  };

  const publishChanges = async ({ site }: Published) => {
    const result = await publishSiteChanges(site.id, { slug: site.slug, content: values });
    if (result.ok) {
      markPublished(result.value.site);
    } else {
      setProblem(result.problem);
    }
  };

  const dirty = published === null || published.content !== values;
  const addressSlug = published?.site.slug ?? slugify(template.headline(values));
  const localPhoto = holdsLocalPhoto(values);

  const onPrimary = () =>
    guard(() => {
      if (published === null) {
        setPublishing(true);
      } else if (dirty) {
        publishChanges(published).catch(() => setProblem('Could not reach the server.'));
      } else {
        setSharing(true);
      }
    });

  return (
    <SiteAgent
      chatKey={`neuclip-site:${opened?.id ?? template.id}`}
      template={template}
      values={values}
      onChange={history.set}
    >
      <SiteWorkspace
        template={template}
        values={values}
        onChange={history.set}
        address={`${host}/s/${addressSlug}`}
        liveUrl={published !== null && !dirty ? publicSitePath(published.site.slug) : null}
        status={statusText(localPhoto, problem, dirty && published !== null)}
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
        <ShareDialog open={sharing} onOpenChange={setSharing} site={published.site} />
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
