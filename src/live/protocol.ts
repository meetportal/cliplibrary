import { z } from 'zod';
import { projectSchema } from '@/project';

const ACTIVITY_SOURCES = ['agent', 'editor'] as const;

const liveActivitySchema = z.object({
  id: z.string(),
  at: z.number(),
  source: z.enum(ACTIVITY_SOURCES),
  action: z.string(),
  summary: z.string(),
  ok: z.boolean(),
  detail: z.string().nullable(),
});

export type LiveActivity = z.infer<typeof liveActivitySchema>;

const liveSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  version: z.number().int().min(0),
  createdAt: z.number(),
  updatedAt: z.number(),
  project: projectSchema,
  activity: z.array(liveActivitySchema),
});

export type LiveSession = z.infer<typeof liveSessionSchema>;

const liveSessionSummarySchema = liveSessionSchema
  .pick({ id: true, title: true, version: true, createdAt: true, updatedAt: true })
  .extend({ clips: z.number().int().min(0), seconds: z.number() });

export type LiveSessionSummary = z.infer<typeof liveSessionSummarySchema>;

export const serverMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('sessions'), sessions: z.array(liveSessionSummarySchema) }),
  z.object({ type: z.literal('session'), session: liveSessionSchema }),
  z.object({ type: z.literal('ack'), version: z.number().int() }),
  z.object({ type: z.literal('missing'), sessionId: z.string() }),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;

export const clientMessageSchema = z.object({
  type: z.literal('replace'),
  baseVersion: z.number().int().min(0),
  project: projectSchema,
});

export const summarizeSession = (session: LiveSession): LiveSessionSummary => ({
  id: session.id,
  title: session.title,
  version: session.version,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  clips: session.project.tracks.reduce(
    (count, track) =>
      count + track.elements.filter((element) => element.type === 'composition').length,
    0,
  ),
  seconds: Math.round((session.project.durationInFrames / session.project.fps) * 10) / 10,
});
