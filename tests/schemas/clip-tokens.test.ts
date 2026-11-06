import { describe, expect, it } from 'bun:test';
import { seedProjectForClip } from '@/core';
import { CLIP_DEFAULTS, CLIP_IDS, clipLabel, fillTokens, tokensIn } from '@/schemas';

const samples = { 'Company Name': 'Willow & Co.', Website: 'willowandco.com' };

describe('fillTokens', () => {
  it('fills tokens inside sentences, arrays and nested objects', () => {
    const props = {
      brandName: '{{Company Name}}',
      line: 'Reserve your seat at {{Website}}',
      lines: ['{{Company Name}} presents', 'plain'],
      look: { footer: '{{Website}} / {{Company Name}}', size: 42, on: true },
    };
    expect(fillTokens(props, samples)).toEqual({
      brandName: 'Willow & Co.',
      line: 'Reserve your seat at willowandco.com',
      lines: ['Willow & Co. presents', 'plain'],
      look: { footer: 'willowandco.com / Willow & Co.', size: 42, on: true },
    });
  });

  it('leaves a token without a sample in place and never mutates its input', () => {
    const props = { title: '{{Headline}}', brand: '{{Company Name}}' };
    expect(fillTokens(props, samples)).toEqual({ title: '{{Headline}}', brand: 'Willow & Co.' });
    expect(props.brand).toBe('{{Company Name}}');
  });
});

describe('tokensIn', () => {
  it('lists every distinct token once, sorted', () => {
    expect(
      tokensIn({
        a: '{{Website}} and {{Logo}}',
        b: ['{{Website}}'],
        c: { d: 3, e: '{{Company Name}}' },
      }),
    ).toEqual(['Company Name', 'Logo', 'Website']);
    expect(tokensIn({ a: 'no tokens', b: 1 })).toEqual([]);
  });
});

describe('template clips', () => {
  it('keep raw tokens in their defaults and show samples everywhere they are seeded', () => {
    for (const id of CLIP_IDS) {
      const tokens = tokensIn(CLIP_DEFAULTS[id]);
      expect({ id, tokens }).toEqual({
        id,
        tokens: Object.keys(clipLabel(id)?.placeholders ?? {}).sort(),
      });
      expect({ id, seeded: tokensIn(seedProjectForClip(id)) }).toEqual({ id, seeded: [] });
    }
  });
});
