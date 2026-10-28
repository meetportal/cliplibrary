'use client';

import type { PlayerRef } from '@remotion/player';
import dynamic from 'next/dynamic';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AgentWorkspace } from '@/components/media-agent/agent-workspace';
import { ClipPreviewSkeleton } from '@/components/skeletons';
import { Timeline } from '@/components/timeline/timeline';
import { TimelineToolbar } from '@/components/timeline/timeline-toolbar';
import { preloadProjectScenes } from '@/compositions/scene-loader';
import { createFrameStore } from '@/lib/frame-store';
import { clampPxPerFrame, DEFAULT_PX_PER_FRAME, fitPxPerFrame } from '@/lib/timeline-geometry';
import { DEFAULT_EXPORT_SETTINGS, useProjectExport } from '@/lib/use-project-export';
import { useUndoable, useUndoRedoKeys } from '@/lib/use-undoable';
import { cn } from '@/lib/utils';
import {
  addElement,
  addTrack,
  createCompositionElement,
  createImageElement,
  createShapeElement,
  createTextElement,
  createTrack,
  createVideoElement,
  type Element,
  type ElementType,
  findElement,
  moveElement,
  moveElementToTrack,
  moveTrack,
  type Project,
  removeElement,
  removeTrack,
  replaceElement,
  resizeElement,
  trimElementStart,
} from '@/project';
import { CLIP_DEFAULTS, CLIP_REGISTRY, type ClipId, getClipMeta } from '@/schemas';
import { ClipPropertySidebar } from './clip-property-sidebar';
import { ClipTimelineHeader } from './clip-timeline-header';
import { type MobilePanel, MobilePanelSwitch } from './mobile-panel-switch';

const ClipPreview = dynamic(() => import('./clip-preview').then((mod) => mod.ClipPreview), {
  ssr: false,
  loading: () => <ClipPreviewSkeleton />,
});

