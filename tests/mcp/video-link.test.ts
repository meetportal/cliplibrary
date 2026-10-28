import { describe, expect, it } from 'bun:test';
import { seedProjectForClip } from '@/core';
import { checkVideo, decodeVideo, encodeVideo, videoKey, videoUrl } from '@/mcp/video-link';

const video = { title: 'Launch', project: seedProjectForClip('brand-reveal') };

describe('video links', () => {
  it('round-trips a video through the url fragment', () => {
    const url = videoUrl('https://clips.test', video);
    expect(url.startsWith('https://clips.test/video#')).toBe(true);
    expect(decodeVideo(url.split('#')[1] ?? '')).toEqual({ ok: true, video });
  });

  it('rejects data that is not a valid video', () => {
    expect(decodeVideo('not-a-video').ok).toBe(false);
    expect(decodeVideo(encodeVideo({ ...video, project: { ...video.project, fps: -1 } })).ok).toBe(
      false,
    );
    expect(checkVideo({ project: video.project }).ok).toBe(false);
  });

  it('keys saved edits by link', () => {
    const data = encodeVideo(video);
    expect(videoKey(data)).toBe(videoKey(data));
    expect(videoKey(data)).not.toBe(videoKey(encodeVideo({ ...video, title: 'Other' })));
  });
});
