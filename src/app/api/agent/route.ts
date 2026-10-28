import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';
import { maskAssets } from '@/agent/assets';
import { mediaInstructions } from '@/agent/instructions';
import { agentRequestSchema, checkMedia } from '@/agent/media';
import { agentModel, describeAgentError, FALLBACK_MODEL, PRIMARY_MODEL } from '@/agent/model';
import { createMediaTools, editSucceeded, type MediaAgentMessage } from '@/agent/tools';
import { type AgentMetadata, buildAgentContext } from '@/agent/trace';

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
  const instructions = mediaInstructions(media.kind, media.title, masked, media.focus);
  const startedAt = Date.now();
  let steps = 0;

  const result = streamText({
    model: agentModel(),
    instructions,
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: [editSucceeded, stepCountIs(6)],
  });

  const stream = createUIMessageStream<MediaAgentMessage>({
    onError: describeAgentError,
    execute: ({ writer }) => {
      writer.write({
        type: 'data-context',
        data: buildAgentContext({
          kind: media.kind,
          title: media.title,
          document: checked.document,
          masked,
          focus: media.focus,
          assets: assets.length,
          history: messages.length,
          instructions,
          model: PRIMARY_MODEL,
          fallbackModel: FALLBACK_MODEL,
        }),
      });
      writer.merge(
        toUIMessageStream<typeof tools, MediaAgentMessage>({
          stream: result.stream,
          onError: describeAgentError,
          messageMetadata: ({ part }): AgentMetadata | undefined => {
            if (part.type === 'start') {
              return { startedAt };
            }
            if (part.type === 'finish-step') {
              steps += 1;
              return { model: part.response.modelId, steps };
            }
            if (part.type === 'finish') {
              return {
                finishedAt: Date.now(),
                inputTokens: part.totalUsage.inputTokens ?? 0,
                outputTokens: part.totalUsage.outputTokens ?? 0,
                reasoningTokens: part.totalUsage.outputTokenDetails?.reasoningTokens ?? 0,
              };
            }
            return undefined;
          },
        }),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
};
