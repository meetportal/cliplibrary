'use client';

import { SiteCanvas } from './site-canvas';
import { bindSite } from './site-registry';
import type { SubmitRsvp } from './site-view';

interface PublicSiteProps {
  templateId: string;
  content: unknown;
  slug: string | null;
}

export const PublicSite = ({ templateId, content, slug }: PublicSiteProps) => {
  const site = bindSite(templateId, content);
  if (site === null) {
    return (
      <p className="p-10 text-center text-muted-foreground">This website could not be shown.</p>
    );
  }
  const onRsvp: SubmitRsvp = async (reply) => {
    if (slug === null) {
      return;
    }
    const response = await fetch(`/api/sites/${slug}/rsvp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(reply),
    });
    if (!response.ok) {
      throw new Error(`RSVP failed with ${response.status}`);
    }
  };
  return <SiteCanvas site={site} layout="page" introRun={1} onRsvp={onRsvp} />;
};
