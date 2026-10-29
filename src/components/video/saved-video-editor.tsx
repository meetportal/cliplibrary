'use client';

import { useCallback } from 'react';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { saveVideo } from '@/lib/site-api';
import type { Project } from '@/project';

interface SavedVideoEditorProps {
  id: string;
  title: string;
  project: Project;
  owned: boolean;
}

export const SavedVideoEditor = ({ id, title, project, owned }: SavedVideoEditorProps) => {
  const save = useCallback(
    (next: Project) => {
      saveVideo(id, next).catch(() => undefined);
    },
    [id],
  );
  return (
    <ClipTimelineEditor
      title={title}
      storageKey={`neuclip-video:${id}`}
      initialProject={project}
      demoSrc={null}
      onSave={owned ? save : undefined}
    />
  );
};
