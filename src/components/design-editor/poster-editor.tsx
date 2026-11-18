'use client';

import dynamic from 'next/dynamic';
import { DesignEditorSkeleton } from '@/components/skeletons';
import type { Design } from '@/design';

const DesignEditor = dynamic(
  () => import('./design-editor').then(({ DesignEditor: Editor }) => Editor),
  { ssr: false, loading: () => <DesignEditorSkeleton /> },
);

interface PosterEditorProps {
  posterId: string;
  design: Design;
}

export const PosterEditor = ({ posterId, design }: PosterEditorProps) => (
  <DesignEditor
    initialDesign={design}
    storageKey={`neuclip-poster:${posterId}`}
    backHref="/?type=poster"
    initialPanel="theme"
  />
);
