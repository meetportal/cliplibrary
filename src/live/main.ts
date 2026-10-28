import { liveExportsDir } from '@/render/paths';
import { renderProjectFrame } from '@/render/render-frame';
import { DEFAULT_RENDER_OPTIONS } from '@/render/render-options';
import { renderProject } from '@/render/render-project';
import { LIVE_EDITOR_URL, LIVE_SERVER_PORT } from './live.config';
import { startLiveServer } from './live-server';
import { createSessionStore } from './session-store';

const server = startLiveServer({
  port: LIVE_SERVER_PORT,
  appUrl: LIVE_EDITOR_URL,
  store: createSessionStore(),
  renderer: {
    frame: (project, frame) => renderProjectFrame(project, frame),
    video: async (project, name) =>
      (
        await renderProject({
          project,
          name,
          outDir: liveExportsDir,
          options: DEFAULT_RENDER_OPTIONS,
        })
      ).video,
  },
});

console.info(`Clip Library live server on ${server.url.href}`);
console.info(`MCP endpoint: ${server.url.href}mcp`);
console.info(`Editor: ${LIVE_EDITOR_URL}/live`);
