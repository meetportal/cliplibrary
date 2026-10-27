'use client';

import {
  Camera,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  PaintBucket,
  Shapes,
  SlidersHorizontal,
  Type,
  Upload,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaAgent } from '@/components/media-agent/media-agent';
import {
  createImage,
  type Design,
  type DesignElement,
  designSchema,
  fitInside,
  type Point,
} from '@/design';
import { cn } from '@/lib/utils';
import { CanvasWorkspace } from './canvas-workspace';
import { EditorContextMenu } from './context-menu';
import { DocumentColorsProvider } from './document-colors';
import { EditorHeader } from './editor-header';
import { EditorSidebar, type SidebarPanel } from './editor-sidebar';
import { exportImage } from './export-design';
import { useFontsVersion } from './font-loader';
import { PropertiesPanel } from './panels/properties-panel';
import { type LoadedImage, readImageFile } from './read-image-file';
import { ShortcutsDialog } from './shortcuts-dialog';
import { BackgroundPanel } from './sidebar/background-panel';
import { ElementsPanel } from './sidebar/elements-panel';
import { LayersPanel } from './sidebar/layers-panel';
import { PhotosPanel } from './sidebar/photos-panel';
import { TemplatesPanel } from './sidebar/templates-panel';
import { TextPanel } from './sidebar/text-panel';
import { UploadsPanel } from './sidebar/uploads-panel';
import { useDesignEditor } from './use-design-editor';
import { useEditorShortcuts, type ZoomDirection } from './use-editor-shortcuts';
import { useSelectionActions } from './use-selection-actions';
import type { Viewport } from './use-workspace-viewport';

const ZOOM_STEPS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4, 6, 8];

const stepZoom = (zoom: number, direction: 'in' | 'out'): number =>
  direction === 'in'
    ? (ZOOM_STEPS.find((step) => step > zoom + 0.001) ?? zoom)
    : ([...ZOOM_STEPS].reverse().find((step) => step < zoom - 0.001) ?? zoom);

interface DesignEditorProps {
  initialDesign: Design;
  backHref: string;
  storageKey: string;
  initialPanel?: string;
}

const readSaved = (key: string): Design | null => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed = designSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

const forgetSaved = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
};

