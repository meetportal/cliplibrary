import { startLiveServer } from '@/live/live-server';
import { createSessionStore } from '@/live/session-store';

const server = startLiveServer({
  port: 0,
  appUrl: 'http://app.test',
  store: createSessionStore(),
  renderer: {
    frame: (_project, frame) => Promise.resolve(new Uint8Array([255, 216, 255, frame])),
    video: (_project, name) => Promise.resolve(`/exports/${name}.mp4`),
  },
});

process.stdout.write(`${server.url.href}\n`);
