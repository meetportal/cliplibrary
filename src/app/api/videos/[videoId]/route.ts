import { z } from 'zod';
import { dropObjectUrls } from '@/agent/assets';
import { checkMedia } from '@/agent/media';
import { updateVideo } from '@/db/videos';
import { currentUserId } from '@/lib/session';

type Context = { params: Promise<{ videoId: string }> };

const changeSchema = z.object({ project: z.unknown() });

export const PUT = async (request: Request, { params }: Context) => {
  const userId = await currentUserId();
  if (userId === null) {
    return Response.json({ problem: 'Sign in to continue.' }, { status: 401 });
  }
  const change = changeSchema.safeParse(await request.json().catch(() => null));
  const checked = checkMedia('clip', change.success ? dropObjectUrls(change.data.project) : null);
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  const video = await updateVideo(userId, (await params).videoId, { project: checked.document });
  return video === null
    ? Response.json({ problem: 'That video does not exist.' }, { status: 404 })
    : Response.json({ updatedAt: video.updatedAt.toISOString() });
};
