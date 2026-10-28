import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { seedProjectForClip } from '@/core';
import { clipPreviewVideo } from '@/lib/clips';
import { CLIP_IDS, getClipMeta, isClipId } from '@/schemas';

export const dynamicParams = false;

export const generateStaticParams = () => CLIP_IDS.map((clipId) => ({ clipId }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ clipId: string }>;
}): Promise<Metadata> => {
  const { clipId } = await params;
  return { title: isClipId(clipId) ? `${getClipMeta(clipId).title} · Clip Library` : 'Clip' };
};

const ClipEditorPage = async ({ params }: { params: Promise<{ clipId: string }> }) => {
  const { clipId } = await params;
  if (!isClipId(clipId)) {
    notFound();
  }

  return (
    <ClipTimelineEditor
      title={getClipMeta(clipId).title}
      chatKey={clipId}
      initialProject={seedProjectForClip(clipId)}
      demoSrc={clipPreviewVideo(clipId)}
    />
  );
};

export default ClipEditorPage;