const makeElement = (type: ElementType, from: number): Element => {
  if (type === 'text') {
    return createTextElement({ from });
  }
  if (type === 'image') {
    return createImageElement({ from });
  }
  if (type === 'video') {
    return createVideoElement({ from });
  }
  return createShapeElement('rect', { from });
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

const runModifierShortcut = (event: KeyboardEvent, exportProject: () => void): boolean => {
  if (!(event.metaKey || event.ctrlKey)) {
    return false;
  }
  if (event.key.toLowerCase() === 'e') {
    event.preventDefault();
    exportProject();
  }
  return true;
};

const toFileName = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'export';

const ANIMATION_OPTIONS = CLIP_REGISTRY.map((meta) => ({ id: meta.id, title: meta.title }));

interface ProjectSync {
  remote: Project;
  publish: (project: Project) => void;
}

const PUBLISH_DELAY_MS = 120;

const useProjectSync = (
  project: Project,
  setProject: (next: Project) => void,
  sync: ProjectSync | undefined,
): void => {
  const lastRemote = useRef<Project | null>(null);
  const publish = useRef(sync?.publish);
  publish.current = sync?.publish;
  const remote = sync?.remote;

  useEffect(() => {
    if (remote === undefined || remote === lastRemote.current) {
      return;
    }
    lastRemote.current = remote;
    setProject(remote);
  }, [remote, setProject]);

  useEffect(() => {
    if (lastRemote.current === null || project === lastRemote.current) {
      return;
    }
    const timer = setTimeout(() => publish.current?.(project), PUBLISH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [project]);
};

interface ClipTimelineEditorProps {
  title: string;
  initialProject: Project;
  demoSrc: string | null;
  sync?: ProjectSync;
  sidebar?: ReactNode;
}

export const ClipTimelineEditor = ({
  title,
  initialProject,
  demoSrc,
  sync,
  sidebar,
}: ClipTimelineEditorProps) => {
  const editor = useUndoable<Project>(initialProject);
  const {
    value: project,
    set: setProject,
    setLive: setProjectLive,
    seal: sealProject,
    undo,
    redo,
  } = editor;
  useUndoRedoKeys(undo, redo);
  useProjectSync(project, setProject, sync);
  const exporter = useProjectExport();
  const fileName = toFileName(title);

  const playerRef = useRef<PlayerRef | null>(null);
  const [frames] = useState(createFrameStore);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => project.tracks[0]?.elements[0]?.id ?? null,
  );
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [pxPerFrame, setPxPerFrame] = useState(DEFAULT_PX_PER_FRAME);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('properties');

  const activeTrack = activeTrackId ?? project.tracks[0]?.id ?? null;
  const selectedElement =
    selectedId === null ? null : (findElement(project, selectedId)?.element ?? null);

  const durationInFrames = project.durationInFrames;
  const fitTimeline = useCallback(() => {
    setPxPerFrame(fitPxPerFrame(durationInFrames, window.innerWidth));
  }, [durationInFrames]);

  useEffect(() => {
    fitTimeline();
    let fittedWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== fittedWidth) {
        fittedWidth = window.innerWidth;
        fitTimeline();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitTimeline]);

  useEffect(() => {
    preloadProjectScenes(
      initialProject.tracks.flatMap((track) =>
        track.elements.flatMap((element) =>
          element.type === 'composition' ? [element.clipId] : [],
        ),
      ),
    ).catch(() => undefined);
  }, [initialProject]);

  const seek = useCallback(
    (frame: number) => {
      playerRef.current?.seekTo(frame);
      frames.set(frame);
    },
    [frames],
  );

  const handleAddElement = (type: ElementType): void => {
    if (activeTrack === null) {
      return;
    }
    const element = makeElement(type, frames.get());
    setProject(addElement(project, activeTrack, element));
    setSelectedId(element.id);
  };

  const handleAddAnimation = (animationId: string): void => {
    if (activeTrack === null) {
      return;
    }
    const sceneId = animationId as ClipId;
    const element = createCompositionElement(
      sceneId,
      CLIP_DEFAULTS[sceneId] as Record<string, unknown>,
      { from: frames.get(), durationInFrames: getClipMeta(sceneId).durationInFrames },
    );
    setProject(addElement(project, activeTrack, element));
    setSelectedId(element.id);
  };

  const handleDelete = useCallback(
    (id: string) => {
      setProject(removeElement(project, id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [project, setProject],
  );

  const exportShortcut = useRef<() => void>(() => undefined);
  exportShortcut.current = () => exporter.run(project, DEFAULT_EXPORT_SETTINGS, fileName);

  useEffect(() => {
    const onGestureEnd = () => sealProject();
    window.addEventListener('pointerup', onGestureEnd);
    window.addEventListener('focusout', onGestureEnd);
    return () => {
      window.removeEventListener('pointerup', onGestureEnd);
      window.removeEventListener('focusout', onGestureEnd);
    };
  }, [sealProject]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (runModifierShortcut(event, exportShortcut.current)) {
        return;
      }
      if (isEditableTarget(event.target)) {
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        playerRef.current?.toggle();
      } else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId !== null) {
        event.preventDefault();
        handleDelete(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, handleDelete]);

  return (
    <AgentWorkspace
      kind="clip"
      title={title}
      document={project}
      focus={selectedId === null ? [] : [selectedId]}
      onChange={setProject}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={cn(
            'flex min-h-0 flex-col lg:flex-1 lg:flex-row',
            mobilePanel === 'properties' ? 'flex-1' : 'flex-none',
          )}
        >
          <section className="flex h-[min(46dvh,26rem)] shrink-0 flex-col bg-muted/30 lg:h-auto lg:min-h-0 lg:flex-1">
            <ClipPreview
              project={project}
              demoSrc={demoSrc}
              playerRef={playerRef}
              onFrameChange={frames.set}
              onPlayingChange={setPlaying}
            />
          </section>
          <MobilePanelSwitch active={mobilePanel} onChange={setMobilePanel} />
          <aside
            className={cn(
              'min-h-0 flex-col overflow-y-auto border-border bg-sidebar lg:flex lg:w-[320px] xl:w-[360px] 2xl:w-[420px] lg:flex-none lg:shrink-0 lg:border-l',
              mobilePanel === 'properties' ? 'flex flex-1' : 'hidden',
            )}
          >
            <ClipTimelineHeader title={title} />
            {sidebar}
            <ClipPropertySidebar
              element={selectedElement}
              onChange={(next) => setProjectLive(replaceElement(project, next))}
              onDelete={handleDelete}
            />
          </aside>
        </div>
        <div
          className={cn(
            'min-h-0 flex-col border-border border-t bg-sidebar lg:flex lg:h-[clamp(12rem,30dvh,20rem)] lg:flex-none lg:shrink-0',
            mobilePanel === 'timeline' ? 'flex flex-1' : 'hidden',
          )}
        >
          <TimelineToolbar
            pxPerFrame={pxPerFrame}
            playing={playing}
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            exportState={exporter.state}
            exportProgress={exporter.progress}
            download={exporter.download}
            exportError={exporter.error}
            animations={ANIMATION_OPTIONS}
            onAddElement={handleAddElement}
            onAddAnimation={handleAddAnimation}
            onAddTrack={() =>
              setProject(addTrack(project, createTrack(`Track ${project.tracks.length + 1}`)))
            }
            onZoom={(next) => setPxPerFrame(clampPxPerFrame(next))}
            onFit={fitTimeline}
            onTogglePlay={() => playerRef.current?.toggle()}
            onUndo={undo}
            onRedo={redo}
            onExport={(settings) => exporter.run(project, settings, fileName)}
          />
          <div className="min-h-0 flex-1">
            <Timeline
              project={project}
              pxPerFrame={pxPerFrame}
              frames={frames}
              selectedId={selectedId}
              activeTrackId={activeTrack}
              onSeek={seek}
              onActivateTrack={setActiveTrackId}
              onSelectElement={setSelectedId}
              onMoveElement={(id, from) => setProjectLive(moveElement(project, id, from))}
              onResizeElement={(id, duration) =>
                setProjectLive(resizeElement(project, id, duration))
              }
              onTrimElementStart={(id, from) => setProjectLive(trimElementStart(project, id, from))}
              onMoveElementToTrack={(id, trackId) =>
                setProjectLive(moveElementToTrack(project, id, trackId))
              }
              onMoveTrack={(id, direction) => setProject(moveTrack(project, id, direction))}
              onRemoveTrack={(id) => setProject(removeTrack(project, id))}
            />
          </div>
        </div>
      </div>
    </AgentWorkspace>
  );
};
