'use client';

import Link from 'next/link';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { ClipEditorSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { useLiveSession } from '@/lib/use-live';
import { LiveActivityFeed } from './live-activity-feed';

export const LiveSessionEditor = ({ sessionId }: { sessionId: string }) => {
  const { status, missing, session, project, publish } = useLiveSession(sessionId);

  if (missing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-medium">This live video is not on the server.</p>
        <p className="max-w-sm text-muted-foreground text-sm">
          Live videos are kept in memory, so they are gone once the live server restarts.
        </p>
        <Button asChild variant="outline">
          <Link href="/live">All live videos</Link>
        </Button>
      </div>
    );
  }

  if (session === null || project === null) {
    return <ClipEditorSkeleton />;
  }

  return (
    <ClipTimelineEditor
      key={session.id}
      title={session.title}
      storageKey={`cliplibrary-live-${session.id}`}
      initialProject={project}
      demoSrc={null}
      sync={{ remote: project, publish }}
      sidebar={<LiveActivityFeed status={status} activity={session.activity} />}
    />
  );
};
