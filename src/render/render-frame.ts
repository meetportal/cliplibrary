import { renderStill, selectComposition } from '@remotion/renderer';
import type { Project } from '@/project';
import { BROWSER_RENDER_OPTIONS } from './render-options';
import { getServeUrl } from './serve-url';

const PROJECT_COMPOSITION_ID = 'project';

export const renderProjectFrame = async (
  project: Project,
  frame: number,
  scale = 0.5,
): Promise<Uint8Array> => {
  const serveUrl = await getServeUrl();
  const inputProps = project as unknown as Record<string, unknown>;
  const composition = await selectComposition({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    id: PROJECT_COMPOSITION_ID,
    inputProps,
  });
  const { buffer } = await renderStill({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    frame: Math.min(Math.max(Math.round(frame), 0), composition.durationInFrames - 1),
    imageFormat: 'jpeg',
    jpegQuality: 80,
    scale,
  });
  if (buffer === null) {
    throw new Error('The renderer returned no image.');
  }
  return new Uint8Array(buffer);
};