export const DesignEditor = ({
  initialDesign,
  backHref,
  storageKey,
  initialPanel,
}: DesignEditorProps) => {
  const editor = useDesignEditor(initialDesign);
  const { design } = editor;
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [uploads, setUploads] = useState<LoadedImage[]>([]);
  const restored = useRef(false);

  const fitMargin = viewport.width < 640 ? 32 : 96;
  const fitZoom =
    viewport.width === 0
      ? 0.4
      : Math.max(
          0.05,
          Math.min(
            (viewport.width - fitMargin) / design.width,
            (viewport.height - fitMargin) / design.height,
          ),
        );
  const zoom = userZoom ?? fitZoom;

  const fonts = useMemo(
    () =>
      design.elements.flatMap((element) => (element.type === 'text' ? [element.fontFamily] : [])),
    [design.elements],
  );
  const fontsVersion = useFontsVersion(fonts);

  useEffect(() => {
    if (restored.current) {
      return;
    }
    restored.current = true;
    const saved = readSaved(storageKey);
    if (saved !== null) {
      editor.load(saved);
    }
  }, [editor.load, storageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(design));
      } catch {
        return;
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [design, storageKey]);

  const imageElement = useCallback(
    (image: LoadedImage, point?: Point, index = 0): DesignElement => {
      const size = fitInside(image.width, image.height, design.width * 0.6, design.height * 0.6);
      const centre = point ?? { x: design.width / 2, y: design.height / 2 };
      return createImage({
        name: image.name,
        src: image.src,
        width: size.width,
        height: size.height,
        x: centre.x - size.width / 2 + index * 24,
        y: centre.y - size.height / 2 + index * 24,
      });
    },
    [design.height, design.width],
  );

  const placeImage = useCallback(
    (image: LoadedImage) => editor.addMany([imageElement(image)]),
    [editor.addMany, imageElement],
  );

  const addImageFiles = useCallback(
    (files: File[], point?: Point) => {
      Promise.all(files.map(readImageFile))
        .then((loaded) => {
          const images = loaded.filter((image): image is LoadedImage => image !== null);
          setUploads((current) => [...images, ...current]);
          editor.addMany(images.map((image, index) => imageElement(image, point, index)));
        })
        .catch(() => undefined);
    },
    [editor.addMany, imageElement],
  );

  const onZoom = useCallback(
    (direction: ZoomDirection) => {
      if (direction === 'fit') {
        setUserZoom(null);
      } else {
        setUserZoom(direction === 'actual' ? 1 : stepZoom(zoom, direction));
      }
    },
    [zoom],
  );

  const addElement = useCallback((element: DesignElement) => editor.addElement(element), [editor]);

  const actions = useSelectionActions(editor);
  const [helpOpen, setHelpOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState<Point | null>(null);
  const [view, setView] = useState({ grid: false, snap: true });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const closeContextMenu = useCallback(() => setContextPoint(null), []);

  useEditorShortcuts({
    editor,
    actions,
    onZoom,
    onHelp: () => setHelpOpen(true),
    onSave: () => setSavedAt(Date.now()),
    onExport: () => {
      exportImage(design, 'png', 1).catch(() => undefined);
    },
    onPasteFiles: (files) => addImageFiles(files),
  });

  const panels: SidebarPanel[] = [
    {
      id: 'templates',
      label: 'Templates',
      Icon: LayoutTemplate,
      render: () => <TemplatesPanel onApply={(poster) => editor.applyTemplate(poster.build())} />,
    },
    {
      id: 'elements',
      label: 'Elements',
      Icon: Shapes,
      render: () => <ElementsPanel onAdd={addElement} />,
    },
    { id: 'text', label: 'Text', Icon: Type, render: () => <TextPanel onAdd={addElement} /> },
    {
      id: 'photos',
      label: 'Photos',
      Icon: Camera,
      render: () => <PhotosPanel onPlace={(image) => placeImage(image)} />,
    },
    {
      id: 'uploads',
      label: 'Uploads',
      Icon: Upload,
      render: () => (
        <UploadsPanel
          uploads={uploads}
          onFiles={(files) => addImageFiles(files)}
          onPlace={(image) => placeImage(image)}
        />
      ),
    },
    {
      id: 'placeholder',
      label: 'Frame',
      Icon: ImageIcon,
      render: () => (
        <button
          type="button"
          onClick={() => editor.addElement(createImage({ name: 'Image frame' }))}
          className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm hover:bg-accent"
        >
          Add an image frame
        </button>
      ),
    },
    {
      id: 'background',
      label: 'Background',
      Icon: PaintBucket,
      render: () => (
        <BackgroundPanel
          fill={editor.design.background}
          onChange={editor.setBackgroundFill}
          onCommit={editor.seal}
        />
      ),
    },
    { id: 'layers', label: 'Layers', Icon: Layers, render: () => <LayersPanel editor={editor} /> },
  ];

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col" data-testid="design-editor">
      <EditorHeader
        editor={editor}
        zoom={zoom}
        backHref={backHref}
        onZoom={onZoom}
        onOpen={(next) => editor.load(next)}
        savedAt={savedAt}
        view={view}
        onViewChange={setView}
        onHelp={() => setHelpOpen(true)}
        onReset={() => {
          forgetSaved(storageKey);
          editor.load(initialDesign);
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <EditorSidebar
          panels={panels}
          {...(initialPanel === undefined ? {} : { initial: initialPanel })}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <CanvasWorkspace
            editor={editor}
            zoom={zoom}
            fontsVersion={fontsVersion}
            onZoomChange={setUserZoom}
            onViewportChange={setViewport}
            onDropFiles={(files, point) => addImageFiles(files, point)}
            onDropImage={(image, point) => editor.addMany([imageElement(image, point)])}
            onContextMenu={setContextPoint}
            snapEnabled={view.snap}
            showGrid={view.grid}
          />
        </div>
        <button
          type="button"
          onClick={() => setPropertiesOpen((open) => !open)}
          aria-expanded={propertiesOpen}
          className="fixed right-4 bottom-20 z-50 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 font-medium text-sm text-white shadow-lg md:bottom-6 lg:hidden"
        >
          <SlidersHorizontal className="size-4" /> {propertiesOpen ? 'Close' : 'Properties'}
        </button>
        <aside
          className={cn(
            'shrink-0 overflow-y-auto bg-background lg:static lg:block lg:w-[280px] xl:w-[320px] lg:border-l lg:shadow-none',
            propertiesOpen
              ? 'fixed inset-x-0 bottom-0 z-40 block h-[60dvh] rounded-t-2xl border-t shadow-2xl md:inset-x-auto md:top-28 md:right-0 md:h-auto md:w-[280px] md:rounded-none md:border-t-0 md:border-l'
              : 'hidden',
          )}
          aria-label="Properties"
        >
          <DocumentColorsProvider design={design}>
            <PropertiesPanel editor={editor} />
          </DocumentColorsProvider>
        </aside>
      </div>
      <ShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <EditorContextMenu
        point={contextPoint}
        editor={editor}
        actions={actions}
        onClose={closeContextMenu}
      />
      <MediaAgent
        kind="poster"
        title={design.title}
        document={design}
        focus={editor.selectedIds}
        onChange={(next) => editor.transform(() => next)}
      />
    </div>
  );
};
