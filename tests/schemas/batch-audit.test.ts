import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { auditBatchClip, auditBatchGroups, CLIP_IDS, clipLabel, getClipMeta } from '@/schemas';

const publicDir = join(process.cwd(), 'public');
const isBundled = (value: string) => /\.(png|jpe?g|webp|svg|mp4|webm)$/.test(value);

describe('batch clips', () => {
  it('follow the template rules', () => {
    for (const id of CLIP_IDS) {
      expect({ id, problems: auditBatchClip(id) }).toEqual({ id, problems: [] });
    }
  });

  it('ship every design as variants a, b and c of the same size, length and inspiration', () => {
    expect(auditBatchGroups()).toEqual([]);
  });

  it('bundle every sample image they name', () => {
    for (const id of CLIP_IDS) {
      if (getClipMeta(id).batch === undefined) {
        continue;
      }
      const missing = Object.values(clipLabel(id)?.samples ?? {})
        .filter(isBundled)
        .filter((path) => !(/^(https?:|data:)/.test(path) || existsSync(join(publicDir, path))));
      expect({ id, missing }).toEqual({ id, missing: [] });
    }
  });
});
