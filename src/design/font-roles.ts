import type { DesignElement, TextElement } from './element';

export interface FontRole {
  label: string;
  family: string;
  count: number;
}

const FONT_ROLE_LABELS = ['Headings', 'Body', 'Accent font'] as const;

const isText = (element: DesignElement): element is TextElement => element.type === 'text';

export const fontRoles = (elements: readonly DesignElement[]): FontRole[] => {
  const families = new Map<string, { size: number; count: number }>();
  for (const element of elements.filter(isText)) {
    const current = families.get(element.fontFamily) ?? { size: 0, count: 0 };
    families.set(element.fontFamily, {
      size: Math.max(current.size, element.fontSize),
      count: current.count + 1,
    });
  }
  const ranked = [...families.entries()].sort((a, b) => b[1].size - a[1].size);
  return ranked.map(([family, usage], index) => ({
    label: ranked.length === 1 ? 'All text' : (FONT_ROLE_LABELS[index] ?? `Font ${index + 1}`),
    family,
    count: usage.count,
  }));
};

export const replaceFont = <T extends { elements: readonly DesignElement[] }>(
  design: T,
  from: string,
  to: string,
): T => ({
  ...design,
  elements: design.elements.map((element) =>
    isText(element) && element.fontFamily === from ? { ...element, fontFamily: to } : element,
  ),
});
