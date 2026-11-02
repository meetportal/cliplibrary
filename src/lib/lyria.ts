import 'server-only';
import { createParser } from 'eventsource-parser';
import { z } from 'zod';
import type { RenderLength } from '@/music';

const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

const LYRIA_MODELS: Record<RenderLength, string> = {
  clip: 'google/lyria-3-clip-preview',
  song: 'google/lyria-3-pro-preview',
};

const chunkSchema = z.object({
  error: z.object({ message: z.string() }).optional(),
  choices: z
    .array(z.object({ delta: z.object({ audio: z.object({ data: z.string() }).optional() }) }))
    .optional(),
});

const decodeBase64 = (data: string): Uint8Array => Uint8Array.from(Buffer.from(data, 'base64'));

type AudioSink = { enqueue: (bytes: Uint8Array) => void; fail: (error: Error) => void };

const readEvent = (data: string, sink: AudioSink): void => {
  if (data === '[DONE]') {
    return;
  }
  const chunk = chunkSchema.safeParse(JSON.parse(data));
  if (!chunk.success) {
    return;
  }
  if (chunk.data.error !== undefined) {
    sink.fail(new Error(chunk.data.error.message));
    return;
  }
  for (const choice of chunk.data.choices ?? []) {
    const audio = choice.delta.audio?.data;
    if (audio !== undefined && audio !== '') {
      sink.enqueue(decodeBase64(audio));
    }
  }
};

export const lyriaAudioStream = (body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> =>
  new ReadableStream<Uint8Array>({
    start: async (controller) => {
      let failed = false;
      const sink: AudioSink = {
        enqueue: (bytes) => controller.enqueue(bytes),
        fail: (error) => {
          failed = true;
          controller.error(error);
        },
      };
      const parser = createParser({ onEvent: (event) => readEvent(event.data, sink) });
      const decoder = new TextDecoder();
      const reader = body.getReader();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done || failed) {
          return;
        }
        parser.feed(decoder.decode(value, { stream: true }));
        return pump();
      };
      try {
        await pump();
        if (!failed) {
          controller.close();
        }
      } catch (error) {
        if (!failed) {
          controller.error(error);
        }
      }
    },
  });

export type LyriaResult =
  | { ok: true; audio: ReadableStream<Uint8Array> }
  | { ok: false; status: number; problem: string };

const problemFor = (status: number): string => {
  if (status === 401 || status === 402 || status === 403) {
    return 'AI music is not available right now. Check the API key and credits.';
  }
  if (status === 429) {
    return 'The AI usage limit has been reached. Try again later.';
  }
  return 'The music model is busy right now. Try again in a moment.';
};

export const requestLyriaAudio = async (
  prompt: string,
  length: RenderLength,
  apiKey: string,
  signal: AbortSignal,
): Promise<LyriaResult> => {
  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    signal,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LYRIA_MODELS[length],
      modalities: ['text', 'audio'],
      audio: { format: 'mp3' },
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!response.ok || response.body === null) {
    return { ok: false, status: 502, problem: problemFor(response.status) };
  }
  return { ok: true, audio: lyriaAudioStream(response.body) };
};
