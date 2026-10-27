import { z } from 'zod';
import { clipControlsFor } from '@/core';
import type { Design } from '@/design';
import type { Project } from '@/project';
import { isClipId } from '@/schemas';
import { selectionNames } from './describe-path';
import type { MediaKind } from './media';

export const agentContextSchema = z.object({
  model: z.string(),
  fallbackModel: z.string(),
  kind: z.enum(['clip', 'poster']),
  title: z.string(),
  canvas: z.string(),
  timing: z.string().nullable(),
  layers: z.number(),
  elements: z.number(),
  controls: z.number(),
  selection: z.array(z.string()),
  documentBytes: z.number(),
  assets: z.number(),
  history: z.number(),
  instructions: z.string(),
});

export type AgentContext = z.infer<typeof agentContextSchema>;

export const agentMetadataSchema = z.object({
  startedAt: z.number().optional(),
  finishedAt: z.number().optional(),
  model: z.string().optional(),
  steps: z.number().optional(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  reasoningTokens: z.number().optional(),
});

export type AgentMetadata = z.infer<typeof agentMetadataSchema>;

interface ContextInput {
  kind: MediaKind;
  title: string;
  document: Project | Design;
  masked: unknown;
  focus: readonly string[];
  assets: number;
  history: number;
  instructions: string;
  model: string;
  fallbackModel: string;
}

const clipFacts = (project: Project, focus: readonly string[]) => {
  const elements = project.tracks.flatMap((track) => track.elements);
  const clipIds = [
    ...new Set(
      elements.flatMap((element) =>
        element.type === 'composition' && isClipId(element.clipId) ? [element.clipId] : [],
      ),
    ),
  ];
  return {
    canvas: `${project.width}×${project.height}`,
    timing: `${(project.durationInFrames / project.fps).toFixed(1)}s at ${project.fps}fps`,
    layers: project.tracks.length,
    elements: elements.length,
    controls: clipIds.reduce(
      (total, clipId) =>
        total +
        clipControlsFor(clipId).reduce(
          (count, section) => count + section.fields.length + section.more.length,
          0,
        ),
      0,
    ),
    selection: selectionNames('clip', project, focus),
  };
};

const posterFacts = (design: Design, focus: readonly string[]) => ({
  canvas: `${design.width}×${design.height}`,
  timing: null,
  layers: 1,
  elements: design.elements.length,
  controls: 0,
  selection: selectionNames('poster', design, focus),
});

export const buildAgentContext = (input: ContextInput): AgentContext => ({
  model: input.model,
  fallbackModel: input.fallbackModel,
  kind: input.kind,
  title: input.title,
  ...(input.kind === 'clip'
    ? clipFacts(input.document as Project, input.focus)
    : posterFacts(input.document as Design, input.focus)),
  documentBytes: JSON.stringify(input.masked).length,
  assets: input.assets,
  history: input.history,
  instructions: input.instructions,
});
