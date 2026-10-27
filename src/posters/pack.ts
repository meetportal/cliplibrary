import {
  createDesign,
  type Design,
  type DesignElement,
  mergePatterns,
  type RectElement,
} from '@/design';
import type { ClipTheme, PosterCategory, PosterTag } from '@/schemas';
import { flatten } from './kit/elements';
import type { Template } from './kit/template';

export interface PosterMeta {
  id: string;
  packId: string;
  title: string;
  description: string;
  category: PosterCategory;
  tags: readonly PosterTag[];
  theme: ClipTheme;
  width: number;
  height: number;
}

export interface Poster {
  meta: PosterMeta;
  build: () => Design;
}

export interface PosterPackSpec extends Omit<PosterMeta, 'id' | 'packId' | 'width' | 'height'> {
  id: string;
  designs: readonly Template[];
}

const isBackdrop = (
  element: DesignElement | undefined,
  width: number,
  height: number,
): element is RectElement =>
  element !== undefined &&
  element.type === 'rect' &&
  element.x === 0 &&
  element.y === 0 &&
  element.width === width &&
  element.height === height &&
  element.rotation === 0 &&
  element.opacity === 1 &&
  element.strokeWidth === 0 &&
  element.cornerRadius === 0 &&
  element.shadow === undefined;

export const templateDesign = (item: Template, id: string, title: string): Design => {
  const elements = mergePatterns(flatten(item.build()));
  const [first, ...rest] = elements;
  return createDesign({
    id,
    title,
    width: item.width,
    height: item.height,
    ...(isBackdrop(first, item.width, item.height)
      ? { background: first.fill, elements: rest }
      : { elements }),
  });
};

export const posterNumber = (index: number): string => String(index + 1).padStart(2, '0');

export const definePack = ({ id, designs, title, ...meta }: PosterPackSpec): Poster[] =>
  [...new Set(designs)].map((item, index) => {
    const posterId = `${id}-${posterNumber(index)}`;
    const posterTitle = `${title} ${index + 1}`;
    return {
      meta: {
        ...meta,
        id: posterId,
        packId: id,
        title: posterTitle,
        width: item.width,
        height: item.height,
      },
      build: () => templateDesign(item, posterId, posterTitle),
    };
  });
