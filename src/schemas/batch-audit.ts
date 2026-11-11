import { type ClipLabel, clipLabel } from './clip-labels';
import type { ClipId } from './clip-props';
import { tokensIn } from './clip-tokens';
import { CLIP_DEFAULTS, CLIP_REGISTRY, getClipMeta } from './clips';
import type { ClipMeta } from './registry';

const BATCH_NAME = /^\d{4}-\d{2}-\d{2}(-[a-z0-9]+){2,}$/;

const SAMPLE_LOGOS: readonly string[] = [
  'design-assets/logos/willow-wide.png',
  'design-assets/logos/willow-square.png',
  'design-assets/logos/willow-round.png',
];

const sameKeys = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length &&
  [...left].sort().every((key, at) => key === [...right].sort()[at]);

type Rule = (id: ClipId, meta: ClipMeta, label: ClipLabel) => string[];

const when = (failed: boolean, problem: string): string[] => (failed ? [problem] : []);

const naming: Rule = (_id, meta) =>
  when(
    !BATCH_NAME.test(meta.batch ?? ''),
    `batch "${meta.batch}" is not <yyyy-mm-dd>-<source>-<what>`,
  );

const labelFields: Rule = (_id, _meta, label) =>
  (['concept', 'needs', 'inspiration'] as const).flatMap((field) =>
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

const sampleFiles: Rule = (_id, _meta, label) => {
  const samples = label.samples ?? {};
  const { Logo: logo } = samples;
  return [
    ...when(
      logo !== undefined && !SAMPLE_LOGOS.includes(logo),
      `sample logo ${logo} is not one of ${SAMPLE_LOGOS}`,
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

export const auditBatchDesignIds = (): string[] => {
  const ids = CLIP_REGISTRY.filter((meta) => meta.batch !== undefined).map((meta) => meta.id);
  return ids
    .filter((id, at) => ids.indexOf(id) !== at)
    .map((id) => `${id}: the design id is used more than once`);
};
