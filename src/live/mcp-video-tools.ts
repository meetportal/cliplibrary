import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { checkMedia } from '@/agent/media';
import type { Project } from '@/project';
import { getClipMeta, isClipId } from '@/schemas';
import { ORIENTATIONS } from './clip-search';
import { failure, json } from './mcp-results';
import { type LiveSession, summarizeSession } from './protocol';
import type { SessionStore } from './session-store';
import { type ClipPlacement, createVideoProject, placeClip } from './video-builder';

export interface LiveRenderer {
  frame: (project: Project, frame: number) => Promise<Uint8Array>;
  video: (project: Project, name: string) => Promise<string>;
}

const placementInput = z.object({
  clipId: z.string(),
  props: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Prop overrides merged deeply over the clip defaults, see get_clip'),
  durationInFrames: z.number().int().min(1).optional(),
});

const outline = (project: Project) =>
  project.tracks.map((track, trackIndex) => ({
    track: trackIndex,
    name: track.name,
    elements: track.elements.map((element, elementIndex) => ({
      path: `/tracks/${trackIndex}/elements/${elementIndex}`,
      id: element.id,
      type: element.type,
      clip:
        element.type === 'composition' && isClipId(element.clipId)
          ? `${element.clipId} (${getClipMeta(element.clipId).title})`
          : undefined,
      from: element.from,
      durationInFrames: element.durationInFrames,
    })),
  }));

const unknownClips = (placements: readonly { clipId: string }[]): string[] =>
  placements.map((placement) => placement.clipId).filter((clipId) => !isClipId(clipId));

const toPlacement = (input: z.infer<typeof placementInput>): ClipPlacement => ({
  ...input,
  clipId: input.clipId as ClipPlacement['clipId'],
});

