import { describe, expect, it } from 'bun:test';
import { createDesign, createText, fontRoles, replaceFont } from '@/design';

const design = createDesign({
  elements: [
    createText({ id: 'a', fontFamily: 'Poppins', fontSize: 30 }),
    createText({ id: 'b', fontFamily: 'Anton', fontSize: 200 }),
    createText({ id: 'c', fontFamily: 'Poppins', fontSize: 40 }),
  ],
});

describe('font roles', () => {
  it('ranks families by their largest size', () => {
    expect(fontRoles(design.elements)).toEqual([
      { label: 'Headings', family: 'Anton', count: 1 },
      { label: 'Body', family: 'Poppins', count: 2 },
    ]);
    expect(fontRoles([createText()])[0]?.label).toBe('All text');
  });

  it('swaps one family everywhere', () => {
    const next = replaceFont(design, 'Poppins', 'Inter');
    expect(next.elements.map((element) => element.type === 'text' && element.fontFamily)).toEqual([
      'Inter',
      'Anton',
      'Inter',
    ]);
  });
});
