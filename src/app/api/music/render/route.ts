import { z } from 'zod';
import { requestLyriaAudio } from '@/lib/lyria';
import { accessDenied, currentAccess } from '@/lib/session';
import { RENDER_LENGTHS, songRenderPrompt, songSchema } from '@/music';

export const maxDuration = 300;

const renderRequestSchema = z.object({
  song: songSchema,
  length: z.enum(RENDER_LENGTHS),
});

export const POST = async (request: Request): Promise<Response> => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const parsed = renderRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ problem: 'Malformed render request.' }, { status: 400 });
  }
  // biome-ignore lint/style/noProcessEnv: the OpenRouter key is server-only configuration
  const { OPENROUTER_API_KEY: apiKey } = process.env;
  if (apiKey === undefined || apiKey === '') {
    return Response.json({ problem: 'AI music is not configured.' }, { status: 503 });
  }
  const { song, length } = parsed.data;
  const result = await requestLyriaAudio(
    songRenderPrompt(song, length),
    length,
    apiKey,
    request.signal,
  );
  if (!result.ok) {
    return Response.json({ problem: result.problem }, { status: result.status });
  }
  return new Response(result.audio, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  });
};
