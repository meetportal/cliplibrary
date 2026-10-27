import { describe, expect, it } from 'bun:test';
import {
  createDesign,
  createEllipse,
  createRect,
  createText,
  derivePalette,
  linear,
  setSwatchColor,
} from '@/design';

const quiz = () =>
  createDesign({
    background: '#fbf5e6',
    elements: [
      createRect({ id: 'checks', width: 1080, height: 1350, fill: '#1f4a36' }),
      createRect({
        id: 'shadow-card',
        fill: '#133024',
        shadow: { color: 'rgba(19,48,36,0.3)', blur: 10, offsetX: 0, offsetY: 4 },
      }),
      createEllipse({ id: 'badge', fill: '#f2b632' }),
      createRect({ id: 'tint', fill: 'rgba(31,74,54,0.2)' }),
      createText({ id: 'title', text: 'QUIZ', fontSize: 120, fill: '#1b2a22' }),
      createText({ id: 'grey', text: 'credit', fill: 'rgba(0,0,0,0.5)', stroke: '#000000' }),
      createRect({ id: 'band', fill: linear(90, '#f2b632', '#1f4a36') }),
    ],
  });

describe('derivePalette', () => {
  it('names the background, text and accent roles and folds related shades together', () => {
    expect(quiz().palette).toEqual([
      { id: 'background', label: 'Background', color: '#fbf5e6', shades: [] },
      { id: 'text', label: 'Text', color: '#1b2a22', shades: [] },
      { id: 'primary', label: 'Primary', color: '#1f4a36', shades: ['#133024'] },
      { id: 'secondary', label: 'Secondary', color: '#f2b632', shades: [] },
      { id: 'accent', label: 'Accent', color: '#000000', shades: [] },
    ]);
  });

  it('returns only the background for an empty design', () => {
    expect(derivePalette({ width: 10, height: 10, background: '#ffffff', elements: [] })).toEqual([
      { id: 'background', label: 'Background', color: '#ffffff', shades: [] },
    ]);
  });
});

describe('setSwatchColor', () => {
  it('recolours every use of a role, keeping alpha and shifting shades', () => {
    const next = setSwatchColor(quiz(), 'primary', '#2244aa');
    const byId = new Map(next.elements.map((element) => [element.id, element]));
    expect(byId.get('checks')).toMatchObject({ fill: '#2244aa' });
    expect(byId.get('tint')).toMatchObject({ fill: 'rgba(34, 68, 170, 0.2)' });
    const card = byId.get('shadow-card');
    expect(card?.type === 'rect' ? card.fill : '').not.toBe('#133024');
    expect(card?.shadow?.color).not.toBe('rgba(19,48,36,0.3)');
    expect(byId.get('band')).toMatchObject({
      fill: { stops: [{ color: '#f2b632' }, { color: '#2244aa' }] },
    });
    expect(byId.get('badge')).toMatchObject({ fill: '#f2b632' });
    const primary = next.palette.find((swatch) => swatch.id === 'primary');
    expect(primary?.color).toBe('#2244aa');
    expect(primary?.shades).toEqual([card?.type === 'rect' ? String(card.fill) : '']);
  });

  it('recolours the page background through the background role', () => {
    expect(setSwatchColor(quiz(), 'background', '#000000').background).toBe('#000000');
  });

  it('leaves the design alone for an unknown role or colour', () => {
    const design = quiz();
    expect(setSwatchColor(design, 'missing', '#ffffff')).toBe(design);
    expect(setSwatchColor(design, 'primary', 'not a colour')).toBe(design);
  });
});
