import {
  type ChevronMarkAssembleProps,
  chevronMarkAssembleBase,
  chevronMarkAssembleMeta,
  chevronMarkAssembleSchema,
} from '../../chevron-mark-assemble-common';
import type { ClipMeta } from '../../registry';

export const chevronMarkAssembleASchema = chevronMarkAssembleSchema;

export type ChevronMarkAssembleAProps = ChevronMarkAssembleProps;

export const chevronMarkAssembleADefaults: ChevronMarkAssembleAProps = {
  ...chevronMarkAssembleBase,
  brand: { ...chevronMarkAssembleBase.brand, logo: '{{Logo}}', name: '{{Company Name}}' },
};

export const chevronMarkAssembleAMeta: ClipMeta = chevronMarkAssembleMeta('a', {
  id: 'chevron-mark-assemble-a',
  title: 'Chevron Mark Assemble A',
  description:
    'Squares tumble on flipping black and white fields, lock into a chevron mark, then the field fades to black and the mark becomes an emblem over the logo and name.',
  source: 'src/compositions/scenes/brand/chevron-mark-assemble-a.tsx',
  theme: 'dark',
  tags: ['logo', 'drop', 'flip', 'minimal', 'end-card'],
});
