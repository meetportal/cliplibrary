import { z } from 'zod';
import { clipControlsFor } from '@/core';
import { designSchema, FONT_FAMILIES } from '@/design';
import { type Project, projectSchema } from '@/project';
import { CLIP_SCHEMAS, getClipMeta, isClipId } from '@/schemas';
import type { MediaKind } from './media';

const jsonSchema = (schema: z.ZodType): string =>
  JSON.stringify(z.toJSONSchema(schema, { unrepresentable: 'any' }));

const SHARED_RULES = `Rules:
- Change the media only by calling the editMedia tool with RFC 6902 JSON Patch operations against the current document. Paths are JSON pointers from the document root.
- Batch every operation for one request into a single editMedia call. Prefer "replace" on existing fields.
- Every value must satisfy the schema. Colors are hex strings like #1f2937. New elements need a fresh unique id.
- Strings like asset://3 stand for uploaded media. Keep or move them, never invent new ones.
- If editMedia returns an error, read it, fix the operations and call editMedia again.
- When the user says "this", "it" or "the selected one", they mean the selected elements.
- Before calling editMedia, write one short plain sentence telling the user what you are changing. Once editMedia succeeds you are done, so do not add more text. Never paste JSON or patch operations into the reply.
- If the request is unclear, make the most sensible change instead of asking. If the request cannot be done with this document, say so briefly.`;

const clipFieldGuide = (clipId: string): string =>
  clipControlsFor(clipId)
    .map((section) => {
      const fields = [...section.fields, ...section.more].map((entry) => {
        const path = entry.targets.map((target) => target.join('/')).join(', ');
        const hint = entry.hint === null ? '' : ` (${entry.hint})`;
        return `  - ${entry.descriptor.label}: props/${path}${hint}`;
      });
      return [`${section.title}:`, ...fields].join('\n');
    })
    .join('\n');

const clipSections = (project: Project): string[] => {
  const clipIds = [
    ...new Set(
      project.tracks.flatMap((track) =>
        track.elements.flatMap((element) =>
          element.type === 'composition' && isClipId(element.clipId) ? [element.clipId] : [],
        ),
      ),
    ),
  ];
  return clipIds.map(
    (
      clipId,
    ) => `Animation "${clipId}" (${getClipMeta(clipId).title}), the props of its composition elements:
Field guide (label: path inside props):
${clipFieldGuide(clipId)}
Props JSON schema: ${jsonSchema(CLIP_SCHEMAS[clipId])}`,
  );
};

const clipInstructions = (title: string, document: unknown): string => {
  const parsed = projectSchema.safeParse(document);
  return `You are the editing agent for the animated video clip "${title}" in a browser video editor.
The document is a Remotion project: fps, width x height in pixels, durationInFrames, and tracks of timed elements. The first track is the top visual layer. Element transform x/y are pixel offsets from the centre.
Most of the clip's look lives in the props of its "composition" elements, for example /tracks/0/elements/0/props/headline.

${SHARED_RULES}

Project JSON schema: ${jsonSchema(projectSchema)}

${parsed.success ? clipSections(parsed.data).join('\n\n') : ''}`;
};

const posterInstructions = (title: string): string =>
  `You are the editing agent for the poster design "${title}" in a browser image editor.
The document is one page: width x height in pixels, a background fill, and elements painted in array order, so later elements sit on top. x and y are the top-left corner in pixels.
Elements sharing a groupId move together. Locked elements should only change when the user asks for them by name.

${SHARED_RULES}
- Fonts must be one of: ${FONT_FAMILIES.map((font) => font.family).join(', ')}.
- Keep every element inside the page.

Design JSON schema: ${jsonSchema(designSchema)}`;

export const mediaInstructions = (
  kind: MediaKind,
  title: string,
  document: unknown,
  focus: readonly string[],
): string => {
  const base = kind === 'clip' ? clipInstructions(title, document) : posterInstructions(title);
  const selection =
    focus.length === 0 ? 'Nothing is selected.' : `Selected element ids: ${focus.join(', ')}.`;
  return `${base}

${selection}

Current document:
${JSON.stringify(document)}`;
};
