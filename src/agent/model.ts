import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { APICallError, type LanguageModel } from 'ai';

export const PRIMARY_MODEL = 'google/gemini-3.7-flash';
export const FALLBACK_MODEL = 'google/gemini-3.5-flash';

export const agentModel = (): LanguageModel =>
  createOpenRouter()(PRIMARY_MODEL, { models: [PRIMARY_MODEL, FALLBACK_MODEL] });

const statusOf = (error: unknown): number | undefined => {
  if (APICallError.isInstance(error)) {
    return error.statusCode;
  }
  if (typeof error === 'object' && error !== null && 'lastError' in error) {
    return statusOf(error.lastError);
  }
  return undefined;
};

export const describeAgentError = (error: unknown): string => {
  const status = statusOf(error);
  if (status === 401 || status === 402 || status === 403) {
    return 'The AI editor is not available right now. Check the API key and credits.';
  }
  if (status === 429) {
    return 'The AI usage limit has been reached. Try again later.';
  }
  if (status !== undefined && status >= 500) {
    return 'The AI model is busy right now. Try again in a moment.';
  }
  return 'Something went wrong while editing. Try again.';
};
