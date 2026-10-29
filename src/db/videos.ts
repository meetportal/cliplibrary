import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import type { Project } from '@/project';
import { database } from './client';
import { videos } from './schema';

export type VideoRow = typeof videos.$inferSelect;

export const createVideo = async (
  ownerId: string,
  video: { title: string; project: Project },
): Promise<VideoRow> => {
  const [row] = await database()
    .insert(videos)
    .values({ ownerId, ...video })
    .returning();
  if (row === undefined) {
    throw new Error('The video was not saved.');
  }
  return row;
};

export const updateVideo = async (
  ownerId: string,
  id: string,
  change: { title?: string | undefined; project: Project },
): Promise<VideoRow | null> =>
  (
    await database()
      .update(videos)
      .set({ ...change, updatedAt: new Date() })
      .where(and(eq(videos.id, id), eq(videos.ownerId, ownerId)))
      .returning()
  )[0] ?? null;

export const findVideo = async (id: string): Promise<VideoRow | null> =>
  (await database().select().from(videos).where(eq(videos.id, id)))[0] ?? null;

export const findOwnedVideo = async (ownerId: string, id: string): Promise<VideoRow | null> => {
  const video = await findVideo(id);
  return video?.ownerId === ownerId ? video : null;
};

export const listOwnedVideos = (ownerId: string) =>
  database()
    .select({ id: videos.id, title: videos.title, updatedAt: videos.updatedAt })
    .from(videos)
    .where(eq(videos.ownerId, ownerId))
    .orderBy(desc(videos.updatedAt));
