import { humanizeKey } from '@/core';
import type { ControlEntry, ControlSectionView } from '@/core/types';

const entryPaths = (entry: ControlEntry, prefix: string): string[] =>
  entry.targets.map((target) => `${prefix}/${target.join('/')}`);

const fieldLine = (entry: ControlEntry, prefix: string): string => {
  const hint = entry.hint === null ? '' : ` (${entry.hint})`;
  const items =
    entry.descriptor.kind === 'array'
      ? `, a list of { ${entry.descriptor.item
          .map((item) => `${item.path.join('/')}: ${item.label}`)
          .join(', ')} }`
      : '';
  return `  - ${entry.descriptor.label}: ${entryPaths(entry, prefix).join(', ')}${items}${hint}`;
};

export const controlFieldGuide = (
  sections: readonly ControlSectionView[],
  prefix: string,
): string =>
  sections
    .map((section) =>
      [
        `${section.title}:`,
        ...[...section.fields, ...section.more].map((entry) => fieldLine(entry, prefix)),
      ].join('\n'),
    )
    .join('\n');

const itemLabel = (entry: ControlEntry, key: string): string =>
  entry.descriptor.kind === 'array'
    ? (entry.descriptor.item.find((item) => item.path[0] === key)?.label ?? humanizeKey(key))
    : humanizeKey(key);

export interface ControlPathTarget {
  section: string | null;
  field: string;
}

export const describeControlPath = (
  sections: readonly ControlSectionView[],
  prefix: string,
  path: string,
): ControlPathTarget => {
  const keys = (path.startsWith(prefix) ? path.slice(prefix.length) : path)
    .replace(/^\//, '')
    .split('/');
  const entries = sections.flatMap((section) =>
    [...section.fields, ...section.more].map((entry) => ({ section: section.title, entry })),
  );
  const found = entries.find(({ entry }) =>
    entry.targets.some((target) => target.every((segment, position) => keys[position] === segment)),
  );
  if (found === undefined) {
    return {
      section: null,
      field: keys
        .filter((key) => !/^\d+$/.test(key))
        .map(humanizeKey)
        .join(' › '),
    };
  }
  const depth = found.entry.targets[0]?.length ?? 0;
  const [index, ...rest] = keys.slice(depth);
  const item =
    index === undefined || !/^\d+$/.test(index)
      ? ''
      : ` ${Number(index) + 1}${rest.length > 0 ? ` › ${rest.map((key) => itemLabel(found.entry, key)).join(' › ')}` : ''}`;
  return { section: found.section, field: `${found.entry.descriptor.label}${item}` };
};
