import { type InferUITools, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { restoreAssets } from './assets';
import { applyEdits, type EditOperation, editOperationSchema } from './edits';
import type { MediaKind } from './media';

const editOutputSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), operations: z.array(editOperationSchema) }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

type EditOutput = z.infer<typeof editOutputSchema>;

export const createMediaTools = (kind: MediaKind, document: unknown, assets: readonly string[]) => {
  let current = document;
  return {
    editMedia: tool({
      description:
        'Apply RFC 6902 JSON Patch operations to the current media document. The result is validated against the schema; on failure nothing changes and the error is returned.',
      inputSchema: z.object({
        summary: z.string().describe('A short plain-English label for the change'),
        operations: z.array(editOperationSchema).min(1),
      }),
      outputSchema: editOutputSchema,
      execute: ({ operations }): EditOutput => {
        const result = applyEdits(kind, current, operations);
        if (!result.ok) {
          return { ok: false, error: result.error };
        }
        current = result.document;
        return { ok: true, operations: restoreAssets(operations, assets) as EditOperation[] };
      },
      toModelOutput: ({ output }) =>
        output.ok
          ? { type: 'text', value: 'Applied. The editor now shows the change.' }
          : { type: 'error-text', value: output.error },
    }),
  };
};

export type MediaAgentMessage = UIMessage<
  never,
  never,
  InferUITools<ReturnType<typeof createMediaTools>>
>;
