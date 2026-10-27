import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';
import { maskAssets } from '@/agent/assets';
import { mediaInstructions } from '@/agent/instructions';
import { agentRequestSchema, checkMedia } from '@/agent/media';
import { agentModel } from '@/agent/model';
import { createMediaTools, type MediaAgentMessage } from '@/agent/tools';

export const maxDuration = 60;

const badRequest = (message: string): Response =>
  Response.json({ error: message }, { status: 400 });

export const POST = async (request: Request): Promise<Response> => {
  const parsed = agentRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest('Malformed agent request.');
  }
  const { media } = parsed.data;
  const checked = checkMedia(media.kind, media.document);
  if (!checked.ok) {
    return badRequest(checked.error);
  }
  const { masked, assets } = maskAssets(checked.document);
  const tools = createMediaTools(media.kind, masked, assets);
  const messages = parsed.data.messages as MediaAgentMessage[];

  const result = streamText({
    model: agentModel(),
    instructions: mediaInstructions(media.kind, media.title, masked, media.focus),
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: stepCountIs(6),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
};
