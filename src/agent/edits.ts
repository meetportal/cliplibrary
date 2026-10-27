import { applyPatch, type Operation } from 'fast-json-patch';
import { z } from 'zod';
import { checkMedia, type MediaCheck, type MediaKind } from './media';

export const editOperationSchema = z.object({
  op: z.enum(['add', 'remove', 'replace', 'move', 'copy']),
  path: z.string().describe('JSON pointer into the document, for example /elements/2/fill'),
  from: z.string().optional().describe('Source JSON pointer, only for move and copy'),
  value: z.unknown().optional().describe('New value, only for add and replace'),
});

export type EditOperation = z.infer<typeof editOperationSchema>;

const toPatch = (operation: EditOperation): Operation => {
  if (operation.op === 'remove') {
    return { op: 'remove', path: operation.path };
  }
  if (operation.op === 'move' || operation.op === 'copy') {
    return { op: operation.op, path: operation.path, from: operation.from ?? '' };
  }
  return { op: operation.op, path: operation.path, value: operation.value };
};

export const applyEdits = <K extends MediaKind>(
  kind: K,
  document: unknown,
  operations: readonly EditOperation[],
): MediaCheck<K> => {
  let patched: unknown;
  try {
    patched = applyPatch(
      structuredClone(document),
      operations.map(toPatch),
      true,
      false,
    ).newDocument;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  return checkMedia(kind, patched);
};
