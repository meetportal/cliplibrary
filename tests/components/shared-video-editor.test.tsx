import { afterEach, describe, expect, it, mock } from 'bun:test';

mock.module('@/components/clip-timeline/clip-preview', () => ({
  ClipPreview: () => null,
}));

import { render, screen } from '@testing-library/react';
import { SharedVideoEditor } from '@/components/video/shared-video-editor';
import { seedProjectForClip } from '@/core';
import { placeClip } from '@/mcp/video-builder';
import { encodeVideo } from '@/mcp/video-link';

afterEach(() => {
  window.location.hash = '';
});

describe('SharedVideoEditor', () => {
  it('opens the video carried in the link', async () => {
    const project = placeClip(seedProjectForClip('brand-reveal'), { clipId: 'cta-end-card' });
    window.location.hash = encodeVideo({ title: 'Acme launch', project });
    render(<SharedVideoEditor />);
    expect(await screen.findByText('Acme launch')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(2);
  });

  it('explains a link without a video', async () => {
    window.location.hash = 'garbage';
    render(<SharedVideoEditor />);
    expect(await screen.findByText('This video link could not be opened.')).toBeInTheDocument();
  });
});
