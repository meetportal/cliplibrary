import { clipLabel } from './clip-labels';
import type { ClipId } from './clip-props';
import { CLIP_DEFAULTS } from './clips';

const TOKEN = /\{\{([^{}]+)\}\}/g;

type Samples = Readonly<Record<string, string>>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const fillValue = (value: unknown, samples: Samples): unknown => {
  if (typeof value === 'string') {
    return value.replace(TOKEN, (match, name: string) => samples[name] ?? match);
  }
  if (Array.isArray(value)) {
    return value.map((item) => fillValue(item, samples));
  }
  return isRecord(value) ? fillTokens(value, samples) : value;
};

export const fillTokens = (
  props: Readonly<Record<string, unknown>>,
  samples: Samples,
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(props).map(([key, value]) => [key, fillValue(value, samples)]));

export const tokensIn = (value: unknown): string[] => {
  const found = new Set<string>();
  const visit = (item: unknown): void => {
    if (typeof item === 'string') {
      for (const match of item.matchAll(TOKEN)) {
        found.add(match[1] ?? '');
      }
    } else if (Array.isArray(item)) {
      item.forEach(visit);
    } else if (isRecord(item)) {
      Object.values(item).forEach(visit);
    }
  };
  visit(value);
  return [...found].sort();
};

export const clipSampleProps = (id: ClipId): Record<string, unknown> => {
  const defaults: unknown = CLIP_DEFAULTS[id];
  return isRecord(defaults) ? fillTokens(defaults, clipLabel(id)?.samples ?? {}) : {};
};