export const registerVideoTools = (
  server: McpServer,
  store: SessionStore,
  appUrl: string,
  renderer: LiveRenderer,
): void => {
  const liveUrl = (id: string): string => `${appUrl}/live/${id}`;

  const describe = (session: LiveSession) => ({
    videoId: session.id,
    liveUrl: liveUrl(session.id),
    ...summarizeSession(session),
    size: `${session.project.width}x${session.project.height}`,
    fps: session.project.fps,
    durationInFrames: session.project.durationInFrames,
    timeline: outline(session.project),
  });

  const withSession = (
    videoId: string,
    run: (session: LiveSession) => CallToolResult | Promise<CallToolResult>,
  ): CallToolResult | Promise<CallToolResult> => {
    const session = store.get(videoId);
    return session === null
      ? failure(`No video "${videoId}". Call list_videos or create_video.`)
      : run(session);
  };

  server.registerTool(
    'create_video',
    {
      title: 'Create a video',
      description:
        'Start a new video project from clips, played one after another on the first track. It opens live in the editor at the returned liveUrl, where every later change appears as it happens. Without an orientation the video takes the size of the first clip.',
      inputSchema: {
        title: z.string().min(1),
        orientation: z.enum(ORIENTATIONS).optional(),
        fps: z.number().int().min(12).max(60).optional(),
        background: z.string().optional().describe('Hex colour behind every clip'),
        clips: z.array(placementInput).optional(),
      },
    },
    ({ title, orientation, fps, background, clips = [] }) => {
      const unknown = unknownClips(clips);
      if (unknown.length > 0) {
        return failure(`Unknown clip ids: ${unknown.join(', ')}. Use search_clips.`);
      }
      const checked = checkMedia(
        'clip',
        createVideoProject({ orientation, fps, background, clips: clips.map(toPlacement) }),
      );
      if (!checked.ok) {
        return failure(checked.error);
      }
      return json(describe(store.create(title, checked.document)));
    },
  );

  server.registerTool(
    'list_videos',
    {
      title: 'List videos',
      description: 'Videos created in this live session, most recently changed first.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    () =>
      json(
        store
          .list()
          .map((session) => ({ ...summarizeSession(session), liveUrl: liveUrl(session.id) })),
      ),
  );

  server.registerTool(
    'get_video',
    {
      title: 'Get a video',
      description:
        'The full project document of a video, including any edits made by people in the editor, plus a timeline outline with the JSON pointer of every element.',
      inputSchema: { videoId: z.string() },
      annotations: { readOnlyHint: true },
    },
    ({ videoId }) =>
      withSession(videoId, (session) => json({ ...describe(session), project: session.project })),
  );

  server.registerTool(
    'add_clip',
    {
      title: 'Add a clip',
      description:
        'Add a clip to a video. By default it goes at the end of the first track; set from (frame) to place it elsewhere or track to layer it. The video grows to fit.',
      inputSchema: {
        videoId: z.string(),
        ...placementInput.shape,
        from: z.number().int().min(0).optional(),
        track: z.number().int().min(0).optional(),
      },
    },
    ({ videoId, clipId, props, durationInFrames, from, track }) =>
      withSession(videoId, (session) => {
        if (!isClipId(clipId)) {
          return failure(`Unknown clipId "${clipId}". Use search_clips.`);
        }
        const title = getClipMeta(clipId).title;
        const checked = checkMedia(
          'clip',
          placeClip(session.project, { clipId, props, durationInFrames, from, track }),
        );
        if (!checked.ok) {
          store.record(videoId, {
            source: 'agent',
            action: 'add_clip',
            summary: `Could not add ${title}`,
            ok: false,
            detail: checked.error,
          });
          return failure(checked.error);
        }
        const updated = store.update(videoId, checked.document, {
          source: 'agent',
          action: 'add_clip',
          summary: `Added ${title}`,
        });
        return json(updated === null ? null : describe(updated));
      }),
  );

  server.registerTool(
    'edit_video',
    {
      title: 'Edit a video',
      description:
        "Change a video with RFC 6902 JSON Patch operations against its project document (see get_video for paths and get_clip for each clip's props). Batch related changes in one call. The patch is validated against the project and clip schemas; on failure nothing changes and the error says what to fix. To recolour a clip, replace the first path of a colour role and its linked paths follow.",
      inputSchema: {
        videoId: z.string(),
        summary: z.string().min(1).describe('A short plain-English label shown in the live editor'),
        operations: z.array(editOperationSchema).min(1),
      },
    },
    ({ videoId, summary, operations }) =>
      withSession(videoId, (session) => {
        const result = applyEdits('clip', session.project, operations);
        if (!result.ok) {
          store.record(videoId, {
            source: 'agent',
            action: 'edit_video',
            summary,
            ok: false,
            detail: result.error,
          });
          return failure(result.error);
        }
        const updated = store.update(videoId, result.document, {
          source: 'agent',
          action: 'edit_video',
          summary,
        });
        return json(updated === null ? null : describe(updated));
      }),
  );

  server.registerTool(
    'render_frame',
    {
      title: 'Render a frame',
      description:
        'Render one frame of a video as a half-size JPEG so you can check how it looks. Pass seconds or frame; the first render bundles the scenes and can take a minute.',
      inputSchema: {
        videoId: z.string(),
        seconds: z.number().min(0).optional(),
        frame: z.number().int().min(0).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    ({ videoId, seconds, frame }) =>
      withSession(videoId, async (session) => {
        const at = frame ?? Math.round((seconds ?? 0) * session.project.fps);
        const image = await renderer.frame(session.project, at);
        store.record(videoId, {
          source: 'agent',
          action: 'render_frame',
          summary: `Looked at frame ${at}`,
        });
        return {
          content: [
            { type: 'image', data: Buffer.from(image).toString('base64'), mimeType: 'image/jpeg' },
          ],
        };
      }),
  );

  server.registerTool(
    'export_video',
    {
      title: 'Export a video',
      description: 'Render the whole video to an mp4 file on this machine and return its path.',
      inputSchema: { videoId: z.string() },
    },
    ({ videoId }) =>
      withSession(videoId, async (session) => {
        const path = await renderer.video(session.project, session.id);
        store.record(videoId, {
          source: 'agent',
          action: 'export_video',
          summary: 'Exported the video to mp4',
          detail: path,
        });
        return json({ path });
      }),
  );
};
