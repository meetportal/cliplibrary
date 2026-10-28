'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { ClipEditorSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { type DecodedVideo, decodeVideo, videoKey } from '@/mcp/video-link';

interface LinkedVideo {
  data: string;
  decoded: DecodedVideo;
}

const readLink = (): LinkedVideo => {
  const data = window.location.hash.slice(1);
  return {
    data,
    decoded:
      data === '' ? { ok: false, error: 'This link does not hold a video.' } : decodeVideo(data),
  };
};

export const SharedVideoEditor = () => {
  const [linked, setLinked] = useState<LinkedVideo | null>(null);

  useEffect(() => {
    const sync = () => setLinked(readLink());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  if (linked === null) {
    return <ClipEditorSkeleton />;
  }

  if (!linked.decoded.ok) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-medium">This video link could not be opened.</p>
        <p className="max-w-sm text-muted-foreground text-sm">{linked.decoded.error}</p>
        <Button asChild variant="outline">
          <Link href="/">Browse the library</Link>
        </Button>
      </div>
    );
  }

  const { video } = linked.decoded;
  return (
    <ClipTimelineEditor
      key={linked.data}
      title={video.title}
      storageKey={`neuclip-video:${videoKey(linked.data)}`}
      initialProject={video.project}
      demoSrc={null}
    />
  );
};
