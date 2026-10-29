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
import { agentModel, describeAgentError } from '@/agent/model';
import { createMediaTools, editSucceeded, type MediaAgentMessage } from '@/agent/tools';
import { accessDenied, currentAccess } from '@/lib/session';

export const maxDuration = 60;

const badRequest = (message: string): Response =>
  Response.json({ error: message }, { status: 400 });

export const POST = async (request: Request): Promise<Response> => {
  const access = await currentAccess();
  if (access.kind !== 'approved') {
    return accessDenied(access);
  }
  const parsed = agentRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return badRequest('Malformed agent request.');
  }
  const { media, chatTitle } = parsed.data;
  const checked = checkMedia(media.kind, media.document);
  if (!checked.ok) {
    return badRequest(checked.error);
  }
  const { masked, assets } = maskAssets(checked.document);
  const tools = createMediaTools(media.kind, masked, assets);
  const messages = parsed.data.messages as MediaAgentMessage[];

  const result = streamText({
    model: agentModel(),
    instructions: mediaInstructions({ ...media, document: masked, chatTitle }),
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: [editSucceeded, stepCountIs(6)],
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof tools, MediaAgentMessage>({
      stream: result.stream,
      onError: describeAgentError,
    }),
  });
};
