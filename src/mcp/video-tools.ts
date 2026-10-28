import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { checkMedia } from '@/agent/media';
import type { Project } from '@/project';
import { getClipMeta, isClipId } from '@/schemas';
import { ORIENTATIONS } from './clip-search';
import { failure, json } from './results';
import { type ClipPlacement, createVideoProject, placeClip } from './video-builder';
import { checkVideo, type SharedVideo, videoUrl } from './video-link';

const placementInput = z.object({
  clipId: z.string(),
  props: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Prop overrides merged deeply over the clip defaults, see get_clip'),
  durationInFrames: z.number().int().min(1).optional(),
});

const videoInput = z
  .object({ title: z.string(), project: z.record(z.string(), z.unknown()) })
  .describe(
    'The video object exactly as the last create_video, add_clip or edit_video returned it',
  );

const outline = (project: Project) =>
  project.tracks.map((track, trackIndex) => ({
    track: trackIndex,
    name: track.name,
    elements: track.elements.map((element, elementIndex) => ({
      path: `/tracks/${trackIndex}/elements/${elementIndex}`,
      type: element.type,
      clip:
        element.type === 'composition' && isClipId(element.clipId)
          ? `${element.clipId} (${getClipMeta(element.clipId).title})`
          : undefined,
      from: element.from,
      durationInFrames: element.durationInFrames,
    })),
  }));

const toPlacement = (input: z.infer<typeof placementInput>): ClipPlacement => ({
  ...input,
  clipId: input.clipId as ClipPlacement['clipId'],
});

export const registerVideoTools = (server: McpServer, origin: string): void => {
  const result = (video: SharedVideo): CallToolResult =>
    json({
      editorUrl: videoUrl(origin, video),
      seconds: Math.round((video.project.durationInFrames / video.project.fps) * 10) / 10,
      size: `${video.project.width}x${video.project.height}`,
      timeline: outline(video.project),
      video,
    });

  const withVideo = (
    input: z.infer<typeof videoInput>,
    run: (video: SharedVideo) => CallToolResult,
  ): CallToolResult => {
    const checked = checkVideo(input);
    return checked.ok ? run(checked.video) : failure(checked.error);
  };

  server.registerTool(
    'create_video',
    {
      title: 'Create a video',
      description:
        'Build a new video from clips played one after another on the first track. Returns the video object, which you pass to add_clip and edit_video, and an editorUrl that opens it in the browser editor. Nothing is stored on the server: always share the newest editorUrl. Without an orientation the video takes the size of the first clip.',
      inputSchema: {
        title: z.string().min(1),
        orientation: z.enum(ORIENTATIONS).optional(),
        fps: z.number().int().min(12).max(60).optional(),
        background: z.string().optional().describe('Hex colour behind every clip'),
        clips: z.array(placementInput).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    ({ title, orientation, fps, background, clips = [] }) => {
      const unknown = clips.map((clip) => clip.clipId).filter((clipId) => !isClipId(clipId));
      if (unknown.length > 0) {
        return failure(`Unknown clip ids: ${unknown.join(', ')}. Use search_clips.`);
      }
      const checked = checkMedia(
        'clip',
        createVideoProject({ orientation, fps, background, clips: clips.map(toPlacement) }),
      );
      return checked.ok ? result({ title, project: checked.document }) : failure(checked.error);
    },
  );

  server.registerTool(
    'add_clip',
    {
      title: 'Add a clip',
      description:
        'Add a clip to a video. By default it goes at the end of the first track; set from (frame) to place it elsewhere or track to layer it (track 0 is the top layer). The video grows to fit.',
      inputSchema: {
        video: videoInput,
        ...placementInput.shape,
        from: z.number().int().min(0).optional(),
        track: z.number().int().min(0).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    ({ video, clipId, props, durationInFrames, from, track }) =>
      withVideo(video, (current) => {
        if (!isClipId(clipId)) {
          return failure(`Unknown clipId "${clipId}". Use search_clips.`);
        }
        const checked = checkMedia(
          'clip',
          placeClip(current.project, { clipId, props, durationInFrames, from, track }),
        );
        return checked.ok
          ? result({ title: current.title, project: checked.document })
          : failure(checked.error);
      }),
  );

  server.registerTool(
    'edit_video',
    {
      title: 'Edit a video',
      description:
        "Change a video with RFC 6902 JSON Patch operations against video.project (paths like /tracks/0/elements/1/props/headline, see the timeline outline and get_clip for each clip's props). Batch related changes in one call. The result is validated against the project and clip schemas; on failure nothing changes and the error says what to fix. To recolour a clip, replace the first path of a colour role and its linked paths follow.",
      inputSchema: {
        video: videoInput,
        title: z.string().min(1).optional().describe('A new title for the video'),
        operations: z.array(editOperationSchema),
      },
      annotations: { readOnlyHint: true },
    },
    ({ video, title, operations }) =>
      withVideo(video, (current) => {
        const edited = applyEdits('clip', current.project, operations);
        return edited.ok
          ? result({ title: title ?? current.title, project: edited.document })
          : failure(edited.error);
      }),
  );
};
