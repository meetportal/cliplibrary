import { type ClipLabel, clipLabel } from './clip-labels';
import type { ClipId } from './clip-props';
import { tokensIn } from './clip-tokens';
import { CLIP_DEFAULTS, CLIP_REGISTRY, getClipMeta } from './clips';
import { CLIP_VARIANTS, type ClipMeta, type ClipVariant } from './registry';

const BATCH_NAME = /^\d{4}-\d{2}-\d{2}(-[a-z0-9]+){2,}$/;

const SAMPLE_LOGOS: Record<ClipVariant, string> = {
  a: 'design-assets/logos/willow-wide.png',
  b: 'design-assets/logos/willow-square.png',
  c: 'design-assets/logos/willow-round.png',
};

const sameKeys = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length &&
  [...left].sort().every((key, at) => key === [...right].sort()[at]);

type Rule = (id: ClipId, meta: ClipMeta, label: ClipLabel) => string[];

const when = (failed: boolean, problem: string): string[] => (failed ? [problem] : []);

const naming: Rule = (id, meta) => [
  ...when(
    !BATCH_NAME.test(meta.batch ?? ''),
    `batch "${meta.batch}" is not <yyyy-mm-dd>-<source>-<what>`,
  ),
  ...(meta.variant === undefined || meta.variantOf === undefined
    ? ['a batch clip needs variant and variantOf']
    : when(
        id !== `${meta.variantOf}-${meta.variant}`,
        `id should be ${meta.variantOf}-${meta.variant}`,
      )),
];

const labelFields: Rule = (_id, _meta, label) =>
  (['concept', 'needs', 'variantNote', 'inspiration'] as const).flatMap((field) =>
    when(label[field] === undefined, `label has no ${field}`),
  );

const tokenSpecs: Rule = (id, _meta, label) => {
  const tokens = tokensIn(CLIP_DEFAULTS[id]);
  const placeholders = Object.keys(label.placeholders ?? {});
  const samples = Object.keys(label.samples ?? {});
  return [
    ...when(tokens.length === 0, 'defaults hold no {{tokens}}'),
    ...when(
      !sameKeys(tokens, placeholders),
      `placeholders ${placeholders} do not match tokens ${tokens}`,
    ),
    ...when(!sameKeys(tokens, samples), `samples ${samples} do not match tokens ${tokens}`),
  ];
};

const limits: Rule = (_id, _meta, label) => {
  const placeholders = label.placeholders ?? {};
  const companyName = placeholders['Company Name'];
  return [
    ...Object.entries(placeholders).flatMap(([name, spec]) => [
      ...when(spec.kind === 'text' && spec.maxChars === undefined, `${name} has no maxChars`),
      ...when(
        spec.kind === 'image' && spec.maxChars !== undefined,
        `${name} is an image and takes no maxChars`,
      ),
    ]),
    ...when(
      companyName !== undefined && (companyName.maxChars ?? 0) < 24,
      'Company Name must hold at least 24 characters',
    ),
  ];
};

const sampleFiles: Rule = (_id, meta, label) => {
  const samples = label.samples ?? {};
  const { Logo: logo } = samples;
  const expected = meta.variant === undefined ? undefined : SAMPLE_LOGOS[meta.variant];
  return [
    ...when(
      logo !== undefined && expected !== undefined && logo !== expected,
      `variant ${meta.variant} uses ${expected} as its sample logo`,
    ),
    ...when(
      Object.values(samples).some((value) => value.startsWith('/')),
      'bundled sample paths have no leading slash',
    ),
  ];
};

const length: Rule = (_id, meta) => {
  const seconds = meta.durationInFrames / meta.fps;
  return when(seconds < 5 || seconds > 15, `lasts ${seconds.toFixed(2)} s, outside 5 to 15 s`);
};

const RULES: readonly Rule[] = [naming, labelFields, tokenSpecs, limits, sampleFiles, length];

export const auditBatchClip = (id: ClipId): string[] => {
  const meta = getClipMeta(id);
  if (meta.batch === undefined) {
    return [];
  }
  const label = clipLabel(id);
  return label === null ? ['no label'] : RULES.flatMap((rule) => rule(id, meta, label));
};

const groupKey = (meta: ClipMeta) =>
  JSON.stringify([
    meta.batch,
    meta.width,
    meta.height,
    meta.fps,
    meta.durationInFrames,
    clipLabel(meta.id)?.inspiration,
  ]);

export const auditBatchGroups = (): string[] => {
  const groups = new Map<string, ClipMeta[]>();
  for (const meta of CLIP_REGISTRY) {
    if (meta.variantOf !== undefined) {
      groups.set(meta.variantOf, [...(groups.get(meta.variantOf) ?? []), meta]);
    }
  }
  return [...groups].flatMap(([design, members]) => {
    const problems: string[] = [];
    const letters = members.map((meta) => meta.variant ?? '').sort();
    if (!sameKeys(letters, CLIP_VARIANTS)) {
      problems.push(`${design}: variants ${letters} instead of a, b and c`);
    }
    if (CLIP_REGISTRY.some((meta) => meta.id === design)) {
      problems.push(`${design}: a clip already uses the design id`);
    }
    if (new Set(members.map(groupKey)).size > 1) {
      problems.push(`${design}: variants differ in batch, size, length or inspiration`);
    }
    return problems;
  });
};
