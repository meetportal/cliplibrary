import { google } from '@ai-sdk/google';
import type { LanguageModelV4CallOptions, LanguageModelV4StreamResult } from '@ai-sdk/provider';
import { APICallError, type LanguageModel, wrapLanguageModel } from 'ai';

const PRIMARY_MODEL = 'gemini-3.7-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash';
const PRIMARY_WAIT_MS = 12_000;

const isOverloaded = (error: unknown): boolean =>
  APICallError.isInstance(error) && (error.statusCode === 503 || error.statusCode === 429);

const streamWithin = async (
  stream: (params: LanguageModelV4CallOptions) => PromiseLike<LanguageModelV4StreamResult>,
  params: LanguageModelV4CallOptions,
): Promise<LanguageModelV4StreamResult | null> => {
  const slow = new AbortController();
  const timer = setTimeout(() => slow.abort(), PRIMARY_WAIT_MS);
  const signals =
    params.abortSignal === undefined ? [slow.signal] : [params.abortSignal, slow.signal];
  try {
    return await stream({ ...params, abortSignal: AbortSignal.any(signals) });
  } catch (error) {
    if (params.abortSignal?.aborted !== true && (slow.signal.aborted || isOverloaded(error))) {
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const agentModel = (): LanguageModel => {
  const primary = google(PRIMARY_MODEL);
  const fallback = google(FALLBACK_MODEL);
  return wrapLanguageModel({
    model: primary,
    middleware: {
      specificationVersion: 'v4',
      wrapStream: async ({ params }) =>
        (await streamWithin((options) => primary.doStream(options), params)) ??
        fallback.doStream(params),
    },
  });
};
