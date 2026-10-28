import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { z } from 'zod';
import { checkMedia } from '@/agent/media';
import type { Project } from '@/project';

export interface SharedVideo {
  title: string;
  project: Project;
}

export type DecodedVideo = { ok: true; video: SharedVideo } | { ok: false; error: string };

const sharedVideoSchema = z.object({ title: z.string(), project: z.unknown() });

export const checkVideo = (value: unknown): DecodedVideo => {
  const shared = sharedVideoSchema.safeParse(value);
  if (!shared.success) {
    return { ok: false, error: 'A video is { title, project }.' };
  }
  const checked = checkMedia('clip', shared.data.project);
  return checked.ok
    ? { ok: true, video: { title: shared.data.title, project: checked.document } }
    : checked;
};

export const encodeVideo = (video: SharedVideo): string =>
  compressToEncodedURIComponent(JSON.stringify(video));

export const decodeVideo = (data: string): DecodedVideo => {
  try {
    const json = decompressFromEncodedURIComponent(data);
    return json === '' || json === null
      ? { ok: false, error: 'This link does not hold a video.' }
      : checkVideo(JSON.parse(json));
  } catch {
    return { ok: false, error: 'This link does not hold a video.' };
  }
};

export const videoUrl = (origin: string, video: SharedVideo): string =>
  `${origin}/video#${encodeVideo(video)}`;

export const videoKey = (data: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < data.length; index += 1) {
    hash = Math.imul(hash ^ data.charCodeAt(index), 0x01000193);
  }
  return (hash >>> 0).toString(36);
};
