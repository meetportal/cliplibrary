import { describe, expect, it } from 'bun:test';
import { CLIP_IDS, CLIP_LABELS, getClipMeta } from '@/schemas';

describe('clip labels', () => {
  it('labels every clip and nothing else', () => {
    expect(Object.keys(CLIP_LABELS).sort()).toEqual([...CLIP_IDS].sort());
  });

  it('keeps every beat inside its clip and in time order', () => {
    for (const id of CLIP_IDS) {
      const meta = getClipMeta(id);
      const seconds = meta.durationInFrames / meta.fps;
      const times = CLIP_LABELS[id]?.beats.map((beat) => beat.at) ?? [];
      expect({ id, inside: times.every((at) => at <= seconds + 0.05) }).toEqual({
        id,
        inside: true,
      });
      expect({ id, times }).toEqual({ id, times: [...times].sort((a, b) => a - b) });
    }
  });
});
